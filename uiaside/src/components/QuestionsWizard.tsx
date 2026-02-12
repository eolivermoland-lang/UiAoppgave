import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, HelpCircle, ArrowRight, RotateCcw, 
  MapPin, Ruler, Home, Users, AlertTriangle, 
  FileCheck, ShieldAlert, Waves, TrainFront, LandPlot, Car
} from 'lucide-react';

// Juridisk korrekte spørsmål basert på SAK10 § 4-1
const questions = [
  { 
    id: 1, 
    category: "Dimensjoner", 
    color: "bg-blue-50 text-blue-600",
    text: "Er det totale arealet (BRA/BYA) under 50 m²?", 
    details: "Dette inkluderer både innvendig areal og overbygde utearealer. Er bygget over 50 m², er det alltid søknadspliktig.",
    icon: Ruler
  },
  { 
    id: 2, 
    category: "Plassering", 
    color: "bg-indigo-50 text-indigo-600",
    text: "Plasseres bygget minst 1,0 meter fra nabogrensen?", 
    details: "Du kan ikke bygge nærmere enn 1 meter fra naboens eiendom uten søknad eller skriftlig samtykke.",
    icon: Users
  },
  { 
    id: 3, 
    category: "Plassering", 
    color: "bg-indigo-50 text-indigo-600",
    text: "Er det minst 1,0 meter avstand til andre bygninger på din egen tomt?", 
    details: "Dette er et brannsikringskrav. Bygg må stå fritt.",
    icon: Home
  },
  { 
    id: 4, 
    category: "Høyde", 
    color: "bg-purple-50 text-purple-600",
    text: "Er gesimshøyden under 3,0 meter?", 
    details: "Målt fra ferdig planert terrengs gjennomsnittsnivå rundt bygget.",
    icon: ArrowRight
  },
  { 
    id: 5, 
    category: "Høyde", 
    color: "bg-purple-50 text-purple-600",
    text: "Er mønehøyden under 4,0 meter?", 
    details: "Høyeste punkt på taket må ikke overstige 4 meter fra terrenget.",
    icon: ArrowRight
  },
  { 
    id: 6, 
    category: "Bruk", 
    color: "bg-emerald-50 text-green-600",
    text: "Skal bygget kun brukes til oppbevaring/bod/garasje?", 
    details: "Bygget kan IKKE brukes til beboelse (soverom, stue, kjøkken) eller våtrom hvis det skal være unntatt søknad.",
    icon: Home
  },
  { 
    id: 7, 
    category: "Kjeller", 
    color: "bg-emerald-50 text-green-600",
    text: "Er bygget uten kjeller?", 
    details: "Du kan ikke underbygge bygget med kjeller.",
    icon: LandPlot
  },
  { 
    id: 8, 
    category: "Regulering", 
    color: "bg-amber-50 text-amber-600",
    text: "Er du innenfor tillatt utnyttelsesgrad på tomten?", 
    details: "Sjekk reguleringsplanen. Mange tomter har en %-grense (f.eks. 30% BYA) for hvor mye som kan bygges totalt.",
    icon: FileCheck
  },
  { 
    id: 10, 
    category: "Vei", 
    color: "bg-slate-50 text-slate-600",
    text: "Er det tilstrekkelig avstand til offentlig vei?", 
    details: "Avstandskrav varierer (ofte 15m fra fylkesvei, 50m fra riksvei). Sjekk byggegrensen mot vei.",
    icon: Car
  },
  { 
    id: 11, 
    category: "Jernbane", 
    color: "bg-slate-50 text-slate-600",
    text: "Er bygget mer enn 30 meter fra jernbanelinje?", 
    details: "Jernbaneloven har strenge byggegrenser.",
    icon: TrainFront
  },
  { 
    id: 12, 
    category: "Strandsone", 
    color: "bg-blue-50 text-blue-600",
    text: "Ligger eiendommen utenfor 100-metersbeltet til sjø?", 
    details: "I strandsonen er det generelt byggeforbud med mindre reguleringsplanen sier noe annet.",
    icon: Waves
  },
  { 
    id: 13, 
    category: "Sikkerhet", 
    color: "bg-red-50 text-red-600",
    text: "Er området fritt for flom- og skredfare?", 
    details: "Sjekk NVE sine aktsomhetskart for flom og skred.",
    icon: ShieldAlert
  },
  { 
    id: 14, 
    category: "Nabo", 
    color: "bg-indigo-50 text-indigo-600",
    text: "Vil tiltaket være til lite ulempe for naboen?", 
    details: "Selv om det er lovlig, skal ikke bygget påføre naboen urimelig ulempe (skygge, innsyn).",
    icon: Users
  }
];

interface QuestionsWizardProps {
  measurement: number | null;
}

const QuestionsWizard: React.FC<QuestionsWizardProps> = ({ measurement }) => {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);
  const [failReason, setFailReason] = useState<string | null>(null);

  const currentQ = questions[index];

  const handleAnswer = (answer: boolean) => {
    // SAK10 Logikk: For disse spørsmålene kreves "JA" for å slippe søknad
    const requiresYes = [true, true, true, true, true, true, true, true, true, true, true, true, true, true]; 
    
    // Hvis svaret avviker fra det som kreves for fritak -> SØKNADSPLIKT
    if (answer !== requiresYes[index]) {
      setFailReason(currentQ.details);
      setResult('fail');
    } else {
      if (index < questions.length - 1) {
        setIndex(prev => prev + 1);
      } else {
        setResult('pass');
      }
    }
  };

  if (!measurement) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white text-center">
        <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center mb-8 animate-pulse">
          <MapPin className="h-10 w-10 text-blue-400" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tight">Start i kartet</h2>
        <p className="text-slate-400 font-medium max-w-[200px]">Tegn opp bygget ditt for å aktivere sjekklisten.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col relative overflow-hidden">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-slate-200 z-50">
        <motion.div 
          animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
          className="h-full bg-blue-600"
        />
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col p-8 pt-12"
          >
            {/* Header / Category */}
            <div className="flex justify-between items-center mb-8">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${currentQ.color}`}>
                {currentQ.category}
              </span>
              <span className="text-slate-300 font-black text-xs">{index + 1} / {questions.length}</span>
            </div>

            {/* Question Card */}
            <div className="flex-1 flex flex-col justify-center mb-8">
              <h1 className="text-3xl font-black text-slate-900 leading-tight mb-6">
                {currentQ.text}
              </h1>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4">
                <HelpCircle className="h-6 w-6 text-blue-500 shrink-0" />
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  {currentQ.details}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <button 
                onClick={() => handleAnswer(false)}
                className="py-6 rounded-3xl bg-white border-2 border-slate-100 font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
              >
                Nei
              </button>
              <button 
                onClick={() => handleAnswer(true)}
                className="py-6 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                Ja
              </button>
            </div>
            
            <button className="mt-6 text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
              Jeg vet ikke / Hopp over
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full p-8 flex flex-col justify-center items-center text-center"
          >
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-2xl ${result === 'pass' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
              {result === 'pass' ? <FileCheck className="h-16 w-16" /> : <ShieldAlert className="h-16 w-16" />}
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 mb-4 leading-none uppercase tracking-tight">
              {result === 'pass' ? 'Ingen søknad!' : 'Søknadsplikt'}
            </h2>
            
            <p className="text-lg text-slate-500 font-medium mb-12 max-w-xs leading-relaxed">
              {result === 'pass' 
                ? 'Basert på dine svar oppfyller prosjektet kravene for å bygges uten å søke kommunen.'
                : 'Sjekken stoppet fordi prosjektet ikke oppfyller alle krav for fritak. ' + failReason}
            </p>

            <div className="w-full space-y-4">
              <button className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl transition-all ${result === 'pass' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-black'}`}>
                {result === 'pass' ? 'Lagre Rapport' : 'Start Veileder'}
              </button>
              <button onClick={() => { setIndex(0); setResult(null); }} className="flex items-center justify-center gap-2 w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">
                <RotateCcw className="h-4 w-4" /> Start på nytt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionsWizard;
