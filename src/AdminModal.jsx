import { useState } from "react";
import { supabase } from "./supabase";

export default function AdminModal({ onClose, language }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    story_tr: "", story_en: "",
    note_tr: "", note_en: "",
    world_tr: "", world_en: "",
    history_tr: "", history_en: "",
    food_tr: "", food_en: "",
    word_tr: "", meaning_tr: "", // YENİ
    word_en: "", meaning_en: "", // YENİ
    image_url: "", audio_url: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('content').upsert(formData, { onConflict: 'date' });
    setLoading(false);
    if (error) alert("Hata: " + error.message);
    else { alert("Yaprak ve Kelime eklendi! 🍃"); onClose(); }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-in zoom-in duration-300">
      <div className="bg-[#fffdf9] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 border border-stone-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Yazar Masası 🖋️</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-red-500 text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Tarih</label><input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-bold" /></div>
            
            {/* Medya */}
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="image_url" placeholder="Görsel URL" value={formData.image_url} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs" />
                <input type="text" name="audio_url" placeholder="Ses URL" value={formData.audio_url} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs" />
            </div>

            {/* Hikaye */}
            <div className="grid md:grid-cols-2 gap-4">
                <textarea required name="story_tr" rows="3" value={formData.story_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" placeholder="Hikaye (TR)" />
                <textarea required name="story_en" rows="3" value={formData.story_en} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" placeholder="Story (EN)" />
            </div>

            {/* YENİ: GÜNÜN KELİMESİ */}
            <div className="p-4 bg-stone-100 rounded-xl border border-stone-200">
                <h3 className="text-xs font-bold uppercase text-stone-500 mb-3">Günün Kelimesi (Lügat)</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-2">
                    <input type="text" name="word_tr" placeholder="Kelime (TR) - Örn: Yakamoz" value={formData.word_tr} onChange={handleChange} className="p-3 bg-white border border-stone-200 rounded-xl text-sm font-bold" />
                    <input type="text" name="meaning_tr" placeholder="Anlamı (TR)" value={formData.meaning_tr} onChange={handleChange} className="p-3 bg-white border border-stone-200 rounded-xl text-sm" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" name="word_en" placeholder="Word (EN)" value={formData.word_en} onChange={handleChange} className="p-3 bg-white border border-stone-200 rounded-xl text-sm font-bold" />
                    <input type="text" name="meaning_en" placeholder="Meaning (EN)" value={formData.meaning_en} onChange={handleChange} className="p-3 bg-white border border-stone-200 rounded-xl text-sm" />
                </div>
            </div>

            {/* Not & Diğerleri */}
            <div className="grid md:grid-cols-2 gap-4">
                <input required type="text" name="note_tr" placeholder="Söz (TR)" value={formData.note_tr} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" />
                <input required type="text" name="note_en" placeholder="Quote (EN)" value={formData.note_en} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" />
            </div>
            <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4"><input type="text" name="world_tr" placeholder="Dünya (TR)" value={formData.world_tr} onChange={handleChange} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" /><input type="text" name="world_en" placeholder="World (EN)" value={formData.world_en} onChange={handleChange} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" /></div>
                <div className="grid md:grid-cols-2 gap-4"><input type="text" name="history_tr" placeholder="Tarih (TR)" value={formData.history_tr} onChange={handleChange} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" /><input type="text" name="history_en" placeholder="History (EN)" value={formData.history_en} onChange={handleChange} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" /></div>
                <div className="grid md:grid-cols-2 gap-4"><input type="text" name="food_tr" placeholder="Yemek (TR)" value={formData.food_tr} onChange={handleChange} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" /><input type="text" name="food_en" placeholder="Food (EN)" value={formData.food_en} onChange={handleChange} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" /></div>
            </div>

            <button disabled={loading} className="w-full py-4 bg-stone-900 text-stone-50 rounded-xl font-bold tracking-widest uppercase hover:bg-stone-700 transition-all shadow-lg">{loading ? "..." : "YAPRAĞI BAS"}</button>
        </form>
      </div>
    </div>
  );
}