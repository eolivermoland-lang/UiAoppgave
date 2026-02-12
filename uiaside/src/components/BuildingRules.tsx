import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Home, Construction, ArrowLeft, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

interface BuildingRulesProps {
  onBack: () => void;
}

const BuildingRules: React.FC<BuildingRulesProps> = ({ onBack }) => {
  const rules = [
    {
      title: "Garasje, bod og uthus",
      icon: Home,
      content: "Du kan normalt bygge inntil 50 m² uten å søke, forutsatt at bygget er minst 1 meter fra nabogrensen og har en gesimshøyde under 3 meter.",
      points: ["Maks 50 m²", "Minst 1m fra nabo", "Maks 1 etasje"]
    },
    {
      title: "Tilbygg (f.eks. veranda/terrasse)",
      icon: Construction,
      content: "Mindre tilbygg på inntil 15 m² kan ofte bygges uten søknad hvis de er mer enn 4 meter fra nabogrensen.",
      points: ["Maks 15 m²", "4m fra nabo", "Understøttet av grunnen"]
    },
    {
      title: "Høyder og avstander",
      icon: Ruler,
      content: "Hovedregelen er at bygg skal plasseres 4 meter fra nabogrensen. Høyden på bygget kan også være avgjørende for om du må søke.",
      points: ["4m hovedregel", "Mindre bygg: 1m", "Høyde påvirker utnyttelse"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="h-1.5 w-full bg-blue-600"></div>
      <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
          <ArrowLeft className="h-4 w-4" /> Tilbake
        </button>
        <span className="font-black uppercase tracking-tighter text-xl">Byggeregler</span>
        <div className="w-20"></div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 pt-16">
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-6 leading-none">Hva kan du bygge <br /><span className="text-blue-600">uten å søke?</span></h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">De fleste mindre prosjekter på egen tomt krever ikke lenger søknad til kommunen, så lenge du følger visse kriterier.</p>
        </header>

        <div className="grid md:grid-cols-1 gap-8 mb-16">
          {rules.map((rule, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10"
            >
              <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shrink-0">
                <rule.icon className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black mb-4">{rule.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">{rule.content}</p>
                <div className="flex flex-wrap gap-3">
                  {rule.points.map((p, j) => (
                    <span key={j} className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-500 border border-slate-100 uppercase tracking-widest">{p}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-blue-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-blue-200">
          <div className="h-20 w-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-2 leading-tight">Husk at du selv har ansvaret</h2>
            <p className="text-blue-100 font-medium text-lg leading-relaxed">Selv om du bygger uten å søke, er det ditt ansvar at bygget er i tråd med lovverket og reguleringsplanen for ditt område.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingRules;
