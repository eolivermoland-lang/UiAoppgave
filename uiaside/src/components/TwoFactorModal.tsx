import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, KeyRound, Loader2, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (enabled: boolean) => void;
  isEnabling: boolean;
}

const ACCOUNT_SID = 'AC652666ca63aedfb646e920b00af5b000';
const AUTH_TOKEN = 'bc04d1aa22446614f1550dc7ac06b981';
const SERVICE_SID = 'VAe75bba808c7e7db25eddab6c368af5bc';

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ isOpen, onClose, onSuccess, isEnabling }) => {
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBypass, setShowBypass] = useState(false);

  if (!isOpen) return null;

  const authHeader = 'Basic ' + btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fullPhone = `+47${phone.replace(/\s/g, '')}`;

    try {
      const response = await fetch(`/api/twilio/Services/${SERVICE_SID}/Verifications`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'To': fullPhone, 'Channel': 'sms' })
      });

      if (response.ok) {
        setStep('verify');
      } else {
        const data = await response.json();
        setError(data.message || "Twilio feil.");
        setShowBypass(true);
      }
    } catch (err: any) {
      setError("Tilkoblingsfeil.");
      setShowBypass(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fullPhone = `+47${phone.replace(/\s/g, '')}`;

    try {
      const response = await fetch(`/api/twilio/Services/${SERVICE_SID}/VerificationCheck`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'To': fullPhone, 'Code': otp })
      });

      const data = await response.json();

      if (response.ok && data.status === 'approved') {
        await saveToSupabase(fullPhone);
      } else {
        setError("Feil kode.");
      }
    } catch (err: any) {
      setError("Verifisering feilet.");
    } finally {
      setLoading(false);
    }
  };

  const saveToSupabase = async (verifiedNumber: string) => {
    // Vi lagrer ALT i metadata for å unngå Supabase sine egne SMS-sperrer
    const { error } = await supabase.auth.updateUser({ 
      data: { 
        two_factor_enabled: isEnabling,
        two_factor_phone: verifiedNumber 
      } 
    });

    if (error) {
      setError("Kunne ikke lagre til profil: " + error.message);
    } else {
      onSuccess(isEnabling);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md text-slate-900">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-md w-full rounded-[3rem] p-10 shadow-2xl relative border border-white/20">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X className="h-6 w-6" /></button>

        <div className="flex items-center gap-4 mb-10">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${isEnabling ? 'bg-blue-600' : 'bg-red-500'}`}>
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase leading-none mb-1">{isEnabling ? 'Aktiver 2FA' : 'Deaktiver 2FA'}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Twilio SMS System</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form key="phone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onSubmit={handleSendCode} className="space-y-6">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3">
                  <span className="font-black text-slate-400 text-sm">+47</span>
                </div>
                <input 
                  type="tel" required pattern="[0-9]{8}" maxLength={8}
                  placeholder="Mobilnummer"
                  className="w-full pl-20 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-black tracking-widest focus:bg-white focus:border-blue-500 outline-none transition-all"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
                  <p className="text-red-600 text-[10px] font-black uppercase flex gap-2"><AlertCircle className="h-4 w-4" /> {error}</p>
                  {showBypass && (
                    <button type="button" onClick={() => saveToSupabase(`+47${phone}`)} className="w-full py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <Zap className="h-3 w-3" /> Tving aktivering (Kun Demo)
                    </button>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Kode'}
              </button>
            </motion.form>
          ) : (
            <motion.form key="verify" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onSubmit={handleVerify} className="space-y-6">
              <input 
                type="text" required maxLength={8} placeholder="00000000"
                className="w-full px-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black tracking-[0.5em] focus:bg-white focus:border-blue-500 outline-none transition-all text-center"
                value={otp} onChange={(e) => setOtp(e.target.value)}
              />
              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Fullfør'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TwoFactorModal;
