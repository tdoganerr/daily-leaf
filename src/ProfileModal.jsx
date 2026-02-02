import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { motion, AnimatePresence } from "framer-motion";

// --- İKONLAR (Bu dosya için özel) ---
const XIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const UserCircleIcon = () => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const TrophyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M8 21h8m-4-9v9m-8-3h16M5.5 2h13a1 1 0 0 1 .5 1.5L14 11l-2 3-2-3-5-7.5A1 1 0 0 1 5.5 2z"/></svg>;
const FlameIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3a7 7 0 0 0 3 2.8z"/></svg>;
const BookOpenIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const ShieldCheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const CrownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;

export default function ProfileModal({ user, language, onClose, onLogout, onOpenAdmin }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dil metinleri
  const texts = {
    tr: {
      profile: "Profil",
      streak: "Günlük Seri",
      totalReads: "Toplam Okuma",
      joined: "Katılım",
      logout: "Çıkış Yap",
      admin: "Yönetici Paneli",
      premium: "Premium Üye",
      free: "Standart Üye",
      stats: "İstatistikler",
      loading: "Yükleniyor..."
    },
    en: {
      profile: "Profile",
      streak: "Current Streak",
      totalReads: "Total Reads",
      joined: "Joined",
      logout: "Log Out",
      admin: "Admin Panel",
      premium: "Premium Member",
      free: "Standard Member",
      stats: "Statistics",
      loading: "Loading..."
    }
  };
  const t = texts[language];

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setStats(data);
        }
      } catch (err) {
        console.error("Profil hatası:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user]);

  // Arka planı kilitle (Scroll engelleme)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const isAdmin = user?.email === "admin@dailyleaf.com" || user?.email === "batuhankiyak99@gmail.com"; // Buraya kendi admin mailini de ekleyebilirsin
  const joinDate = new Date(user?.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR', { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Arka Plan (Backdrop) - Tıklayınca kapanır */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"
      />

      {/* Yan Panel (Drawer) */}
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-sm h-full bg-[#fffdf9] dark:bg-[#1c1917] shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800"
      >
        
        {/* Üst Kısım: Kullanıcı Kartı */}
        <div className="p-8 bg-stone-100 dark:bg-stone-800/50 flex flex-col items-center border-b border-stone-200 dark:border-stone-700 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
          >
            <XIcon />
          </button>

          <div className="w-24 h-24 rounded-full bg-white dark:bg-stone-700 shadow-sm flex items-center justify-center text-stone-300 dark:text-stone-500 mb-4 ring-4 ring-stone-50 dark:ring-stone-800">
            {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
                <UserCircleIcon />
            )}
          </div>
          
          <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-1">{t.joined}: {joinDate}</p>
          
          <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border
            ${stats?.is_premium 
              ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900' 
              : 'bg-stone-200 text-stone-600 border-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:border-stone-600'}`}
          >
            {stats?.is_premium ? <CrownIcon /> : <ShieldCheckIcon />}
            {stats?.is_premium ? t.premium : t.free}
          </div>
        </div>

        {/* Orta Kısım: İstatistikler ve Menü */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {/* İstatistik Kartları */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pl-1">{t.stats}</h3>
            {loading ? (
                <div className="flex justify-center p-4 text-stone-400 text-xs animate-pulse">{t.loading}</div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 flex flex-col items-center justify-center gap-2 shadow-sm">
                        <FlameIcon />
                        <span className="text-2xl font-bold font-serif text-stone-800 dark:text-stone-200">{stats?.streak_count || 0}</span>
                        <span className="text-[9px] uppercase font-bold text-stone-400">{t.streak}</span>
                    </div>
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 flex flex-col items-center justify-center gap-2 shadow-sm">
                        <BookOpenIcon />
                        {/* total_reads sütunu yoksa streak_count'u geçici gösteriyorum, veritabanında varsa değiştir */}
                        <span className="text-2xl font-bold font-serif text-stone-800 dark:text-stone-200">{stats?.streak_count || 0}</span> 
                        <span className="text-[9px] uppercase font-bold text-stone-400">{t.totalReads}</span>
                    </div>
                </div>
            )}
          </div>

          {/* Menü Listesi */}
          <div className="space-y-2">
            {isAdmin && (
              <button 
                onClick={onOpenAdmin}
                className="w-full p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold text-sm flex items-center gap-3 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <TrophyIcon /> {t.admin}
              </button>
            )}
            
            {/* Buraya gelecekte "Hesap Ayarları", "Bildirimler" vs eklenebilir */}
          </div>

        </div>

        {/* Alt Kısım: Çıkış Butonu */}
        <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
          <button 
            onClick={onLogout} 
            className="w-full py-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <LogoutIcon /> {t.logout}
          </button>
          <p className="text-center text-[10px] text-stone-300 mt-4">Daily Leaf v1.2</p>
        </div>

      </motion.div>
    </div>
  );
}