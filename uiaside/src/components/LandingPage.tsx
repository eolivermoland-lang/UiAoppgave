import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, FileText, Map as MapIcon, 
  Search, ShieldCheck, ClipboardCheck, 
  HelpCircle, PhoneCall, User
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (view: 'rules' | 'guidance' | 'contact' | 'guide' | 'profile') => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate, onLogin, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <nav className="h-20 border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <MapIcon className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tight uppercase">ByggeSjekk</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <button onClick={() => onNavigate('rules')} className="hover:text-blue-600 transition-colors">Byggeregler</button>
          <button onClick={() => onNavigate('guidance')} className="hover:text-blue-600 transition-colors">Veiledning</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-blue-600 transition-colors">Kontakt</button>
          <div className="h-6 w-px bg-slate-200"></div>
          
          {isLoggedIn ? (
            <button 
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all cursor-pointer group"
            >
              <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase tracking-widest">Min Side</span>
            </button>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Logg inn
            </button>
          )}
        </div>
      </nav>

      <section className="relative pt-20 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Digital Selvbetjening
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter uppercase">
              Planlegger du <br />
              <span className="text-blue-600 italic">å bygge?</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-lg">
              Vår digitale byggeveileder hjelper deg å finne ut om du må søke, hvilke regler som gjelder for din tomt, og hvordan du går frem.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={onStart} className="group flex items-center gap-4 bg-blue-600 text-white px-10 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 hover:shadow-2xl shadow-blue-200 transition-all active:scale-95">
                Start veileder
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-4 bg-white text-slate-900 border-2 border-slate-100 px-10 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                Mine søknader
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative">
            <div className="aspect-square bg-slate-50 rounded-[4rem] relative overflow-hidden shadow-inner border border-slate-100 flex items-center justify-center">
              <div className="w-[80%] aspect-video bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col items-center justify-center p-8">
                <div className="h-20 w-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-6 shadow-inner">
                  <ClipboardCheck className="h-10 w-10" />
                </div>
                <p className="font-black text-slate-800 text-xl tracking-tight uppercase">Automatisk Sjekk</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Kartbasert analyse</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                <p className="font-black text-slate-800 tracking-tight text-lg leading-none uppercase italic">Verifisert</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-none">Hva kan vi hjelpe deg med?</h2>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Velg en tjeneste under</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Finn din eiendom", desc: "Søk i matrikkelen og se nøyaktige grenser, bygg og restriksjoner.", target: 'guide' },
              { icon: FileText, title: "Byggeregler", desc: "Les om avstand til nabo, høyder og hva du kan bygge uten å søke.", target: 'rules' },
              { icon: HelpCircle, title: "Få veiledning", desc: "Bestill en forhåndskonferanse med en saksbehandler i kommunen.", target: 'guidance' }
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all cursor-pointer" onClick={() => onNavigate(item.target as any)}>
                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 mb-8 shadow-inner">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase leading-none">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Gå til side <ArrowRight className="h-3 w-3" /></span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-8 border-t border-slate-100">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-white">
              <h2 className="text-4xl font-black mb-4 tracking-tight uppercase leading-tight italic">Trenger du snakke <br /> med oss?</h2>
              <p className="text-slate-400 font-medium text-lg">Våre rådgivere er tilgjengelige hverdager 08:00 - 15:30.</p>
            </div>
            <button onClick={() => onNavigate('contact')} className="flex items-center gap-4 bg-white text-slate-900 px-10 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95">
              <PhoneCall className="h-5 w-5" />
              Kontakt Oss
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 opacity-40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white"><MapIcon className="h-4 w-4" /></div>
            <span className="text-lg font-black uppercase">ByggeSjekk</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Kristiansand Kommune • Digital Utvikling</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
