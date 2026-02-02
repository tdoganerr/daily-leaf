import { motion } from "framer-motion";

export default function StreakTree({ streak }) {
  // Streak sayısına göre ağacın evresini belirle
  const getTreeStage = () => {
    if (streak <= 0) return "seed";      // 0 Gün: Tohum
    if (streak < 7) return "sprout";     // 1-6 Gün: Filiz
    if (streak < 30) return "sapling";   // 7-29 Gün: Genç Fidan
    return "tree";                       // 30+ Gün: Tam Ağaç
  };

  const stage = getTreeStage();

  // Animasyon Ayarları
  const variants = {
    hidden: { scale: 0.8, opacity: 0, y: 10 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      
      {/* AĞAÇ GÖRSEL ALANI */}
      <motion.div 
        key={stage} // Aşama değişince animasyon tekrar çalışır
        variants={variants}
        initial="hidden"
        animate="visible"
        className="relative w-32 h-32 flex items-center justify-center"
      >
        {/* Arka plan Hale Efekti */}
        <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full blur-xl opacity-50"></div>

        {/* 1. EVRE: TOHUM (0 Gün) */}
        {stage === "seed" && (
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-400 dark:text-stone-500">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeOpacity="0.5"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
        )}

        {/* 2. EVRE: FİLİZ (1-7 Gün) */}
        {stage === "sprout" && (
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M12 22v-8" />
            <path d="M12 18a4 4 0 0 1 4-4h2" />
            <path d="M12 18a4 4 0 0 0-4-4H6" />
            <path d="M12 14v-4" />
            <path d="M12 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="currentColor" fillOpacity="0.2"/>
          </svg>
        )}

        {/* 3. EVRE: GENÇ FİDAN (7-30 Gün) */}
        {stage === "sapling" && (
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
            <path d="M12 22v-10" strokeWidth="3" className="text-stone-600 dark:text-stone-400"/>
            <path d="M12 12c0-4 4-6 6-6s4 2 4 6" fill="currentColor" fillOpacity="0.1" />
            <path d="M12 12c0-4-4-6-6-6s-4 2-4 6" fill="currentColor" fillOpacity="0.1"/>
            <path d="M12 12v-3" />
            <path d="M12 8l3-3" />
            <path d="M12 8l-3-3" />
          </svg>
        )}

        {/* 4. EVRE: TAM AĞAÇ (30+ Gün) */}
        {stage === "tree" && (
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700 dark:text-green-500">
            <path d="M12 22v-8" strokeWidth="3" className="text-stone-700 dark:text-stone-400"/>
            <circle cx="12" cy="9" r="7" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 14l-4-4" />
            <path d="M12 14l4-4" />
            <path d="M8 9l-2-2" />
            <path d="M16 9l2-2" />
            <circle cx="10" cy="7" r="1" fill="#f59e0b" stroke="none" /> 
            <circle cx="14" cy="10" r="1" fill="#f59e0b" stroke="none" />
            <circle cx="12" cy="5" r="1" fill="#f59e0b" stroke="none" />
          </svg>
        )}
      </motion.div>

      {/* Mesaj Alanı */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-2"
      >
        <p className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
            {stage === 'seed' && "Henüz bir tohum."}
            {stage === 'sprout' && "Yeşeriyor..."}
            {stage === 'sapling' && "Kök salıyor!"}
            {stage === 'tree' && "Ormana dönüştü!"}
        </p>
        <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">
            {streak} Günlük Seri
        </p>
      </motion.div>

    </div>
  );
}