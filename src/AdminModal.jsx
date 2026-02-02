import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { toast } from 'sonner';

// --- DÜZELTME: BU BİLEŞENİ DIŞARI ALDIK ---
// Artık React bunu her seferinde baştan yaratmayacak, böylece yazı yazarken sorun yaşamayacaksın.
const InputGroup = ({ label, name, value, onChange, type = "text", placeholder, height = "h-12" }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all ${height}`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
      />
    )}
  </div>
);

export default function AdminModal({ onClose, language }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); 
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    image_url: "",
    audio_url: "",
    story_tr: "", story_en: "",
    note_tr: "", note_en: "",
    word_tr: "", word_en: "",
    meaning_tr: "", meaning_en: "",
    history_tr: "", history_en: "",
    food_tr: "", food_en: "",
    world_tr: "", world_en: ""
  });

  useEffect(() => {
    async function checkExisting() {
      const { data } = await supabase.from('content').select('*').eq('date', formData.date).single();
      if (data) {
        setFormData(data);
        toast("Bu tarih için içerik bulundu, düzenleniyor.", { icon: '✏️' });
      }
    }
    checkExisting();
  }, [formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('content').upsert(formData);
      if (error) throw error;
      toast.success("İçerik başarıyla yayınlandı! 🎉");
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      toast.error("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1c1917] w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800">
        
        {/* Üst Bar */}
        <div className="p-6 bg-stone-100 dark:bg-stone-900 flex justify-between items-center border-b border-stone-200 dark:border-stone-800">
          <h2 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">🍂 İçerik Editörü</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-red-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Sekmeler */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
          <button onClick={() => setActiveTab("general")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'general' ? 'bg-white dark:bg-[#1c1917] border-b-2 border-green-500 text-green-600' : 'text-stone-400 hover:text-stone-600'}`}>Genel</button>
          <button onClick={() => setActiveTab("tr")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'tr' ? 'bg-white dark:bg-[#1c1917] border-b-2 border-green-500 text-green-600' : 'text-stone-400 hover:text-stone-600'}`}>🇹🇷 Türkçe</button>
          <button onClick={() => setActiveTab("en")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'en' ? 'bg-white dark:bg-[#1c1917] border-b-2 border-green-500 text-green-600' : 'text-stone-400 hover:text-stone-600'}`}>🇬🇧 English</button>
        </div>

        {/* Form Alanı */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* GENEL SEKME */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <InputGroup label="Yayın Tarihi" name="date" type="date" value={formData.date} onChange={handleChange} />
              
              <div>
                 <InputGroup label="Kapak Görseli URL" name="image_url" placeholder="https://..." value={formData.image_url} onChange={handleChange} />
                 {/* Canlı Resim Önizleme */}
                 {formData.image_url && (
                    <div className="mt-2 w-full h-40 rounded-xl overflow-hidden border border-stone-200 relative group">
                        <img src={formData.image_url} alt="Önizleme" className="w-full h-full object-cover" 
                             onError={(e) => { e.target.style.display='none'; toast.error("Resim yüklenemedi, linki kontrol et."); }} 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Önizleme</div>
                    </div>
                 )}
                 <p className="text-[10px] text-stone-400 mt-1">İpucu: Resme sağ tıklayıp "Resim adresini kopyala" demelisin.</p>
              </div>

              <InputGroup label="Ses Dosyası URL" name="audio_url" placeholder="https://...mp3" value={formData.audio_url} onChange={handleChange} />
            </div>
          )}

          {/* TÜRKÇE SEKME */}
          {activeTab === "tr" && (
            <div className="space-y-2">
              <InputGroup label="Günün Hikayesi" name="story_tr" type="textarea" height="h-32" value={formData.story_tr} onChange={handleChange} />
              <InputGroup label="Günün Notu (Kısa)" name="note_tr" type="textarea" height="h-20" value={formData.note_tr} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Günün Kelimesi" name="word_tr" value={formData.word_tr} onChange={handleChange} />
                <InputGroup label="Anlamı" name="meaning_tr" value={formData.meaning_tr} onChange={handleChange} />
              </div>
              <InputGroup label="Dünyada Bugün" name="world_tr" type="textarea" value={formData.world_tr} onChange={handleChange} />
              <InputGroup label="Tarihsel Not (Premium)" name="history_tr" type="textarea" value={formData.history_tr} onChange={handleChange} />
              <InputGroup label="Günün Lezzeti (Premium)" name="food_tr" value={formData.food_tr} onChange={handleChange} />
            </div>
          )}

          {/* İNGİLİZCE SEKME */}
          {activeTab === "en" && (
            <div className="space-y-2">
              <InputGroup label="Story of the Day" name="story_en" type="textarea" height="h-32" value={formData.story_en} onChange={handleChange} />
              <InputGroup label="Note (Short)" name="note_en" type="textarea" height="h-20" value={formData.note_en} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Word of the Day" name="word_en" value={formData.word_en} onChange={handleChange} />
                <InputGroup label="Meaning" name="meaning_en" value={formData.meaning_en} onChange={handleChange} />
              </div>
              <InputGroup label="World Today" name="world_en" type="textarea" value={formData.world_en} onChange={handleChange} />
              <InputGroup label="Historical Note (Premium)" name="history_en" type="textarea" value={formData.history_en} onChange={handleChange} />
              <InputGroup label="Flavor of the Day (Premium)" name="food_en" value={formData.food_en} onChange={handleChange} />
            </div>
          )}

        </div>

        {/* Alt Bar: Kaydet */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">İptal</button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {loading ? "Kaydediliyor..." : "Yayınla ✨"}
          </button>
        </div>

      </div>
    </div>
  );
}