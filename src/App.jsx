import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { supabase } from "./supabase";
import { Helmet } from "react-helmet-async";
import { Toaster, toast } from 'sonner';
import Login from "./Login";
import PaymentModal from "./PaymentModal";
import Skeleton from "./Skeleton";
import ImageLoader from "./ImageLoader";
import ErrorBoundary from "./ErrorBoundary";

const ArchiveModal = lazy(() => import("./ArchiveModal"));
const ProfileModal = lazy(() => import("./ProfileModal"));
const AdminModal = lazy(() => import("./AdminModal"));

// --- İKONLAR (Aynı) ---
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
const MusicOffIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3.19"></path><path d="M9 18.18v-5.17l4-2v-3.19"></path><path d="M21 5l-8 2v5.82"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>);
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

function getFormattedDate(dateString, lang) {
  const dateOptions = { day: "numeric", month: "long", year: "numeric", weekday: "long" };
  const date = new Date(dateString); 
  return date.toLocaleDateString(lang === "en" ? "en-US" : "tr-TR", dateOptions);
}

const LeafCard = ({ children, onNext, btnText, step, totalSteps }) => {
  const contentRef = useRef(null);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo(0, 0); }, [step]);

  return (
    <div className="flex flex-col h-full relative bg-[#fffdf9] dark:bg-[#1c1917] transition-colors duration-500">
      <div ref={contentRef} className="flex-grow overflow-y-auto px-6 py-4 hide-scrollbar pb-24"> 
        {children}
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#fffdf9] via-[#fffdf9] to-transparent dark:from-[#1c1917] dark:via-[#1c1917] pt-8 pb-6 px-6 z-20">
        {onNext && (
          <button onClick={onNext} className="w-full py-4 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-2xl hover:bg-stone-800 dark:hover:bg-stone-300 transition-transform active:scale-95 text-xs font-bold tracking-[0.25em] uppercase shadow-xl flex items-center justify-center gap-2">
            {btnText} {step === 0 && <BookIcon />}
          </button>
        )}
        {totalSteps && (
          <div className="flex justify-center space-x-2 mt-4">
              {[0, 1, 2, 3, 4].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-6 bg-stone-800 dark:bg-stone-200' : 'w-1.5 bg-stone-300 dark:bg-stone-700'}`}/>
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
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("leaf_theme") === "dark");

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
  
  // --- YENİ: URL'DEN TARİH OKUMA (Deep Linking) ---
  const [currentDate, setCurrentDate] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    // Eğer URL'de geçerli bir tarih varsa onu kullan, yoksa bugünü al
    return dateParam && !isNaN(Date.parse(dateParam)) ? dateParam : new Date().toISOString().split('T')[0];
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streak, setStreak] = useState(0);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [journalNote, setJournalNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  const fontSizes = ["text-base", "text-lg", "text-2xl"];
  const lineHeights = ["leading-7", "leading-8", "leading-10"];
  const audioRef = useRef(null);

  // --- YENİ: URL SENKRONİZASYONU ---
  // currentDate değiştiğinde URL'i güncelle (Sayfa yenilenmeden)
  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('date', currentDate);
    window.history.pushState({}, '', url);
  }, [currentDate]);

  // --- YENİ: KLAVYE KISAYOLLARI (Sistemsel Geliştirme) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Sadece modal açık değilse ve yazı yazılmıyorsa
      if (!showArchive && !showProfile && !showAdmin && !showLogin && !showPayment && step < 4) {
        if (e.key === "ArrowRight") { if (step < 4) setStep(s => s + 1); }
        if (e.key === "ArrowLeft") { if (step > 0) setStep(s => s - 1); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, showArchive, showProfile, showAdmin, showLogin, showPayment]);

  useEffect(() => { localStorage.setItem("leaf_lang", language); }, [language]);
  useEffect(() => { localStorage.setItem("leaf_size", textSize); }, [textSize]);
  useEffect(() => { 
    localStorage.setItem("leaf_theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleAudio = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play().catch(e => console.log(e)); } setIsPlaying(!isPlaying); };
  useEffect(() => { const handler = (e) => { e.preventDefault(); setInstallPrompt(e); }; window.addEventListener('beforeinstallprompt', handler); return () => window.removeEventListener('beforeinstallprompt', handler); }, []);
  const handleInstallApp = () => { if (!installPrompt) return; installPrompt.prompt(); installPrompt.userChoice.then((r) => { if (r.outcome === 'accepted') setInstallPrompt(null); }); };
  const updateStreak = async (userId) => { if (isOffline) return; const today = new Date().toISOString().split('T')[0]; const { data: profile } = await supabase.from('profiles').select('streak_count, last_read_date').eq('id', userId).single(); if (profile) { if (profile.last_read_date === today) { setStreak(profile.streak_count); } else { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); const yesterdayStr = yesterday.toISOString().split('T')[0]; let newStreak = 1; if (profile.last_read_date === yesterdayStr) { newStreak = (profile.streak_count || 0) + 1; } await supabase.from('profiles').update({ streak_count: newStreak, last_read_date: today }).eq('id', userId); setStreak(newStreak); setStreakAnimation(true); setTimeout(() => setStreakAnimation(false), 600); } } else { await supabase.from('profiles').insert({ id: userId, streak_count: 1, last_read_date: today }); setStreak(1); setStreakAnimation(true); setTimeout(() => setStreakAnimation(false), 600); } };
  const saveJournal = async () => { if (!user) { setShowLogin(true); return; } if (isOffline) { toast.error("Çevrimdışı modda kayıt yapılamaz."); return; } setSavingNote(true); const { error } = await supabase.from('journals').upsert({ user_id: user.id, date: currentDate, note: journalNote }, { onConflict: 'user_id, date' }); setSavingNote(false); if (!error) { toast.success(language === "en" ? "Note saved." : "Not kaydedildi.", { style: { background: isDarkMode ? '#fff' : '#1c1917', color: isDarkMode ? '#000' : '#fff' } }); } };
  const fetchJournal = async (userId, date) => { const { data } = await supabase.from('journals').select('note').eq('user_id', userId).eq('date', date).single(); if (data) setJournalNote(data.note); else setJournalNote(""); };
  
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
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); if (session?.user) { checkPremiumStatus(session.user.id); checkFavoriteStatus(session.user.id, currentDate); fetchJournal(session.user.id, currentDate); const today = new Date().toISOString().split('T')[0]; if (currentDate === today) updateStreak(session.user.id); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); if (session) { setShowLogin(false); checkPremiumStatus(session.user.id); checkFavoriteStatus(session.user.id, currentDate); fetchJournal(session.user.id, currentDate); const today = new Date().toISOString().split('T')[0]; if (currentDate === today) updateStreak(session.user.id); } else { setIsPremium(false); setIsFavorite(false); setStreak(0); setJournalNote(""); } });
    fetchDailyContent(); return () => subscription.unsubscribe();
  }, [currentDate]);

  const checkPremiumStatus = async (userId) => { const { data } = await supabase.from('profiles').select('is_premium').eq('id', userId).single(); if (data?.is_premium) setIsPremium(true); };
  const checkFavoriteStatus = async (userId, date) => { const { data } = await supabase.from('favorites').select('*').eq('user_id', userId).eq('content_date', date).single(); setIsFavorite(!!data); };
  const toggleFavorite = async () => { if (!user) { setShowLogin(true); return; } if (isOffline) { toast.error("Çevrimdışıyken işlem yapılamaz."); return; } if (isFavorite) { const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('content_date', currentDate); if (!error) setIsFavorite(false); } else { const { error } = await supabase.from('favorites').insert({ user_id: user.id, content_date: currentDate }); if (!error) { setIsFavorite(true); toast.success(language === "en" ? "Added to collection." : "Koleksiyonuna eklendi.", { icon: '🍂', style: { background: isDarkMode ? '#fff' : '#1c1917', color: isDarkMode ? '#000' : '#fff' } }); } } };
  const handleShare = async () => { if (navigator.share) { try { await navigator.share({ title: 'Daily Leaf', text: `...`, url: window.location.href, }); } catch (error) {} } else { navigator.clipboard.writeText(window.location.href); toast.success("Link kopyalandı!"); } };
  const handleLogout = async () => { await supabase.auth.signOut(); setShowProfile(false); setStreak(0); };
  
  // --- TARİH SEÇİMİ (NAVİGASYON) ---
  // Modal kapandığında veya arşivden seçildiğinde URL ve state güncellenir
  const handleSelectDate = (date, targetStep = 0) => { 
      setCurrentDate(date); 
      setStep(targetStep); 
      setShowArchive(false); 
      setShowProfile(false); 
  };

  const content = dailyContent ? { story: language === 'en' ? dailyContent.story_en : dailyContent.story_tr, note: language === 'en' ? dailyContent.note_en : dailyContent.note_tr, world: language === 'en' ? dailyContent.world_en : dailyContent.world_tr, history: language === 'en' ? dailyContent.history_en : dailyContent.history_tr, food: language === 'en' ? dailyContent.food_en : dailyContent.food_tr, word: language === 'en' ? dailyContent.word_en : dailyContent.word_tr, meaning: language === 'en' ? dailyContent.meaning_en : dailyContent.meaning_tr, image: dailyContent.image_url, audio: dailyContent.audio_url } : null;
  const staticTexts = { en: { title: "The Daily Leaf", start: "Start Reading", continue: "Continue", complete: "Complete Day", locked: "Unlock Content", journalTitle: "Your Inner Voice", journalPlaceholder: "Write a note for yourself...", save: "Save Note" }, tr: { title: "Günün Yaprağı", start: "Okumaya Başla", continue: "Devam Et", complete: "Günü Tamamla", locked: "Kilidi Aç", journalTitle: "İç Sesin", journalPlaceholder: "Kendine bir not bırak...", save: "Notu Kaydet" } };
  const handleNext = () => { if (step < 4) setStep(prev => prev + 1); else setStep(0); };
  const getButtonText = () => { if (step === 0) return staticTexts[language].start; if (step === 3 && !isPremium) return staticTexts[language].locked; if (step === 4) return language === "en" ? "Read Again" : "Tekrar Oku"; return staticTexts[language].continue; };

  // --- ARKA PLAN RENGİ (Global) ---
  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#1c1917' : '#f5f0e6';
  }, [isDarkMode]);

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-4 relative transition-colors duration-500 ${isDarkMode ? 'bg-[#1c1917]' : 'bg-[#f5f0e6]'}`}>
      <Toaster position="top-center" theme={isDarkMode ? 'dark' : 'light'} />
      <Helmet>
        <title>Daily Leaf | {getFormattedDate(currentDate, language)}</title> 
        <meta name="theme-color" content={isDarkMode ? "#1c1917" : "#f5f0e6"} />
      </Helmet>

      {content?.audio && <audio ref={audioRef} src={content.audio} loop />}

      <div className="absolute top-6 right-6 z-40 flex items-center gap-3 w-full justify-end max-w-screen-md px-4">
        {user && (<div className="w-24 flex justify-center"><div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm transition-all duration-300 cursor-default select-none ${streakAnimation ? 'animate-pop' : ''} ${isDarkMode ? 'bg-stone-800 border border-stone-700 text-stone-300' : 'bg-[#e8e6e1] border border-[#d6d3ce] text-stone-600'}`} title="Biriken Yapraklar"><div className="shrink-0"><StackIcon /></div><span className="text-xs font-bold font-serif whitespace-nowrap">{streak} {language === "en" ? "Leaf" : "Adet"}</span></div></div>)}
        {isOffline && (<div className="text-red-400 bg-red-50 border border-red-200 w-9 h-9 rounded-full flex items-center justify-center shadow-sm animate-pulse" title="Çevrimdışı"><WifiOffIcon /></div>)}
        <button onClick={toggleTheme} className={`shrink-0 text-xs font-bold border w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${isDarkMode ? 'bg-stone-800 text-yellow-400 border-stone-700' : 'bg-[#fffdf9] text-stone-400 border-stone-200 hover:border-stone-400'}`}>{isDarkMode ? <SunIcon /> : <MoonIcon />}</button>
        {content?.audio && (<button onClick={toggleAudio} className={`shrink-0 text-xs font-bold border w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${isPlaying ? 'bg-stone-800 text-stone-50 border-stone-800 dark:bg-stone-100 dark:text-stone-900' : isDarkMode ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-[#fffdf9] text-stone-400 border-stone-200 hover:border-stone-400'}`}>{isPlaying ? <MusicIcon /> : <MusicOffIcon />}</button>)}
        {content && (<button onClick={toggleFavorite} className={`shrink-0 text-xs font-bold border w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${isFavorite ? 'bg-red-50 text-red-400 border-red-100 dark:bg-red-900/20 dark:border-red-900' : isDarkMode ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-[#fffdf9] text-stone-400 border-stone-200 hover:border-stone-400'}`}>{isFavorite ? <HeartIcon /> : <HeartOutlineIcon />}</button>)}
        <button onClick={() => setShowArchive(true)} className={`text-xs font-bold px-3 py-1.5 h-9 rounded-full transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap ${isDarkMode ? 'bg-stone-800 text-stone-300 border border-stone-700' : 'bg-[#fffdf9] text-stone-600 border border-stone-200 hover:bg-stone-100'}`}><CalendarIcon /> <span className="hidden sm:inline">{currentDate}</span></button>
        {user && !isPremium && <button onClick={() => setShowPayment(true)} className="text-[10px] font-bold text-white bg-[#bcaaa4] px-3 py-1.5 h-9 rounded-full shadow-md hover:bg-[#a1887f] transition-colors whitespace-nowrap">PREMIUM</button>}
        {isPremium && <span className={`text-[10px] font-bold px-2 py-1 h-9 rounded-full flex items-center gap-1 whitespace-nowrap ${isDarkMode ? 'bg-stone-800 text-[#a1887f] border border-stone-700' : 'text-[#8d6e63] bg-[#efebe9] border border-[#d7ccc8]'}`}><DiamondIcon /> PREMIUM</span>}
        {user ? (<button onClick={() => setShowProfile(true)} className={`shrink-0 text-xs font-bold w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-300' : 'text-stone-600 bg-stone-200 hover:bg-stone-300'}`}><UserIcon /></button>) : (<button onClick={() => setShowLogin(true)} className={`text-xs font-bold underline whitespace-nowrap ${isDarkMode ? 'text-stone-300' : 'text-stone-900'}`}>{language === "en" ? "Login" : "Giriş"}</button>)}
        <button onClick={() => setLanguage(language === "en" ? "tr" : "en")} className={`text-xs font-black border-2 w-9 h-9 rounded transition-all flex items-center justify-center ${isDarkMode ? 'border-stone-300 text-stone-300 hover:bg-stone-300 hover:text-stone-900' : 'border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white'}`}>{language === "en" ? "TR" : "EN"}</button>
      </div>

      {showLogin && <Login onLogin={() => setShowLogin(false)} />}
      {showPayment && <PaymentModal user={user} onClose={() => setShowPayment(false)} onSuccess={() => setIsPremium(true)} />}
      
      <Suspense fallback={<div className="fixed inset-0 bg-white/50 dark:bg-black/50 z-[100]" />}>
        {showArchive && <ArchiveModal selectedDate={currentDate} onClose={() => setShowArchive(false)} onSelectDate={(date) => handleSelectDate(date, 0)} />}
        {showProfile && user && <ProfileModal user={user} language={language} onClose={() => setShowProfile(false)} onLogout={handleLogout} onSelectDate={handleSelectDate} onOpenAdmin={() => setShowAdmin(true)} onInstallApp={handleInstallApp} installable={!!installPrompt} />}
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
                                <button onClick={handleShare} className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50 transition-colors z-30"><ShareIcon /></button>
                            </div>
                            <div className="px-8 -mt-6 relative z-10">
                                <div className="bg-[#fffdf9]/90 dark:bg-[#1c1917]/90 backdrop-blur-sm border border-stone-100 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-stone-500 dark:text-stone-400 mb-2">{getFormattedDate(currentDate, language)}</p>
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>{staticTexts[language].title}</h1>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 group"><div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors"><BookIcon /></div><div><p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">HİKAYE</p><p className="font-serif italic text-stone-900 dark:text-stone-200 line-clamp-1">"{content.story.substring(0, 25)}..."</p></div></div>
                                        {content.audio && (<div className="flex items-center gap-4 group"><div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors"><MusicIcon /></div><div><p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">ATMOSFER</p><p className="font-serif text-stone-900 dark:text-stone-200">Doğa sesleri mevcut</p></div></div>)}
                                        <div className="flex items-center gap-4 group opacity-80"><div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors"><LockIcon /></div><div><p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">PREMIUM</p><p className="font-serif text-stone-900 dark:text-stone-200">Özel içerik & Lezzet</p></div></div>
                                    </div>
                                </div>
                                <div className="h-12"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#fffdf9] via-[#fffdf9] to-transparent dark:from-[#1c1917] dark:via-[#1c1917] z-20"><button onClick={handleNext} className="w-full py-4 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-2xl hover:bg-stone-800 dark:hover:bg-stone-300 transition-all text-xs font-bold tracking-[0.25em] uppercase shadow-lg flex justify-center items-center gap-2">{staticTexts[language].start} <BookIcon /></button></div>
                    </div>
                )}
                {/* Step 1 */}
                {step === 1 && (<LeafCard onNext={handleNext} btnText={getButtonText()} step={step} totalSteps={true}><div className="text-center pt-2 relative"><button onClick={() => setTextSize((prev) => (prev + 1) % 3)} className="absolute top-0 right-0 p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors" title="Yazı Boyutu"><TextSizeIcon /></button>{content.image && <div className="w-full h-48 mb-6 rounded-3xl overflow-hidden shadow-sm relative"><ImageLoader src={content.image} className="w-full h-full object-cover" /></div>}<h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>Günün Hikayesi</h2><p className={`${fontSizes[textSize]} ${lineHeights[textSize]} text-stone-800 dark:text-stone-300 text-left font-serif whitespace-pre-line px-2 transition-all duration-300`} style={{ fontFamily: '"Lora", serif' }}>{content.story}</p></div></LeafCard>)}
                
                {/* Step 2 */}
                {step === 2 && (<LeafCard onNext={handleNext} btnText={getButtonText()} step={step} totalSteps={true}><div className="space-y-12 pt-10"><div className="bg-stone-50 dark:bg-stone-800 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-700 relative"><div className="absolute -top-4 left-8 bg-[#fffdf9] dark:bg-[#1c1917] px-2 text-stone-300"><QuillIcon /></div><p className="text-xl font-serif italic text-stone-900 dark:text-stone-100 leading-normal text-center" style={{ fontFamily: '"Playfair Display", serif' }}>"{content.note}"</p></div>{content.word && (<div className="bg-[#fffbf0] dark:bg-stone-800 p-6 rounded-3xl border border-stone-100 dark:border-stone-700 relative text-center"><div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#fffdf9] dark:bg-[#1c1917] px-2 text-stone-300"><DictionaryIcon /></div><h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">GÜNÜN KELİMESİ</h3><p className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">{content.word}</p><p className="text-sm font-serif italic text-stone-600 dark:text-stone-400">{content.meaning}</p></div>)}<div className="px-4"><div className="flex items-center gap-3 mb-4 border-b border-stone-100 dark:border-stone-800 pb-2"><WorldIcon /><h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Dünyada Bugün</h3></div><p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-serif" style={{ fontFamily: '"Lora", serif' }}>{content.world}</p></div></div></LeafCard>)}
                
                {/* Step 3 */}
                {step === 3 && (isPremium ? (<LeafCard onNext={handleNext} btnText={getButtonText()} step={step} totalSteps={true}><div className="space-y-8 pt-4"><div className="px-4"><div className="flex items-center gap-3 mb-4 border-b border-stone-100 dark:border-stone-800 pb-2"><HistoryIcon /><h3 className="font-bold text-xs uppercase tracking-widest text-stone-500">Tarihsel Not</h3></div><p className="text-lg text-stone-700 dark:text-stone-300 font-serif leading-relaxed">{content.history}</p></div><div className="relative overflow-hidden rounded-[2.5rem] bg-[#1c1917] dark:bg-stone-800 p-8 text-[#fffdf9] text-center shadow-xl mx-2"><div className="flex justify-center mb-4 text-[#d6d3d1]"><FoodIcon /></div><h3 className="font-bold text-[10px] uppercase tracking-[0.3em] text-[#a8a29e] mb-4">GÜNÜN LEZZETİ</h3><p className="text-2xl font-serif font-medium italic" style={{ fontFamily: '"Playfair Display", serif' }}>{content.food}</p></div></div></LeafCard>) : (<div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#fffdf9] dark:bg-[#1c1917]"><div className="p-6 bg-stone-50 dark:bg-stone-800 rounded-full mb-6"><LockIcon /></div><h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">Özel İçerik</h3><p className="text-stone-500 mb-8 max-w-xs mx-auto leading-relaxed">Bu bölüm sadece Premium üyelerimize açıktır.</p>{user ? (<button onClick={() => setShowPayment(true)} className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all">Kilidi Aç</button>) : (<button onClick={() => setShowLogin(true)} className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Giriş Yap</button>)}<button onClick={() => setStep(0)} className="mt-6 text-xs text-stone-400 underline">Başa Dön</button></div>))}
                
                {/* Step 4 */}
                {step === 4 && (<LeafCard onNext={null} btnText="" step={step} totalSteps={true}><div className="space-y-6 pt-6"><div className="text-center"><div className="flex justify-center mb-4 text-stone-400"><PenIcon /></div><h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">{staticTexts[language].journalTitle}</h2><p className="text-stone-500 text-sm">Bu yaprağın kenarına bir not düş.</p></div><div className="relative"><textarea value={journalNote} onChange={(e) => setJournalNote(e.target.value)} placeholder={staticTexts[language].journalPlaceholder} className="w-full h-48 bg-[#fffbf0] dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 border border-stone-200 rounded-xl p-6 font-serif text-stone-800 focus:outline-none focus:border-stone-400 resize-none shadow-inner leading-8" style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '100% 2rem', lineHeight: '2rem' }} /></div><button onClick={saveJournal} disabled={savingNote || !user} className="w-full py-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-stone-700 dark:hover:bg-stone-300 transition-all flex items-center justify-center gap-2">{savingNote ? "..." : staticTexts[language].save}</button><button onClick={() => setStep(0)} className="w-full text-xs font-bold tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all pt-4">{language === "en" ? "Read Again" : "Başa Dön"}</button></div></LeafCard>)}
            </>
        ) : (
            <div className="flex flex-col h-full items-center justify-center text-center p-8 bg-[#fffdf9] dark:bg-[#1c1917]"><div className="mb-6 opacity-30 scale-150 text-stone-400"><LeafIcon /></div><p className="text-xs font-bold tracking-[0.3em] uppercase text-stone-400 mb-2">{getFormattedDate(currentDate, language)}</p><h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-200 mb-4">Henüz bir yaprak yok.</h2><button onClick={() => setShowArchive(true)} className="px-8 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all">Tarih Değiştir</button></div>
        )}
      </div>
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