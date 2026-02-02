import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function ReadingBuddies({ language }) {
  const [count, setCount] = useState(1); // Kendisi dahil en az 1 kişi

  useEffect(() => {
    // 'global' adında bir oda oluştur
    const channel = supabase.channel('online-readers');

    channel
      .on('presence', { event: 'sync' }, () => {
        // Odadaki herkesi say
        const newState = channel.presenceState();
        const totalUsers = Object.keys(newState).length;
        setCount(totalUsers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Odaya girdiğinde "Ben geldim" sinyali gönder
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    // Sayfadan çıkarsa odadan ayrıl
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Eğer sadece 1 kişi varsa (sadece kendisi), göstermeye gerek yok.
  // Yalnız hissettirmesin diye en az 2 kişi olunca gösterelim.
  if (count < 2) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="absolute top-6 left-6 z-40 flex items-center gap-2 bg-white/80 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-100 dark:border-stone-800/30 shadow-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          {count} {language === 'en' ? 'Reading now' : 'Kişi okuyor'}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}