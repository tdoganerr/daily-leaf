import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// --- SİMGELER ---
const CloseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const DiamondIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"></path></svg>);
const HeartIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const RightArrow = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>);
const PenIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path></svg>);
const EditIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
// YENİ: İndirme İkonu
const DownloadIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);

export default function ProfileModal({ user, onClose, onLogout, onSelectDate, onOpenAdmin, onInstallApp, installable, language }) {
  const [activeTab, setActiveTab] = useState("favorites");
  const [favorites, setFavorites] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const ADMIN_EMAIL = "talhayigithandoganer@gmail.com"; 
  const isAdmin = user?.email === ADMIN_EMAIL;

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString(language === "en" ? "en-US" : "tr-TR", options);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single();
      if (profile?.is_premium) setIsPremium(true);

      const { data: favs } = await supabase.from('favorites').select('content_date').eq('user_id', user.id).order('content_date', { ascending: false });
      if (favs && favs.length > 0) {
        const dates = favs.map(f => f.content_date);
        const { data: contents } = await supabase.from('content').select('date, story_tr, story_en').in('date', dates);
        const combinedFavs = favs.map(fav => {
            const content = contents.find(c => c.date === fav.content_date);
            return { date: fav.content_date, preview: content ? (language === 'en' ? content.story_en : content.story_tr) : "..." };
        });
        setFavorites(combinedFavs);
      }

      const { data: myJournals } = await supabase.from('journals').select('date, note').eq('user_id', user.id).order('date', { ascending: false });
      if (myJournals) setJournals(myJournals);
      
      setLoading(false);
    }
    fetchData();
  }, [user, language]);

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex justify-end z-[70] animate-in slide-in-from-right duration-500">
      <div className="bg-[#fffdf9] w-full max-w-md h-full shadow-2xl p-6 flex flex-col relative border-l border-stone-200">
        
        <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
            <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">{language === 'en' ? 'My Profile' : 'Profilim'}</h2>
                <p className="text-xs text-stone-400 font-sans">{user.email}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"><CloseIcon /></button>
        </div>

        <div className={`p-5 rounded-2xl mb-6 flex items-center justify-between shadow-sm border ${isPremium ? 'bg-yellow-50 border-yellow-200' : 'bg-stone-50 border-stone-200'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-stone-200 text-stone-500'}`}><DiamondIcon /></div>
                <div>
                    <h3 className={`font-bold text-xs uppercase tracking-widest ${isPremium ? 'text-yellow-800' : 'text-stone-600'}`}>{isPremium ? 'Premium Üye' : 'Standart Üye'}</h3>
                    <p className="text-[10px] text-stone-500 mt-0.5">{isPremium ? (language === 'en' ? 'Active Subscription' : 'Abonelik Aktif') : (language === 'en' ? 'Unlock exclusive content' : 'Özel içeriklerin kilidini aç')}</p>
                </div>
            </div>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl mb-6">
            <button onClick={() => setActiveTab("favorites")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "favorites" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><HeartIcon /> {language === 'en' ? 'Collection' : 'Koleksiyon'}</button>
            <button onClick={() => setActiveTab("journal")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "journal" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><PenIcon /> {language === 'en' ? 'My Journal' : 'Günlüğüm'}</button>
        </div>

        <div className="flex-grow overflow-y-auto hide-scrollbar">
            {loading ? (<div className="text-center py-10 text-stone-400 text-sm animate-pulse">Yükleniyor...</div>) : (
                <>
                    {activeTab === "favorites" && (
                        favorites.length === 0 ? (<div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-xl"><p className="text-stone-400 mb-2">Henüz favorin yok.</p></div>) : 
                        (<div className="space-y-3">{favorites.map((fav) => (<button key={fav.date} onClick={() => { onSelectDate(fav.date, 0); onClose(); }} className="w-full bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all text-left group flex items-center justify-between"><div><p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{formatDate(fav.date)}</p><p className="text-stone-800 font-serif line-clamp-1 text-sm">"{fav.preview?.substring(0, 40)}..."</p></div><div className="text-stone-300 group-hover:text-stone-800"><RightArrow /></div></button>))}</div>)
                    )}
                    {activeTab === "journal" && (
                        journals.length === 0 ? (<div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-xl"><p className="text-stone-400 mb-2">Henüz bir not yazmadın.</p></div>) : 
                        (<div className="space-y-3">{journals.map((note) => (<button key={note.date} onClick={() => { onSelectDate(note.date, 4); onClose(); }} className="w-full bg-[#fffbf0] p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all text-left group"><div className="flex justify-between items-center mb-2"><p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{formatDate(note.date)}</p><PenIcon /></div><p className="text-stone-800 font-serif line-clamp-2 text-sm italic">"{note.note}"</p></button>))}</div>)
                    )}
                </>
            )}
        </div>

        {/* --- YENİ: UYGULAMA YÜKLEME VE ADMIN BUTONLARI --- */}
        <div className="mt-4 space-y-3">
            {/* Sadece yüklenebilir durumdaysa göster */}
            {installable && (
                <button onClick={onInstallApp} className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-700 flex items-center justify-center gap-2 shadow-md">
                    <DownloadIcon /> {language === 'en' ? 'Install App' : 'Uygulamayı Yükle'}
                </button>
            )}

            {isAdmin && (
                <button onClick={() => { onClose(); onOpenAdmin(); }} className="w-full py-3 bg-stone-200 text-stone-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-300 flex items-center justify-center gap-2">
                    <EditIcon /> Yazar Masası
                </button>
            )}
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100">
            <button onClick={onLogout} className="w-full py-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                {language === 'en' ? 'Log Out' : 'Çıkış Yap'}
            </button>
        </div>
      </div>
    </div>
  );
}