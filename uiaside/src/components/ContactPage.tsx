import React from 'react';
import { PhoneCall, Mail, MapPin, Clock, ArrowLeft } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="h-1.5 w-full bg-blue-600"></div>
      <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
          <ArrowLeft className="h-4 w-4" /> Tilbake
        </button>
        <span className="font-black uppercase tracking-tighter text-xl">Kontakt Oss</span>
        <div className="w-20"></div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-6xl font-black tracking-tight mb-8 leading-none">Vi er her for <br /><span className="text-blue-600">å hjelpe deg.</span></h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">Har du spørsmål om byggesak, reguleringsplaner eller tekniske krav? Ta kontakt med oss via din foretrukne kanal.</p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-500 transition-all">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Sentralbord</p>
                <p className="text-xl font-black text-slate-800 tracking-tight">38 00 00 00</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-500 transition-all">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">E-post</p>
                <p className="text-lg font-black text-slate-800 tracking-tight">post@kommune.no</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-8 tracking-tight">Åpningstider & Besøk</h2>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">Sentralbord</p>
                    <p className="text-lg font-bold">Mandag - Fredag: 08:00 - 15:30</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">Besøksadresse</p>
                    <p className="text-lg font-bold leading-tight text-slate-200">Rådhusgata 18,<br />4611 Kristiansand</p>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                  <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all">
                    Se kart i Google Maps
                  </button>
                  <button className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-700 hover:bg-slate-700 transition-all">
                    Start Chat-samtale
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
