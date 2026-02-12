import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, FileText, Clock, 
  ChevronRight, ArrowLeft, LogOut, 
  Map as MapIcon, CheckCircle2, ShieldCheck,
  Bell, Lock, Save, FolderOpen, Smartphone, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import TwoFactorModal from './TwoFactorModal';

interface ProfilePageProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
  onStartGuide: () => void;
}

type Section = 'overview' | 'settings' | 'documents' | 'edit';

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBack, onLogout, onStartGuide }) => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  
  // Profil-redigering states
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || user?.email?.split('@')[0] || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.two_factor_enabled) {
      setIs2FAEnabled(true);
    }
  }, [user]);

  const handle2FASuccess = (enabled: boolean) => {
    setIs2FAEnabled(enabled);
  };

  const handleSaveName = async () => {
    setIsSavingName(true);
    setSaveSuccess(false);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      
      if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Kunne ikke lagre navnet.");
    } finally {
      setIsSavingName(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <header>
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Innstillinger</h2>
              <p className="text-slate-500 font-medium mt-2">Administrer din sikkerhet og personvern.</p>
            </header>
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              <div className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex gap-6 items-center">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 uppercase text-sm">SMS 2-faktor autentisering</p>
                    <p className="text-xs text-slate-400 font-medium max-w-md italic">Krever verifisering via SMS for å endre status.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIs2FAModalOpen(true)}
                  className={`w-14 h-7 rounded-full relative transition-all ${is2FAEnabled ? 'bg-green-500' : 'bg-slate-200'} shadow-inner`}
                >
                  <motion.div 
                    animate={{ x: is2FAEnabled ? 28 : 4 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md" 
                  />
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'edit':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <header>
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Rediger Profil</h2>
              <p className="text-slate-500 font-medium mt-2">Her kan du endre hvordan navnet ditt vises i appen.</p>
            </header>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Fullt Navn / Brukernavn</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg outline-none focus:border-blue-500 focus:bg-white transition-all" 
                    placeholder="Ditt navn"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
                >
                  {isSavingName ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Lagre endringer
                </button>
                
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                      <CheckCircle2 className="h-4 w-4" /> Profilen er oppdatert!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );

      case 'documents':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <header>
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Dokumentarkiv</h2>
            </header>
            <div className="bg-white p-20 rounded-[4rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center text-slate-300">
              <FolderOpen className="h-12 w-12 mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs">Ingen filer funnet</p>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <header className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Mine Prosjekter</h2>
              <button onClick={onStartGuide} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Ny ByggeSjekk +
              </button>
            </header>
            <div className="bg-white p-20 rounded-[4rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center text-slate-300">
              <MapIcon className="h-12 w-12 mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs">Ingen aktive prosjekter</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => setActiveSection('documents')} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group">
                <FileText className="h-8 w-8 text-slate-400 mb-6 group-hover:text-blue-600 transition-colors" />
                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Dokumenter</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Se tegninger og vedtak i ditt arkiv.</p>
              </button>
              <button onClick={() => setActiveSection('settings')} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group">
                <Settings className="h-8 w-8 text-slate-400 mb-6 group-hover:text-indigo-600 transition-colors" />
                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Innstillinger</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Administrer konto og varslinger.</p>
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="h-1.5 w-full bg-blue-600"></div>
      <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button onClick={activeSection === 'overview' ? onBack : () => setActiveSection('overview')} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
          <ArrowLeft className="h-4 w-4" /> {activeSection === 'overview' ? 'Tilbake' : 'Til Oversikt'}
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><MapIcon className="h-4 w-4" /></div>
          <span className="font-black uppercase tracking-tighter text-xl">Min Side</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-red-500 hover:text-red-600 transition-all">
          Logg ut <LogOut className="h-4 w-4" />
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 opacity-10"></div>
              <div className="h-24 w-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-black mb-1 tracking-tight">{displayName}</h2>
              <p className="text-[10px] text-slate-400 font-bold mb-8 uppercase tracking-widest italic">{user?.email}</p>
              <button onClick={() => setActiveSection('edit')} className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${activeSection === 'edit' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-500 hover:text-blue-600'}`}>
                Rediger Profil
              </button>
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-inner ${is2FAEnabled ? 'bg-green-500' : 'bg-blue-500'}`}>
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Sikkerhetsnivå</p>
                <p className="font-black text-slate-800 uppercase tracking-tight text-sm">{is2FAEnabled ? 'Høy (2FA AKTIV)' : 'Basis (Passord)'}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 min-h-[600px]">{renderContent()}</div>
        </div>
      </div>

      <TwoFactorModal 
        isOpen={is2FAModalOpen} 
        onClose={() => setIs2FAModalOpen(false)} 
        onSuccess={handle2FASuccess}
        isEnabling={!is2FAEnabled}
      />
    </div>
  );
};

export default ProfilePage;
