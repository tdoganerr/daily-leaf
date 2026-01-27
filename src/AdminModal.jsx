import { useState } from "react";
import { supabase } from "./supabase";
import { toast } from "sonner";

export default function AdminModal({ onClose, language }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    image_url: "",
    audio_url: "",
    story_tr: "",
    story_en: "",
    note_tr: "",
    note_en: "",
    word_tr: "",
    word_en: "",
    meaning_tr: "",
    meaning_en: "",
    history_tr: "",
    history_en: "",
    food_tr: "",
    food_en: "",
    world_tr: "",
    world_en: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Önce bu tarih için kayıt var mı kontrol et
      const { data: existing } = await supabase
        .from("content")
        .select("id")
        .eq("date", formData.date)
        .single();

      if (existing) {
        // Varsa Güncelle (Update)
        const { error } = await supabase
          .from("content")
          .update(formData)
          .eq("id", existing.id);
        if (error) throw error;
        toast.success("İçerik güncellendi! 🔄");
      } else {
        // Yoksa Ekle (Insert)
        const { error } = await supabase.from("content").insert([formData]);
        if (error) throw error;
        toast.success("Yeni yaprak eklendi! 🍃");
      }
      onClose();
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Kaydedilirken hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#fffdf9] dark:bg-[#1c1917] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800">
        
        {/* Başlık */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-900">
          <h2 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-200">
            Yönetici Paneli 🛠️
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-red-500 transition-colors">✕</button>
        </div>

        {/* Form Alanı */}
        <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Tarih ve Medya */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Tarih</label>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Resim URL</label>
                <input type="text" name="image_url" placeholder="https://..." value={formData.image_url} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Ses URL</label>
                <input type="text" name="audio_url" placeholder="https://..." value={formData.audio_url} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
            </div>

            <hr className="border-stone-100 dark:border-stone-800" />

            {/* Hikaye (TR/EN) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Hikaye (TR)</label>
                <textarea required rows="6" name="story_tr" value={formData.story_tr} onChange={handleChange} className="w-full p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl resize-none" placeholder="Türkçe hikaye..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Story (EN)</label>
                <textarea required rows="6" name="story_en" value={formData.story_en} onChange={handleChange} className="w-full p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl resize-none" placeholder="English story..." />
              </div>
            </div>

            {/* Not (Quote) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Günün Sözü (TR)</label>
                <input type="text" name="note_tr" value={formData.note_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Quote (EN)</label>
                <input type="text" name="note_en" value={formData.note_en} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
            </div>

            {/* Kelime & Anlamı */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Kelime (TR)</label>
                <input type="text" name="word_tr" value={formData.word_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Anlamı (TR)</label>
                <input type="text" name="meaning_tr" value={formData.meaning_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Word (EN)</label>
                <input type="text" name="word_en" value={formData.word_en} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-400">Meaning (EN)</label>
                <input type="text" name="meaning_en" value={formData.meaning_en} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
              </div>
            </div>

             {/* Diğerleri (Tarih, Yemek, Dünya) */}
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="history_tr" placeholder="Tarihte Bugün (TR)" value={formData.history_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
                    <input type="text" name="history_en" placeholder="History Note (EN)" value={formData.history_en} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="food_tr" placeholder="Günün Yemeği (TR)" value={formData.food_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
                    <input type="text" name="food_en" placeholder="Food of the Day (EN)" value={formData.food_en} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="world_tr" placeholder="Dünyadan Haber (TR)" value={formData.world_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
                    <input type="text" name="world_en" placeholder="World News (EN)" value={formData.world_en} onChange={handleChange} className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl" />
                </div>
             </div>

          </form>
        </div>

        {/* Footer Buton */}
        <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
            <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-stone-900 text-white dark:bg-white dark:text-stone-900 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                {loading ? "Kaydediliyor..." : "İçeriği Kaydet"}
            </button>
        </div>

      </div>
    </div>
  );
}