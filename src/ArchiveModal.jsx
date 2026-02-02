import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { motion } from "framer-motion";

export default function ArchiveModal({ selectedDate, onClose, onSelectDate }) {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArchives() {
      try {
        // 1. Content tablosundan geçmiş içerikleri çek (Resim, Başlık, Tarih)
        // Sadece bugünden önceki veya bugünkü içerikleri getir
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('content')
          .select('date, image_url, word_tr, word_en, note_tr')
          .lte('date', today) // Gelecekteki içerikleri gösterme
          .order('date', { ascending: false }); // En yeniden eskiye

        if (error) throw error;
        setArchives(data);

      } catch (error) {
        console.error("Arşiv hatası:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArchives();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#fffdf9] dark:bg-[#1c1917] w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 relative">
        
        {/* Başlık Barı */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-[#292524]">
          <div>
             <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100">Kütüphane</h2>
             <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Geçmiş Yapraklar</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:bg-red-50 hover:text-red-500 transition-colors">✕</button>
        </div>

        {/* İçerik Izgarası (Grid) */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50 dark:bg-[#1c1917]">
          {loading ? (
             <div className="flex justify-center items-center h-full text-stone-400">Yükleniyor...</div>
          ) : archives.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-stone-400">
                <span className="text-4xl mb-4">📭</span>
                <p>Henüz arşivlenmiş bir yaprak yok.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {archives.map((item, index) => (
                <motion.div
                  key={item.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectDate(item.date)}
                  className="group cursor-pointer bg-white dark:bg-[#292524] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100 dark:border-stone-800"
                >
                  {/* Resim Alanı */}
                  <div className="h-40 w-full bg-stone-200 dark:bg-stone-800 relative overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt="Kapak" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 text-4xl">🍂</div>
                    )}
                    {/* Tarih Rozeti */}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 shadow-sm">
                      {formatDate(item.date)}
                    </div>
                  </div>

                  {/* Metin Alanı */}
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-100 mb-2 line-clamp-1">
                      {item.word_tr || "Günün Yaprağı"}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed italic">
                      "{item.note_tr || "İçerik yükleniyor..."}"
                    </p>
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center">
                       <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest group-hover:underline">Tekrar Oku</span>
                       <span className="text-stone-300 text-lg">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}