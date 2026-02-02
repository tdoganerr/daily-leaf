import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Günün Yaprağı",
      desc: "Her gün senin için seçilmiş bir hikaye, bir kelime ve huzurlu bir an.",
      icon: (
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-green-600 dark:text-green-400">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 9 0 5.5-4.5 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Lofi Modu",
      desc: "Yağmur sesi ve kağıt dokusuyla dijital dünyadan uzaklaş, sadece okumaya odaklan.",
      icon: (
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-600 dark:text-stone-400">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          <path d="M9 18V5l12-2v13"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: "Ağacını Büyüt",
      desc: "Her gün gel, serini koru ve tohumdan ormana dönüşen yolculuğunu izle.",
      icon: (
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-600 dark:text-amber-400">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 22v-8"></path>
          <path d="M12 14l-4-4"></path>
          <path d="M12 14l4-4"></path>
        </svg>
      )
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      // Bittiğinde ana sayfaya geç
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#fffdf9] dark:bg-[#1c1917] flex flex-col items-center justify-center p-8 overflow-hidden">
      
      {/* Animasyonlu İçerik Alanı */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center flex flex-col items-center"
          >
            <div className="mb-12 p-8 bg-stone-100 dark:bg-stone-800 rounded-full shadow-inner">
              {slides[step].icon}
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-4">
              {slides[step].title}
            </h2>
            
            <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed font-serif">
              {slides[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Alt Kontroller */}
      <div className="w-full max-w-md flex flex-col items-center gap-8 mb-8">
        
        {/* Nokta Göstergeleri */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-stone-800 dark:bg-stone-100' : 'w-2 bg-stone-300 dark:bg-stone-700'}`}
            />
          ))}
        </div>

        {/* Buton */}
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
        >
          {step === slides.length - 1 ? "Başla" : "Devam Et"}
        </button>

      </div>
    </div>
  );
}