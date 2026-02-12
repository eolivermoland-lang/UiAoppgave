import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  onShapeCreated: (measurement: number) => void;
  center: [number, number];
  showBoundaries: boolean;
}

const CameraController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  const lastCenter = useRef<string>("");
  useEffect(() => {
    const key = `${center[0]},${center[1]}`;
    if (lastCenter.current !== key) {
      map.flyTo(center, 18, { duration: 1.5 });
      lastCenter.current = key;
    }
  }, [center, map]);
  return null;
};

const BoundariesLayer: React.FC<{ active: boolean, onStatus: (s: string | null) => void }> = ({ active, onStatus }) => {
  const map = useMap();
  const [data, setData] = useState<any>(null);
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    if (!active) {
      setData(null);
      return;
    }

    const loadData = async () => {
      if (map.getZoom() < 15) return;
      onStatus("Henter...");
      const b = map.getBounds();
      const query = `[out:json][timeout:15];(way["building"](${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}););out geom;`;
      
      try {
        const res = await fetch(`https://overpass.osm.ch/api/interpreter?data=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.elements && json.elements.length > 0) {
          const features = json.elements.map((el: any) => ({
            type: 'Feature',
            properties: { addr: el.tags?.["addr:housenumber"] || "" },
            geometry: { type: 'Polygon', coordinates: [el.geometry.map((p: any) => [p.lon, p.lat])] }
          }));
          setData({ type: 'FeatureCollection', features });
          setUpdateKey(Math.random());
          onStatus(null);
        }
      } catch (err) { onStatus("Feil."); }
    };

    const timer = setTimeout(loadData, 800);
    map.on('moveend', loadData);
    return () => { clearTimeout(timer); map.off('moveend', loadData); };
  }, [active, map]);

  if (!active || !data) return null;

  return (
    <GeoJSON 
      key={updateKey} 
      data={data} 
      style={{ color: '#00FF00', weight: 4, fillOpacity: 0.3, fillColor: '#00FF00' }} 
      onEachFeature={(f, l) => {
        if (f.properties.addr) l.bindTooltip(f.properties.addr, { permanent: true, direction: 'center', className: 'housenumber-label' });
      }}
    />
  );
};

const GeomanControls: React.FC<{ onShapeCreated: (measurement: number) => void }> = ({ onShapeCreated }) => {
  const map = useMap();
  const tooltipRef = useRef<L.Tooltip | null>(null);

  // Hjelpefunksjon for areal
  const getLiveArea = (pts: L.LatLng[]) => {
    if (pts.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].lat * pts[j].lng;
      area -= pts[j].lat * pts[i].lng;
    }
    return Math.round(Math.abs(area) * 111319 * 111319 / 2.15);
  };

  useEffect(() => {
    if (!map) return;

    map.pm.addControls({
      position: 'topleft',
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: true,
      removalMode: true,
      dragMode: true,
    });

    map.on('pm:drawstart', (e: any) => {
      const { workingLayer, shape } = e;
      
      map.on('mousemove', (me: L.LeafletMouseEvent) => {
        if (!map.pm.Draw.getActiveShape()) return;

        if (!tooltipRef.current) {
          tooltipRef.current = L.tooltip({
            permanent: true,
            direction: 'right',
            offset: [20, 0],
            className: 'custom-measure-tooltip'
          }).setLatLng(me.latlng).addTo(map);
        } else {
          tooltipRef.current.setLatLng(me.latlng);
        }

        // Hent eksisterende punkter
        const latlngs = (workingLayer as any).getLatLngs ? (workingLayer as any).getLatLngs() : [];
        const pts = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
        
        let text = "Klikk for første punkt";
        
        if (pts.length > 0) {
          const lastPoint = pts[pts.length - 1];
          const dist = map.distance(lastPoint, me.latlng);
          
          // Legg til musepunktet i en kopi for å regne ut areal
          const virtualPts = [...pts, me.latlng];
          const area = getLiveArea(virtualPts);
          
          text = `<div>Lengde: ${dist.toFixed(1)} m</div>`;
          if (area > 0 && (shape === 'Polygon' || shape === 'Rectangle')) {
            text += `<div style="color: #4ade80; border-top: 1px solid #334155; margin-top: 4px; pt-4">Areal: ${area} m²</div>`;
          }
        }
        
        tooltipRef.current.setContent(text);
      });
    });

    map.on('pm:drawend', () => {
      map.off('mousemove');
      if (tooltipRef.current) {
        map.removeLayer(tooltipRef.current);
        tooltipRef.current = null;
      }
    });

    map.on('pm:create', (e: any) => {
      const { layer, shape } = e;
      let val = 0;
      if (shape === 'Circle') {
        val = Math.PI * Math.pow(layer.getRadius(), 2);
      } else if (layer.getLatLngs) {
        const flat = (layer.getLatLngs() as L.LatLng[][])[0];
        val = getLiveArea(flat);
      }
      onShapeCreated(Math.round(val));
    });

    return () => { map.pm.removeControls(); };
  }, [map, onShapeCreated]);

  return null;
};

const MapComponent = (props: MapComponentProps) => {
  const [status, setStatus] = useState<string | null>(null);
  return (
    <div className="w-full h-full relative">
      <MapContainer center={props.center} zoom={16} maxZoom={22} className="w-full h-full" zoomControl={false}>
        <CameraController center={props.center} />
        <ZoomControl position="bottomleft" />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={22} maxNativeZoom={19} />
        <BoundariesLayer active={props.showBoundaries} onStatus={setStatus} />
        <GeomanControls onShapeCreated={props.onShapeCreated} />
      </MapContainer>
      {status && props.showBoundaries && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-full shadow-2xl border-2 border-green-500 flex items-center gap-2 animate-bounce">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
