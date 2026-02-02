import { motion } from "framer-motion";

const LeafIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-stone-800 dark:text-stone-100">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 9 0 5.5-4.5 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export default function SplashScreen({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[999] bg-[#fffdf9] dark:bg-[#1c1917] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <LeafIcon />
        <h1 className="mt-6 text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 tracking-widest uppercase">
          Daily Leaf
        </h1>
        <p className="mt-2 text-xs text-stone-400 tracking-[0.3em] uppercase">
          Yükleniyor...
        </p>
      </motion.div>
    </motion.div>
  );
}