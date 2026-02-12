import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, Loader2, ShieldCheck, KeyRound, Smartphone, UserPlus, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Twilio Legitimasjon (Samme som i TwoFactorModal)
const ACCOUNT_SID = 'AC652666ca63aedfb646e920b00af5b000';
const AUTH_TOKEN = 'bc04d1aa22446614f1550dc7ac06b981';
const SERVICE_SID = 'VAe75bba808c7e7db25eddab6c368af5bc';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'email' | 'password' | 'otp'>('email');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const authHeader = 'Basic ' + btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('password');
  };

  const handleFinalAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Bruker opprettet! Du kan nå logge inn.');
        setIsSignUp(false);
        setStep('email');
      } else {
        // 1. Logg inn med passord
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;

        const user = data.user;

        // 2. Sjekk om brukeren har aktivert 2FA i metadata
        if (user?.user_metadata?.two_factor_enabled && user?.phone) {
          setUserPhone(user.phone);
          
          // 3. Send SMS via Twilio Proxy
          const response = await fetch(`/api/twilio/Services/${SERVICE_SID}/Verifications`, {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'To': user.phone,
              'Channel': 'sms'
            })
          });

          if (response.ok) {
            setStep('otp');
          } else {
            const twilioData = await response.json();
            throw new Error(twilioData.message || "Kunne ikke sende SMS via Twilio.");
          }
        } else {
          // Ingen 2FA, slipp brukeren rett inn
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Feil e-post eller passord.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verifiser mot Twilio Proxy
      const response = await fetch(`/api/twilio/Services/${SERVICE_SID}/VerificationCheck`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'To': userPhone,
          'Code': otp
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'approved') {
        onClose();
      } else {
        setError("Feil sikkerhetskode. Sjekk mobilen din.");
      }
    } catch (err: any) {
      setError("Verifisering feilet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-md w-full rounded-[3rem] p-10 shadow-2xl relative border border-white/20 text-slate-900">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X className="h-6 w-6" /></button>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            {isSignUp ? <UserPlus className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase leading-none mb-1">{isSignUp ? 'Ny Bruker' : 'Logg inn'}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step === 'otp' ? 'SMS Verifisering' : 'Digital Kommune'}</p>
          </div>
        </div>

        <form onSubmit={step === 'email' ? handleNext : (step === 'otp' ? handleVerifyOtp : handleFinalAuth)} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">E-post</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="email" required className="w-full pl-14 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="navn@eksempel.no" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </motion.div>
            )}

            {step === 'password' && (
              <motion.div key="pass" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Passord</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="password" required className="w-full pl-14 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className="bg-blue-50 p-4 rounded-2xl mb-6 flex gap-3 items-start border border-blue-100">
                  <Smartphone className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-blue-800 leading-relaxed tracking-tight">To-faktor aktivert. Skriv inn den 8-sifrede koden sendt til din mobil.</p>
                </div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Sikkerhetskode (8 siffer)</label>
                <div className="relative">
                  <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" required maxLength={8} 
                    className="w-full pl-14 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black tracking-[0.2em] focus:bg-white focus:border-blue-500 outline-none transition-all text-center" 
                    placeholder="00000000" value={otp} onChange={(e) => setOtp(e.target.value)} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-red-50 p-4 rounded-xl text-red-600 text-[10px] font-black uppercase leading-tight flex gap-2 border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (step === 'email' ? 'Neste' : 'Bekreft')}
          </button>

          {step === 'email' && (
            <div className="mt-6 text-center">
              <button type="button" onClick={() => { setIsSignUp(!isSignUp); setStep('email'); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                {isSignUp ? 'Har du allerede konto? Logg inn' : 'Ny bruker? Opprett konto'}
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default AuthModal;
