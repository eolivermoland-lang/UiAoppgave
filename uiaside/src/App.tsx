import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, Bell, MapPin, Cpu, ShieldCheck, ArrowLeft, LogOut, User } from 'lucide-react';
import { supabase } from './lib/supabase';
import MapComponent from './components/MapComponent';
import QuestionsWizard from './components/QuestionsWizard';
import LandingPage from './components/LandingPage';
import BuildingRules from './components/BuildingRules';
import GuidancePage from './components/GuidancePage';
import ContactPage from './components/ContactPage';
import AuthModal from './components/AuthModal';
import ProfilePage from './components/ProfilePage';

type ViewState = 'landing' | 'guide' | 'rules' | 'guidance' | 'contact' | 'profile';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [measurement, setMeasurement] = useState<number | null>(null);
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([58.1467, 7.9949]);
  const [isSearching, setIsSearching] = useState(false);
  const [showTechInfo, setShowTechInfo] = useState(false);
  
  // Auth states
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="h-full overflow-y-auto">
            <LandingPage 
              onStart={() => setView('guide')} 
              onNavigate={(v: any) => setView(v)}
              onLogin={() => setIsAuthModalOpen(true)}
              isLoggedIn={!!session}
            />
          </motion.div>
        )}

        {view === 'rules' && (
          <motion.div key="rules" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full overflow-y-auto">
            <BuildingRules onBack={() => setView('landing')} />
          </motion.div>
        )}

        {view === 'guidance' && (
          <motion.div key="guidance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full overflow-y-auto">
            <GuidancePage onBack={() => setView('landing')} />
          </motion.div>
        )}

        {view === 'contact' && (
          <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full overflow-y-auto">
            <ContactPage onBack={() => setView('landing')} />
          </motion.div>
        )}

        {view === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full overflow-y-auto">
            <ProfilePage 
              user={session?.user} 
              onBack={() => setView('landing')} 
              onLogout={handleLogout}
              onStartGuide={() => setView('guide')}
            />
          </motion.div>
        )}

        {view === 'guide' && (
          <motion.div key="guide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col bg-[#f8fafc] text-slate-900 overflow-hidden" >
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 z-[2000]"></div>
            <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-[1001] shrink-0 shadow-sm">
              <div className="flex items-center gap-8">
                <button onClick={() => setView('landing')} className="h-11 w-11 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-white transition-all active:scale-95 group">
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
                  <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                    <MapIcon className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase text-left">ByggeSjekk</h1>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 text-left leading-none">Digital Selvbetjening</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className={`h-5 w-5 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
                  </div>
                  <input
                    id="address-search"
                    name="address-search"
                    type="text"
                    placeholder="Søk på din adresse..."
                    className="block w-full pl-12 pr-24 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-2 top-1.5 bottom-2 px-5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200">
                    Finn
                  </button>
                </div>
              </form>

              <div className="flex items-center gap-4">
                {session ? (
                  <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all" onClick={() => setView('profile')}>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-slate-800 leading-none">{session.user.email?.split('@')[0]}</span>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">Min Side</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                  >
                    Logg inn
                  </button>
                )}
              </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
              <div className="flex-1 relative bg-slate-100">
                <MapComponent onShapeCreated={setMeasurement} center={mapCenter} showBoundaries={showBoundaries} isSatellite={false} />
                <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-3">
                  <button
                    onClick={() => setShowBoundaries(!showBoundaries)}
                    className={`px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 transition-all font-black text-sm uppercase tracking-widest border-2 ${showBoundaries ? 'bg-green-600 text-white border-green-400 shadow-green-200' : 'bg-white text-slate-700 border-white hover:bg-slate-50'}`}
                  >
                    <MapPin className="h-5 w-5" />
                    {showBoundaries ? 'Eiendomsgrenser: På' : 'Vis Eiendomsgrenser'}
                  </button>
                </div>
              </div>
              <aside className="w-[450px] bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-2xl relative z-10">
                <QuestionsWizard measurement={measurement} />
              </aside>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <AnimatePresence>
        {showTechInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTechInfo(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white max-w-lg w-full rounded-[2.5rem] p-10 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600"><Cpu className="h-6 w-6" /></div>
                <h2 className="text-2xl font-black text-slate-800">Teknologi</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-6">Denne løsningen bruker <strong>Supabase</strong> for sikker autentisering og <strong>Leaflet.js</strong> for kart. Dette er valgt for å sikre personvern og hastighet.</p>
              <button onClick={() => setShowTechInfo(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Lukk</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
