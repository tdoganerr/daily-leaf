import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function ProfileModal({ user, language, onClose, onLogout, onSelectDate, onOpenAdmin, onInstallApp, installable }) {
  const isAdmin = user?.email === "tdoganerr@gmail.com";
  const [activeTab, setActiveTab] = useState("favorites");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verileri çek
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_interactions")
          .select(`
            id, is_favorite, note,
            content ( date, word_tr, word_en )
          `)
          .eq("user_id", user.id);

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error("Hata:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.id]);

  // Filtreleme
  const filteredItems = items.filter(item => {
    if (activeTab === "favorites") return item.is_favorite;
    if (activeTab === "notes") return item.note && item.note.length > 0;
    return false;
  });

  return (
    // DIŞ KAPLAYICI: Tüm ekranı kaplar ama içeriği sağa yaslar
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* İÇERİK: Sağdan gelen tam boy panel */}
      <div className="w-full max-w-sm h-full bg-[#fffdf9] dark:bg-[#1c1917] shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300">
        
        {/* 1. ÜST KISIM (Header) */}
        <div className="p-6 bg-stone-100/50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 flex flex-col items-center relative">
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 hover:text-red-500 transition-colors">
            ✕
          </button>
          
          <div className="w-20 h-20 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center text-3xl shadow-sm mb-4 border-2 border-white dark:border-stone-700 ring-1 ring-stone-200 dark:ring-stone-700">
             👤
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
            {user?.user_metadata?.full_name || "Gezgin Okur"}
          </h2>
          <p className="text-sm text-stone-500 mb-6">{user?.email}</p>

          {/* Aksiyon Butonları */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {isAdmin && (
               <button onClick={onOpenAdmin} className="col-span-2 py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 rounded-xl font-bold text-xs uppercase tracking-widest border border-red-100 dark:border-red-900 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  🛠️ Yönetici Paneli
               </button>
            )}
            {installable && (
              <button onClick={onInstallApp} className="py-3 bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-300 transition-colors">
                📲 Uygulamayı Kur
              </button>
            )}
            <button onClick={onLogout} className={`py-3 border border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors ${!installable ? 'col-span-2' : ''}`}>
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* 2. SEKMELER (Tabs) */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 sticky top-0 z-10">
          <button 
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'favorites' ? 'text-stone-800 border-b-2 border-stone-800 dark:text-white dark:border-white bg-stone-50 dark:bg-stone-800' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
          >
            ❤️ Favoriler
          </button>
          <button 
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'notes' ? 'text-stone-800 border-b-2 border-stone-800 dark:text-white dark:border-white bg-stone-50 dark:bg-stone-800' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
          >
            📝 Notlarım
          </button>
        </div>

        {/* 3. LİSTE ALANI */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#fffdf9] dark:bg-[#1c1917]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-stone-400">
                <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
                <span className="text-xs">Yükleniyor...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-stone-400 gap-4">
              <span className="text-4xl opacity-20">{activeTab === 'favorites' ? '🍂' : '✏️'}</span>
              <span className="text-sm font-medium">Listeniz henüz boş.</span>
            </div>
          ) : (
            <div className="space-y-3 pb-8">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    if(item.content?.date) {
                        onSelectDate(item.content.date);
                        onClose();
                    }
                  }}
                  className="group relative p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-green-500 dark:hover:border-green-500 hover:shadow-md cursor-pointer transition-all"
                >
                    {/* Tarih Rozeti */}
                    <div className="absolute -top-2.5 left-4 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-[10px] font-bold text-stone-500 border border-stone-200 dark:border-stone-700 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                        {item.content?.date}
                    </div>

                    <div className="mt-1 flex justify-between items-start">
                        <h4 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                            {language === 'tr' ? item.content?.word_tr : item.content?.word_en}
                        </h4>
                        {activeTab === 'favorites' && <span className="text-red-500 text-sm">❤️</span>}
                    </div>
                  
                    {activeTab === 'notes' && (
                        <div className="mt-3 pl-3 border-l-2 border-amber-300 dark:border-amber-700">
                            <p className="text-sm text-stone-600 dark:text-stone-400 italic line-clamp-3">
                                "{item.note}"
                            </p>
                        </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}