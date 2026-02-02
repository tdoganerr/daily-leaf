import ReadingBuddies from "./ReadingBuddies";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { supabase } from "./supabase";
import { Helmet } from "react-helmet-async";
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import Login from "./Login";
import PaymentModal from "./PaymentModal";
import Skeleton from "./Skeleton";
import ImageLoader from "./ImageLoader";
import ErrorBoundary from "./ErrorBoundary";
import AmbientPlayer from "./AmbientPlayer";
import StreakTree from "./StreakTree";
import Onboarding from "./Onboarding";
import SplashScreen from "./SplashScreen";

const ArchiveModal = lazy(() => import("./ArchiveModal"));
const ProfileModal = lazy(() => import("./ProfileModal"));
const AdminModal = lazy(() => import("./AdminModal"));

// --- İKONLAR ---
const LeafIcon = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 9 0 5.5-4.5 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>);
const WorldIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>);
const HistoryIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>);
const FoodIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>);
const QuillIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /></svg>);
const UserIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const DiamondIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"></path></svg>);
const LockIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>);
const BookIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>);
const CalendarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const MusicIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>);
const HeartIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const HeartOutlineIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const ShareIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>);
const StackIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>);
const PenIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>);
const TextSizeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>);
const DictionaryIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const WifiOffIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>);
const MoonIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>);
const SunIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
const SnowIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M2 12h20M12 2v20M20 20L4 4m16 0L4 20M15.5 8.5l-7 7M8.5 8.5l7 7"/></svg>);

function getFormattedDate(dateString, lang) {
  const dateOptions = { day: "numeric", month: "long", year: "numeric", weekday: "long" };
  const date = new Date(dateString); 
  return date.toLocaleDateString(lang === "en" ? "en-US" : "tr-TR", dateOptions);
}

// --- DÜZELTİLMİŞ AYARLAR MENÜSÜ ---
// Arka plan rengi, gölge ve z-index düzeltildi.
const SettingsDropdown = ({ readingTheme, setReadingTheme, readingFont, setReadingFont, textSize, setTextSize, isDarkMode }) => (
    <div className={`absolute top-12 right-0 w-64 rounded-2xl shadow-2xl p-5 z-[100] border animate-in fade-in zoom-in-95 origin-top-right
      ${isDarkMode ? 'bg-[#1c1917] border-stone-700' : 'bg-white border-stone-200'}`}>
      
      {/* Okcuk (Triangle) Efekti */}
      <div className={`absolute -top-2 right-3 w-4 h-4 rotate-45 border-t border-l 
        ${isDarkMode ? 'bg-[#1c1917] border-stone-700' : 'bg-white border-stone-200'}`}></div>

      <div className="space-y-5 relative z-10">
        {/* Font Seçimi */}
        <div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Yazı Tipi</p>
           <div className={`flex rounded-xl p-1 ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`}>
             <button onClick={() => setReadingFont('sans')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${readingFont === 'sans' ? 'bg-white dark:bg-stone-600 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}>Sans</button>
             <button onClick={() => setReadingFont('serif')} className={`flex-1 py-2 text-xs font-bold font-serif rounded-lg transition-all ${readingFont === 'serif' ? 'bg-white dark:bg-stone-600 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}>Serif</button>
           </div>
        </div>

        {/* Tema Seçimi */}
        <div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Kağıt Rengi</p>
             <div className="flex justify-between gap-2">
                <button onClick={() => setReadingTheme('light')} className={`flex-1 h-10 rounded-xl border transition-all ${readingTheme === 'light' ? 'ring-2 ring-stone-900 border-stone-900' : 'border-stone-200'} bg-[#fffdf9]`} title="Gündüz"></button>
                <button onClick={() => setReadingTheme('sepia')} className={`flex-1 h-10 rounded-xl border transition-all ${readingTheme === 'sepia' ? 'ring-2 ring-stone-900 border-stone-900' : 'border-stone-200'} bg-[#e3d5c6]`} title="Sepya"></button>
                <button onClick={() => setReadingTheme('dark')} className={`flex-1 h-10 rounded-xl border transition-all ${readingTheme === 'dark' ? 'ring-2 ring-stone-100 border-stone-100' : 'border-stone-700'} bg-[#1c1917]`} title="Gece"></button>
            </div>
        </div>

        {/* Boyut Seçimi */}
        <div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Yazı Boyutu</p>
           <div className={`flex items-center justify-between rounded-xl px-4 py-2 ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`}>
               <button onClick={() => setTextSize(Math.max(0, textSize - 1))} className="text-sm font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-2">A-</button>
               <div className="flex gap-1">
                   {[0, 1, 2].map(i => (
                       <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === textSize ? 'bg-stone-800 dark:bg-stone-200' : 'bg-stone-300 dark:bg-stone-600'}`}></div>
                   ))}
               </div>
               <button onClick={() => setTextSize(Math.min(2, textSize + 1))} className="text-xl font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-2">A+</button>
           </div>
        </div>
      </div>
    </div>
);

// --- ANİMASYONLU KART BİLEŞENİ ---
const LeafCard = ({ children, onNext, btnText, step, totalSteps, theme }) => {
  const contentRef = useRef(null);
  
  const getThemeColors = () => {
    if (theme === 'sepia') return 'bg-[#e3d5c6]'; 
    if (theme === 'dark') return 'bg-[#1c1917]'; 
    return 'bg-[#fffdf9]'; 
  };

  useEffect(() => { 
    if (contentRef.current) contentRef.current.scrollTo(0, 0); 
  }, [step]);

  return (
    <div className={`flex flex-col h-full relative transition-colors duration-500 overflow-hidden ${getThemeColors()}`}>
      <div ref={contentRef} className="flex-grow overflow-y-auto px-6 py-4 hide-scrollbar pb-24"> 
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`absolute bottom-0 left-0 w-full pt-8 pb-6 px-6 z-20 bg-gradient-to-t to-transparent ${theme === 'dark' ? 'from-[#1c1917] via-[#1c1917]' : theme === 'sepia' ? 'from-[#e3d5c6] via-[#e3d5c6]' : 'from-[#fffdf9] via-[#fffdf9]'}`}>
        {onNext && (
          <motion.button 
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 rounded-2xl text-xs font-bold tracking-[0.25em] uppercase shadow-xl flex items-center justify-center gap-2 transition-colors
              ${theme === 'dark' ? 'bg-stone-100 text-stone-900 hover:bg-stone-300' : 'bg-stone-900 text-stone-50 hover:bg-stone-800'}
            `}
          >
            {btnText} {step === 0 && <BookIcon />}
          </motion.button>
        )}
        
        {totalSteps && (
          <div className="flex justify-center space-x-2 mt-4">
              {[0, 1, 2, 3, 4].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 
                    ${step === s 
                       ? (theme === 'dark' ? 'w-6 bg-stone-200' : 'w-6 bg-stone-800') 
                       : (theme === 'dark' ? 'w-1.5 bg-stone-700' : 'w-1.5 bg-stone-300')}
                  `}/>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

function DailyLeafContent() {
  const [language, setLanguage] = useState(() => localStorage.getItem("leaf_lang") || "tr");
  const [textSize, setTextSize] = useState(() => parseInt(localStorage.getItem("leaf_size") || "1"));
  const [readingTheme, setReadingTheme] = useState(() => localStorage.getItem("leaf_reading_theme") || "light");
  const [readingFont, setReadingFont] = useState(() => localStorage.getItem("leaf_reading_font") || "serif");
  const [showSettings, setShowSettings] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("leaf_theme") === "dark");
  const [showOnboarding, setShowOnboarding] = useState(() => { return !localStorage.getItem("onboarding_complete"); });
  const [showSplash, setShowSplash] = useState(true);

  const [step, setStep] = useState(0); 
  const [dailyContent, setDailyContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    return dateParam && !isNaN(Date.parse(dateParam)) ? dateParam : new Date().toISOString().split('T')[0];
  });
  const [inputDate, setInputDate] = useState(currentDate);
  const [isFavorite, setIsFavorite] = useState(false);
  const [streak, setStreak] = useState(0);
  const [streakFreeze, setStreakFreeze] = useState(0);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [journalNote, setJournalNote] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  const shareCardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const hasWelcomed = useRef(false);

  const tooltips = {
    tr: {
        streak: "Seri ve Jokerler",
        offline: "Çevrimdışı",
        theme: "Görünüm Modu",
        favorite: isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle",
        library: "Kütüphaneyi Aç",
        premium: "Premium Üyelik",
        profile: "Profil",
        login: "Giriş Yap",
        settings: "Okuma Ayarları",
        language: "Dili Değiştir"
    },
    en: {
        streak: "Streak & Freezes",
        offline: "Offline",
        theme: "Appearance",
        favorite: isFavorite ? "Remove from Favorites" : "Add to Favorites",
        library: "Open Library",
        premium: "Premium Membership",
        profile: "Profile",
        login: "Login",
        settings: "Reading Settings",
        language: "Change Language"
    }
  };

  const moodConfig = {
    happy: { icon: '☀️', label_tr: 'Mutlu', label_en: 'Happy', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' },
    calm: { icon: '🌿', label_tr: 'Huzurlu', label_en: 'Calm', color: 'bg-green-100 border-green-300 text-green-600' },
    melancholy: { icon: '🌧️', label_tr: 'Melankolik', label_en: 'Melancholy', color: 'bg-blue-100 border-blue-300 text-blue-600' },
    inspired: { icon: '✨', label_tr: 'İlhamlı', label_en: 'Inspired', color: 'bg-purple-100 border-purple-300 text-purple-600' },
    tired: { icon: '☁️', label_tr: 'Yorgun', label_en: 'Tired', color: 'bg-stone-100 border-stone-300 text-stone-500' }
  };

  const staticTexts = { 
    en: { 
        title: "The Daily Leaf", 
        start: "Start Reading", 
        continue: "Continue", 
        complete: "Complete Day", 
        locked: "Unlock Content", 
        journalTitle: "Your Inner Voice", 
        journalPlaceholder: "Write a note for yourself...", 
        save: "Save Note",
        storyTitle: "Story of the Day",
        wordTitle: "Word of the Day",
        meaningTitle: "Meaning",
        worldTitle: "World Today",
        historyTitle: "Historical Note",
        foodTitle: "Flavor of the Day",
        atmosphere: "ATMOSPHERE",
        premium: "PREMIUM",
        story: "STORY",
        howAreYou: "How are you feeling?",
        mood: "Mood"
    }, 
    tr: { 
        title: "Günün Yaprağı", 
        start: "Okumaya Başla", 
        continue: "Devam Et", 
        complete: "Günü Tamamla", 
        locked: "Kilidi Aç", 
        journalTitle: "İç Sesin", 
        journalPlaceholder: "Kendine bir not bırak...", 
        save: "Notu Kaydet",
        storyTitle: "Günün Hikayesi",
        wordTitle: "Günün Kelimesi",
        meaningTitle: "Anlamı",
        worldTitle: "Dünyada Bugün",
        historyTitle: "Tarihsel Not",
        foodTitle: "Günün Lezzeti",
        atmosphere: "ATMOSFER",
        premium: "PREMIUM",
        story: "HİKAYE",
        howAreYou: "Bugün nasıl hissediyorsun?",
        mood: "Ruh Hali"
    } 
  };

  const fontSizes = ["text-base", "text-lg", "text-2xl"];
  const lineHeights = ["leading-7", "leading-8", "leading-10"];
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => { localStorage.setItem("leaf_size", textSize); }, [textSize]);
  useEffect(() => { localStorage.setItem("leaf_reading_theme", readingTheme); }, [readingTheme]);
  useEffect(() => { localStorage.setItem("leaf_reading_font", readingFont); }, [readingFont]);
  useEffect(() => { localStorage.setItem("leaf_lang", language); }, [language]);

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    setIsSharing(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, { scale: 2, backgroundColor: '#fffdf9', useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) { toast.error("Görsel oluşturulamadı."); setIsSharing(false); return; }
        const file = new File([blob], "daily-leaf.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Daily Leaf', text: 'Günün yaprağından bir not... 🍂' });
        } else {
          const link = document.createElement('a');
          link.href = canvas.toDataURL("image/png");
          link.download = 'daily-leaf-quote.png';
          link.click();
          toast.success("Resim indirildi! 📸");
        }
        setIsSharing(false);
      }, 'image/png');
    } catch (error) {
      console.error("Paylaşım hatası:", error);
      if (navigator.share) await navigator.share({ title: 'Daily Leaf', url: window.location.href });
      else { navigator.clipboard.writeText(window.location.href); toast.success("Link kopyalandı!"); }
      setIsSharing(false);
    }
  };

  const updateStreak = async (userId) => { 
    if (isOffline) return; 
    const today = new Date().toISOString().split('T')[0]; 
    await supabase.from('user_reads').upsert({ user_id: userId, date: today }, { onConflict: 'user_id, date' });
    const { data: profile } = await supabase.from('profiles').select('streak_count, last_read_date, streak_freeze').eq('id', userId).single(); 
    if (profile) { 
        setStreakFreeze(profile.streak_freeze || 0);
        if (profile.last_read_date === today) { setStreak(profile.streak_count); } else { 
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); const yesterdayStr = yesterday.toISOString().split('T')[0]; 
            let newStreak = 1; let newFreeze = profile.streak_freeze || 0; let usedFreeze = false; let earnedFreeze = false;
            if (profile.last_read_date === yesterdayStr) { 
                newStreak = (profile.streak_count || 0) + 1; 
                if (newStreak % 7 === 0) { newFreeze += 1; earnedFreeze = true; }
            } else {
                if (newFreeze > 0) { newStreak = (profile.streak_count || 0); newFreeze -= 1; usedFreeze = true; } else { newStreak = 1; }
            }
            await supabase.from('profiles').update({ streak_count: newStreak, last_read_date: today, streak_freeze: newFreeze }).eq('id', userId); 
            setStreak(newStreak); setStreakFreeze(newFreeze);
            if (usedFreeze) { toast("Serin bozulmadı! ❄️", { description: "1 Donmuş Yaprak harcandı.", duration: 5000 }); } else if (earnedFreeze) { toast("Tebrikler! ❄️", { description: "1 Donmuş Yaprak kazandın!", duration: 5000 }); } else { setStreakAnimation(true); setTimeout(() => setStreakAnimation(false), 600); }
        } 
    } else { 
        await supabase.from('profiles').insert({ id: userId, streak_count: 1, last_read_date: today, streak_freeze: 0 }); 
        setStreak(1); setStreakAnimation(true); setTimeout(() => setStreakAnimation(false), 600); 
    } 
  };

  const fetchJournal = async (userId, date) => { 
      const { data } = await supabase.from('journals').select('note, mood').eq('user_id', userId).eq('date', date).single(); 
      if (data) { setJournalNote(data.note || ""); setSelectedMood(data.mood || null); } else { setJournalNote(""); setSelectedMood(null); }
  };
  const checkPremiumStatus = async (userId) => { const { data } = await supabase.from('profiles').select('is_premium').eq('id', userId).single(); if (data?.is_premium) setIsPremium(true); };
  const checkFavoriteStatus = async (userId, date) => { const { data } = await supabase.from('favorites').select('*').eq('user_id', userId).eq('content_date', date).single(); setIsFavorite(!!data); };
  
  const saveJournal = async () => {
    if (!user) { setShowLogin(true); return; }
    if (isOffline) { toast.error("Çevrimdışı modda kayıt yapılamaz."); return; }
    setSavingNote(true);
    try {
      const { error } = await supabase.from('journals').upsert({ user_id: user.id, date: currentDate, note: journalNote, mood: selectedMood }, { onConflict: 'user_id, date' });
      if (error) throw error;
      toast.success(language === "en" ? "Saved successfully." : "Başarıyla kaydedildi.", { description: selectedMood ? "Ruh halin de işlendi. 🌈" : "Notun güvenle saklandı.", style: { background: isDarkMode ? '#fff' : '#1c1917', color: isDarkMode ? '#000' : '#fff' } });
    } catch (error) { console.error("Kayıt Hatası:", error); toast.error("Kaydedilemedi: " + error.message); } finally { setSavingNote(false); }
  };
  
  const toggleFavorite = async () => { if (!user) { setShowLogin(true); return; } if (isOffline) { toast.error("Çevrimdışıyken işlem yapılamaz."); return; } if (isFavorite) { const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('content_date', currentDate); if (!error) setIsFavorite(false); } else { const { error } = await supabase.from('favorites').insert({ user_id: user.id, content_date: currentDate }); if (!error) { setIsFavorite(true); toast.success(language === "en" ? "Added to collection." : "Koleksiyonuna eklendi.", { icon: '🍂', style: { background: isDarkMode ? '#fff' : '#1c1917', color: isDarkMode ? '#000' : '#fff' } }); } } };
  const handleLogout = async () => { await supabase.auth.signOut(); setShowProfile(false); setStreak(0); };
  const handleSelectDate = (date, targetStep = 0) => { setCurrentDate(date); setStep(targetStep); setShowArchive(false); setShowProfile(false); };
  const handleNext = () => { if (step < 4) setStep(prev => prev + 1); else setStep(0); };
  const getButtonText = () => { if (step === 0) return staticTexts[language].start; if (step === 3 && !isPremium) return staticTexts[language].locked; if (step === 4) return language === "en" ? "Read Again" : "Tekrar Oku"; return staticTexts[language].continue; };

  // --- EFFECTS ---
  useEffect(() => { setInputDate(currentDate); const url = new URL(window.location.href); url.searchParams.set('date', currentDate); window.history.pushState({}, '', url); }, [currentDate]);
  useEffect(() => { const timer = setTimeout(() => { if (inputDate.length === 10 && !isNaN(Date.parse(inputDate))) { setCurrentDate(inputDate); } }, 1000); return () => clearTimeout(timer); }, [inputDate]);
  useEffect(() => { const handleKeyDown = (e) => { if (!showArchive && !showProfile && !showAdmin && !showLogin && !showPayment && step < 4) { if (e.key === "ArrowRight") { if (step < 4) setStep(s => s + 1); } if (e.key === "ArrowLeft") { if (step > 0) setStep(s => s - 1); } } }; window.addEventListener("keydown", handleKeyDown); return () => window.removeEventListener("keydown", handleKeyDown); }, [step, showArchive, showProfile, showAdmin, showLogin, showPayment]);
  useEffect(() => { localStorage.setItem("leaf_theme", isDarkMode ? "dark" : "light"); if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [isDarkMode]);
  useEffect(() => { const timer = setTimeout(() => { setShowSplash(false); }, 2000); return () => clearTimeout(timer); }, []);

  useEffect(() => {
    async function fetchDailyContent() {
      setLoading(true); setDailyContent(null); setIsFavorite(false); setJournalNote(""); setIsOffline(false);
      try {
        const { data, error } = await supabase.from('content').select('*').eq('date', currentDate).single();
        if (error) throw error;
        setDailyContent(data);
        localStorage.setItem(`leaf_${currentDate}`, JSON.stringify(data));
      } catch (error) {
        const cachedData = localStorage.getItem(`leaf_${currentDate}`);
        if (cachedData) { setDailyContent(JSON.parse(cachedData)); setIsOffline(true); toast("İnternet bağlantısı yok.", { description: "Önbellekteki kopya gösteriliyor.", icon: '📡' }); }
      }
      setLoading(false);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { 
        setUser(session?.user ?? null); 
        if (session) { 
            setShowLogin(false); 
            checkPremiumStatus(session.user.id); 
            checkFavoriteStatus(session.user.id, currentDate); 
            fetchJournal(session.user.id, currentDate); 
            const today = new Date().toISOString().split('T')[0]; 
            if (currentDate === today) updateStreak(session.user.id); 
            
            // --- SADECE İLK GİRİŞTE ---
            if (!hasWelcomed.current) {
                const name = session.user.user_metadata?.full_name?.split(' ')[0] || (language === 'en' ? 'User' : 'Okur');
                toast.success(language === 'en' ? `Welcome back, ${name} 👋` : `Tekrar hoş geldin, ${name} 👋`, { duration: 3000 });
                hasWelcomed.current = true;
            }
        } else { 
            setIsPremium(false); setIsFavorite(false); setStreak(0); setJournalNote(""); 
        } 
    });
    fetchDailyContent(); 
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); if (session?.user) { checkPremiumStatus(session.user.id); checkFavoriteStatus(session.user.id, currentDate); fetchJournal(session.user.id, currentDate); const today = new Date().toISOString().split('T')[0]; if (currentDate === today) updateStreak(session.user.id); } });
    return () => subscription.unsubscribe();
  }, [currentDate]);

  const content = dailyContent ? { story: language === 'en' ? dailyContent.story_en : dailyContent.story_tr, note: language === 'en' ? dailyContent.note_en : dailyContent.note_tr, world: language === 'en' ? dailyContent.world_en : dailyContent.world_tr, history: language === 'en' ? dailyContent.history_en : dailyContent.history_tr, food: language === 'en' ? dailyContent.food_en : dailyContent.food_tr, word: language === 'en' ? dailyContent.word_en : dailyContent.word_tr, meaning: language === 'en' ? dailyContent.meaning_en : dailyContent.meaning_tr, image: dailyContent.image_url, audio: dailyContent.audio_url } : null;
  useEffect(() => { document.body.style.backgroundColor = isDarkMode ? '#1c1917' : '#f5f0e6'; }, [isDarkMode]);

  if (showSplash) { return <SplashScreen onComplete={() => setShowSplash(false)} />; }
  if (showOnboarding) { return ( <Onboarding onComplete={() => { localStorage.setItem("onboarding_complete", "true"); setShowOnboarding(false); }} /> ); }

  const getTextColor = () => { if (readingTheme === 'dark') return 'text-stone-300'; if (readingTheme === 'sepia') return 'text-[#5b4636]'; return 'text-stone-800'; };

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-4 relative transition-colors duration-500 ${isDarkMode ? 'bg-[#1c1917]' : 'bg-[#f5f0e6]'}`}>
      <Toaster position="top-center" theme={isDarkMode ? 'dark' : 'light'} />
      <Helmet>
        <title>Daily Leaf | {getFormattedDate(currentDate, language)}</title> 
        <meta name="theme-color" content={isDarkMode ? "#1c1917" : "#f5f0e6"} />
      </Helmet>

      {/* SOL ÜST - OKUMA ARKADAŞLARI */}
      <ReadingBuddies language={language} />

      {/* HEADER (GÜNCELLENMİŞ) */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3 w-full justify-end max-w-screen-md px-4">
        {user && (
          <div className="flex justify-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm transition-all duration-300 cursor-default select-none ${streakAnimation ? 'scale-110' : ''} ${isDarkMode ? 'bg-stone-800 border border-stone-700 text-stone-300' : 'bg-[#e8e6e1] border border-[#d6d3ce] text-stone-600'}`} title={tooltips[language].streak}>
                <div className="shrink-0"><StackIcon /></div>
                <span className="text-xs font-bold font-serif whitespace-nowrap">{streak}</span>
                {streakFreeze > 0 && (<div className="flex items-center gap-1 ml-1 pl-2 border-l border-stone-400/30"><SnowIcon /><span className="text-xs font-bold font-serif">{streakFreeze}</span></div>)}
            </div>
          </div>
        )}
        
        {isOffline && (<div className="text-red-400 bg-red-50 border border-red-200 w-9 h-9 rounded-full flex items-center justify-center shadow-sm animate-pulse" title={tooltips[language].offline}><WifiOffIcon /></div>)}
        
        {/* Ayarlar Butonu (Yeni Konum ve Wrapper) */}
        <div className="relative group">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`shrink-0 text-xs font-bold border w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${showSettings ? (isDarkMode ? 'bg-stone-700 border-stone-600 text-stone-200' : 'bg-stone-200 border-stone-300 text-stone-900') : (isDarkMode ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-[#fffdf9] text-stone-400 border-stone-200 hover:border-stone-400')}`}
                title={tooltips[language].settings}
            >
                <TextSizeIcon />
            </button>
            {showSettings && (
                <SettingsDropdown 
                    readingTheme={readingTheme} 
                    setReadingTheme={setReadingTheme} 
                    readingFont={readingFont} 
                    setReadingFont={setReadingFont} 
                    textSize={textSize} 
                    setTextSize={setTextSize} 
                    isDarkMode={isDarkMode}
                />
            )}
        </div>

        <button onClick={toggleTheme} className={`shrink-0 text-xs font-bold border w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${isDarkMode ? 'bg-stone-800 text-yellow-400 border-stone-700' : 'bg-[#fffdf9] text-stone-400 border-stone-200 hover:border-stone-400'}`} title={tooltips[language].theme}>{isDarkMode ? <SunIcon /> : <MoonIcon />}</button>
        
        {content && (<button onClick={toggleFavorite} className={`shrink-0 text-xs font-bold border w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${isFavorite ? 'bg-red-50 text-red-400 border-red-100 dark:bg-red-900/20 dark:border-red-900' : isDarkMode ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-[#fffdf9] text-stone-400 border-stone-200 hover:border-stone-400'}`} title={tooltips[language].favorite}>{isFavorite ? <HeartIcon /> : <HeartOutlineIcon />}</button>)}
        
        <div className={`flex items-center gap-2 px-3 py-1.5 h-9 rounded-full transition-colors shadow-sm ${isDarkMode ? 'bg-stone-800 border border-stone-700' : 'bg-[#fffdf9] border border-stone-200 hover:bg-stone-100'}`}>
            <button onClick={() => setShowArchive(true)} className="text-stone-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" title={tooltips[language].library}><CalendarIcon /></button>
            <div className="w-px h-4 bg-stone-300 dark:bg-stone-600 mx-1"></div>
            <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className={`bg-transparent text-xs font-bold focus:outline-none w-24 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`} style={{ colorScheme: isDarkMode ? 'dark' : 'light' }} />
        </div>
        
        {user && !isPremium && <button onClick={() => setShowPayment(true)} className="text-[10px] font-bold text-white bg-[#bcaaa4] px-3 py-1.5 h-9 rounded-full shadow-md hover:bg-[#a1887f] transition-colors whitespace-nowrap" title={tooltips[language].premium}>PREMIUM</button>}
        
        {isPremium && <span className={`text-[10px] font-bold px-2 py-1 h-9 rounded-full flex items-center gap-1 whitespace-nowrap ${isDarkMode ? 'bg-stone-800 text-[#a1887f] border border-stone-700' : 'text-[#8d6e63] bg-[#efebe9] border border-[#d7ccc8]'}`} title={tooltips[language].premium}><DiamondIcon /> PREMIUM</span>}
        
        {user ? (<button onClick={() => setShowProfile(true)} className={`shrink-0 text-xs font-bold w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-300' : 'text-stone-600 bg-stone-200 hover:bg-stone-300'}`} title={tooltips[language].profile}><UserIcon /></button>) : (<button onClick={() => setShowLogin(true)} className={`text-xs font-bold underline whitespace-nowrap ${isDarkMode ? 'text-stone-300' : 'text-stone-900'}`} title={tooltips[language].login}>{language === "en" ? "Login" : "Giriş"}</button>)}
        
        <button onClick={() => setLanguage(language === "en" ? "tr" : "en")} className={`text-xs font-black border-2 w-9 h-9 rounded transition-all flex items-center justify-center ${isDarkMode ? 'border-stone-300 text-stone-300 hover:bg-stone-300 hover:text-stone-900' : 'border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white'}`} title={tooltips[language].language}>{language === "en" ? "TR" : "EN"}</button>
      </div>

      {showLogin && <Login onLogin={() => setShowLogin(false)} />}
      {showPayment && <PaymentModal user={user} onClose={() => setShowPayment(false)} onSuccess={() => setIsPremium(true)} />}
      
      <Suspense fallback={<div className="fixed inset-0 bg-white/50 dark:bg-black/50 z-[100]" />}>
        {showArchive && <ArchiveModal selectedDate={currentDate} onClose={() => setShowArchive(false)} onSelectDate={(date) => handleSelectDate(date, 0)} />}
        {showProfile && user && <ProfileModal user={user} language={language} onClose={() => setShowProfile(false)} onLogout={handleLogout} onSelectDate={handleSelectDate} onOpenAdmin={() => setShowAdmin(true)} />}
        {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} language={language} />}
      </Suspense>

      <div className="w-full max-w-md bg-[#fffdf9] dark:bg-[#1c1917] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2rem] h-[85vh] md:h-[80vh] border border-stone-100 dark:border-stone-800 relative overflow-hidden flex flex-col transition-all duration-500">
        
        {loading ? (
            <Skeleton />
        ) : content ? (
            <>
               {step === 0 && (
                    <div className="flex flex-col h-full relative animate-in fade-in duration-500">
                        <div className="flex-grow overflow-y-auto hide-scrollbar pb-24">
                            <div className="w-full h-2/3 md:h-1/2 relative">
                                {content.image ? (<ImageLoader src={content.image} alt="Cover" className="w-full h-full object-cover" />) : (<div className="w-full h-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center"><LeafIcon /></div>)}
                                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fffdf9] to-transparent dark:from-[#1c1917]"></div>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare} className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50 transition-colors z-30">
                                    {isSharing ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <ShareIcon />}
                                </motion.button>
                            </div>
                            <div className="px-8 -mt-6 relative z-10">
                                <div className="bg-[#fffdf9]/90 dark:bg-[#1c1917]/90 backdrop-blur-sm border border-stone-100 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-stone-500 dark:text-stone-400 mb-2">{getFormattedDate(currentDate, language)}</p>
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>{staticTexts[language].title}</h1>
                                    <div className="space-y-4">
                                            <div className="flex items-center gap-4 group"><div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors"><BookIcon /></div><div><p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">{staticTexts[language].story}</p><p className="font-serif italic text-stone-900 dark:text-stone-200 line-clamp-1">"{content.story.substring(0, 25)}..."</p></div></div>
                                            <div className="flex items-center gap-4 group"><div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors"><MusicIcon /></div><div><p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">{staticTexts[language].atmosphere}</p><p className="font-serif text-stone-900 dark:text-stone-200">Lofi modunu açabilirsiniz</p></div></div>
                                            <div className="flex items-center gap-4 group opacity-80"><div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors"><LockIcon /></div><div><p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">{staticTexts[language].premium}</p><p className="font-serif text-stone-900 dark:text-stone-200">Özel içerik & Lezzet</p></div></div>
                                    </div>
                                </div>
                                <div className="h-12"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#fffdf9] via-[#fffdf9] to-transparent dark:from-[#1c1917] dark:via-[#1c1917] z-20"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={handleNext} className="w-full py-4 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-2xl hover:bg-stone-800 dark:hover:bg-stone-300 transition-all text-xs font-bold tracking-[0.25em] uppercase shadow-lg flex justify-center items-center gap-2">{staticTexts[language].start} <BookIcon /></motion.button></div>
                    </div>
                )}
                {step === 1 && (
                  <LeafCard onNext={handleNext} btnText={getButtonText()} step={step} totalSteps={true} theme={readingTheme}>
                    <div className="pt-2 relative">
                      <div className="text-center mt-6">
                        {content.image && <div className="w-full h-48 mb-6 rounded-3xl overflow-hidden shadow-sm relative"><ImageLoader src={content.image} className="w-full h-full object-cover" /></div>}
                        <h2 className={`text-2xl font-bold mb-6 ${readingFont === 'serif' ? 'font-serif' : 'font-sans'} ${getTextColor()}`} style={readingFont === 'serif' ? { fontFamily: '"Playfair Display", serif' } : {}}>{staticTexts[language].storyTitle}</h2>
                        <p className={`${fontSizes[textSize]} ${lineHeights[textSize]} text-left whitespace-pre-line px-2 transition-all duration-300 ${getTextColor()} ${readingFont === 'serif' ? 'font-serif' : 'font-sans'}`} style={readingFont === 'serif' ? { fontFamily: '"Lora", serif' } : {}}>{content.story}</p>
                      </div>
                    </div>
                  </LeafCard>
                )}
                {step === 2 && (<LeafCard onNext={handleNext} btnText={getButtonText()} step={step} totalSteps={true} theme={readingTheme}><div className="space-y-12 pt-10"><div className={`bg-stone-50 dark:bg-stone-800 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-700 relative`}><div className={`absolute -top-4 left-8 px-2 text-stone-300 ${readingTheme === 'sepia' ? 'bg-[#e3d5c6]' : readingTheme === 'dark' ? 'bg-[#1c1917]' : 'bg-[#fffdf9]'}`}><QuillIcon /></div><p className="text-xl font-serif italic text-stone-900 dark:text-stone-100 leading-normal text-center" style={{ fontFamily: '"Playfair Display", serif' }}>"{content.note}"</p></div>{content.word && (<div className="bg-[#fffbf0] dark:bg-stone-800 p-6 rounded-3xl border border-stone-100 dark:border-stone-700 relative text-center group"><div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 text-stone-300 ${readingTheme === 'sepia' ? 'bg-[#e3d5c6]' : readingTheme === 'dark' ? 'bg-[#1c1917]' : 'bg-[#fffdf9]'}`}><DictionaryIcon /></div><h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">{staticTexts[language].wordTitle}</h3><div className="flex items-center justify-center gap-3 mb-1"><p className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{content.word}</p><motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); const utterance = new SpeechSynthesisUtterance(content.word); utterance.lang = 'en-US'; utterance.rate = 0.8; window.speechSynthesis.speak(utterance); }} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-green-100 hover:text-green-600 transition-colors shadow-sm" title="Telaffuzu Dinle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></motion.button></div><p className="text-sm font-serif italic text-stone-600 dark:text-stone-400">{content.meaning}</p></div>)}<div className="px-4"><div className="flex items-center gap-3 mb-4 border-b border-stone-100 dark:border-stone-800 pb-2"><WorldIcon /><h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{staticTexts[language].worldTitle}</h3></div><p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-serif" style={{ fontFamily: '"Lora", serif' }}>{content.world}</p></div></div></LeafCard>)}
                {step === 3 && (isPremium ? (<LeafCard onNext={handleNext} btnText={getButtonText()} step={step} totalSteps={true} theme={readingTheme}><div className="space-y-8 pt-4"><div className="px-4"><div className="flex items-center gap-3 mb-4 border-b border-stone-100 dark:border-stone-800 pb-2"><HistoryIcon /><h3 className="font-bold text-xs uppercase tracking-widest text-stone-500">{staticTexts[language].historyTitle}</h3></div><p className="text-lg text-stone-700 dark:text-stone-300 font-serif leading-relaxed">{content.history}</p></div><div className="relative overflow-hidden rounded-[2.5rem] bg-[#1c1917] dark:bg-stone-800 p-8 text-[#fffdf9] text-center shadow-xl mx-2"><div className="flex justify-center mb-4 text-[#d6d3d1]"><FoodIcon /></div><h3 className="font-bold text-[10px] uppercase tracking-[0.3em] text-[#a8a29e] mb-4">{staticTexts[language].foodTitle}</h3><p className="text-2xl font-serif font-medium italic" style={{ fontFamily: '"Playfair Display", serif' }}>{content.food}</p></div></div></LeafCard>) : (<div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#fffdf9] dark:bg-[#1c1917]"><div className="p-6 bg-stone-50 dark:bg-stone-800 rounded-full mb-6"><LockIcon /></div><h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">Özel İçerik</h3><p className="text-stone-500 mb-8 max-w-xs mx-auto leading-relaxed">Bu bölüm sadece Premium üyelerimize açıktır.</p>{user ? (<button onClick={() => setShowPayment(true)} className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all">Kilidi Aç</button>) : (<button onClick={() => setShowLogin(true)} className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Giriş Yap</button>)}<button onClick={() => setStep(0)} className="mt-6 text-xs text-stone-400 underline">Başa Dön</button></div>))}
                {step === 4 && (
                  <LeafCard onNext={null} btnText="" step={step} totalSteps={true} theme={readingTheme}>
                    <div className="flex flex-col h-full pt-4">
                      <div className="text-center mb-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-stone-400 mb-2 ${readingTheme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}`}><PenIcon /></div>
                        <h2 className={`text-2xl font-serif font-bold ${readingTheme === 'dark' ? 'text-stone-300' : 'text-stone-800'}`}>{staticTexts[language].journalTitle}</h2>
                        <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">{getFormattedDate(currentDate, language)}</p>
                      </div>
                      <p className="text-center text-xs font-bold text-stone-400 mb-3 uppercase tracking-widest">{staticTexts[language].howAreYou}</p>
                      <div className="flex justify-center gap-2 mb-6">
                        {[
                          { id: 'happy', icon: '☀️', label_tr: 'Mutlu', label_en: 'Happy', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' }, 
                          { id: 'calm', icon: '🌿', label_tr: 'Huzurlu', label_en: 'Calm', color: 'bg-green-100 border-green-300 text-green-600' }, 
                          { id: 'melancholy', icon: '🌧️', label_tr: 'Melankolik', label_en: 'Melancholy', color: 'bg-blue-100 border-blue-300 text-blue-600' }, 
                          { id: 'inspired', icon: '✨', label_tr: 'İlhamlı', label_en: 'Inspired', color: 'bg-purple-100 border-purple-300 text-purple-600' }, 
                          { id: 'tired', icon: '☁️', label_tr: 'Yorgun', label_en: 'Tired', color: 'bg-stone-100 border-stone-300 text-stone-500' }
                        ].map((m) => (
                          <div key={m.id} className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setSelectedMood(m.id)}>
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 hover:scale-110 ${selectedMood === m.id ? `${m.color} scale-110 shadow-md` : 'bg-transparent border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`} title={language === 'en' ? m.label_en : m.label_tr}>{m.icon}</button>
                            <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${selectedMood === m.id ? 'text-stone-600 dark:text-stone-300' : 'text-stone-300 dark:text-stone-600 group-hover:text-stone-400'}`}>{language === 'en' ? m.label_en : m.label_tr}</span>
                          </div>
                        ))}
                      </div>
                      <div className="relative flex-grow mb-6 group">
                        <div className={`absolute inset-0 rounded-xl border shadow-sm transition-colors ${readingTheme === 'dark' ? 'bg-[#1c1917] border-stone-800' : readingTheme === 'sepia' ? 'bg-[#e3d5c6] border-stone-300' : 'bg-[#fffdf9] border-stone-200'}`}></div>
                        <textarea 
                          value={journalNote} 
                          onChange={(e) => setJournalNote(e.target.value)} 
                          placeholder={staticTexts[language].journalPlaceholder} 
                          className={`relative z-20 w-full h-full bg-transparent p-6 text-lg font-serif placeholder:text-stone-300 dark:placeholder:text-stone-700 border-none outline-none resize-none ${readingTheme === 'dark' ? 'text-stone-300' : 'text-stone-800'}`} 
                        />
                      </div>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={saveJournal} disabled={savingNote || !user} className={`w-full py-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${readingTheme === 'dark' ? 'bg-stone-100 text-stone-900 hover:bg-stone-300' : 'bg-stone-900 text-stone-50 hover:bg-stone-700'}`}>
                        {savingNote ? (<span className="animate-pulse">Kaydediliyor...</span>) : (<><span>{staticTexts[language].save}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-400"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg></>)}
                      </motion.button>
                      <button onClick={() => setStep(0)} className="w-full py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">{language === "en" ? "Read Again" : "Başa Dön"}</button>
                    </div>
                  </LeafCard>
                )}
            </>
        ) : (
            <div className="flex flex-col h-full items-center justify-center text-center p-8 bg-[#fffdf9] dark:bg-[#1c1917] animate-in fade-in">
                <div className="mb-8"><StreakTree streak={streak} /></div>
                <h2 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-200 mb-2">Bugünün Yaprağı Bekliyor</h2>
                <p className="text-stone-500 text-sm mb-8 max-w-[200px] mx-auto leading-relaxed">Serini bozmamak ve ağacını büyütmek için bugünün içeriğini keşfet.</p>
                <button onClick={() => setShowArchive(true)} className="px-8 py-3 bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition-all shadow-sm">Tarih Seç</button>
            </div>
        )}
      </div>

      <div className="fixed -left-[9999px] top-0">
        <div ref={shareCardRef} className="w-[1080px] h-[1920px] bg-[#fffdf9] flex flex-col items-center justify-between p-20 text-center font-serif relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
            <div className="mt-40"><LeafIcon /><h1 className="text-6xl font-bold text-stone-800 mt-8 font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>Daily Leaf</h1><p className="text-3xl text-stone-500 uppercase tracking-[0.3em] mt-4">{getFormattedDate(currentDate, language)}</p></div>
            <div className="max-w-4xl"><div className="mb-12 text-stone-400"><svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="mx-auto opacity-20"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.02166 12.9033 11.2091 10.3242 14.18 9.77C14.5029 9.71 14.717 9.39 14.657 9.07L14.317 7.27C14.257 6.95 13.937 6.74 13.617 6.8C8.947 7.67 5.427 11.75 5.417 16.55C5.417 16.69 5.417 16.85 5.417 17C5.417 19.2091 7.2079 21 9.417 21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16C16.0217 12.9033 18.2091 10.3242 21.18 9.77C21.5029 9.71 21.717 9.39 21.657 9.07L21.317 7.27C21.257 6.95 20.937 6.74 20.617 6.8C15.947 7.67 12.427 11.75 12.417 16.55C12.417 16.69 12.417 16.85 12.417 17C12.417 19.2091 14.2079 21 16.417 21H21.017Z"/></svg></div><p className="text-6xl text-stone-800 leading-tight font-serif italic">"{content?.note || "Bugünün notu..."}"</p>{content?.word && (<div className="mt-20 pt-12 border-t-4 border-stone-200 inline-block px-20"><p className="text-5xl font-bold text-stone-700 mb-4">{content.word}</p><p className="text-3xl text-stone-500 italic">{content.meaning}</p></div>)}</div>
            <div className="mb-40 opacity-50"><p className="text-2xl text-stone-400 font-bold">dailyleaf.app</p></div>
        </div>
      </div>

      <AmbientPlayer />
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DailyLeafContent />
    </ErrorBoundary>
  );
}