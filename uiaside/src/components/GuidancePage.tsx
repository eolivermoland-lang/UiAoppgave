import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, Video, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface GuidancePageProps {
  onBack: () => void;
}

const GuidancePage: React.FC<GuidancePageProps> = ({ onBack }) => {
  const steps = [
    {
      title: "Bestill konferanse",
      desc: "Velg et tidspunkt som passer for deg. Du kan velge mellom fysisk møte eller video-møte.",
      icon: Calendar
    },
    {
      title: "Forbered prosjektet",
      desc: "Send oss gjerne skisser eller en kort beskrivelse av hva du planlegger å bygge på forhånd.",
      icon: Info
    },
    {
      title: "Møt en saksbehandler",
      desc: "Vi går gjennom planene dine sammen og avklarer om du må søke og hvilke regler som gjelder.",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="h-1.5 w-full bg-blue-600"></div>
      <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
          <ArrowLeft className="h-4 w-4" /> Tilbake
        </button>
        <span className="font-black uppercase tracking-tighter text-xl">Få Veiledning</span>
        <div className="w-20"></div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 pt-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-black tracking-tight mb-6 leading-none">Usikker på reglene? <br /><span className="text-blue-600">Book en ekspert.</span></h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            En forhåndskonferanse er et uforpliktende møte med en saksbehandler hvor du får avklart viktige spørsmål før du sender inn en søknad.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight leading-tight">{step.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-[4rem] border-2 border-blue-600 shadow-2xl shadow-blue-100 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black mb-6 tracking-tight leading-tight">Bestill møte i dag</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-700">Digitalt videomøte via Teams</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-700">Fysisk møte på rådhuset</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-700">Gratis for enkle tiltak</span>
              </div>
            </div>
            <button className="flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              Gå til booking <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="bg-slate-50 rounded-[3rem] p-10 flex items-center justify-center border border-slate-100">
            <div className="text-center">
              <Video className="h-20 w-20 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Forhåndsvisning</p>
              <p className="text-slate-800 font-black text-lg">Enkelt og effektivt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidancePage;
