import { useState } from "react";
import { supabase } from "./supabase";

export default function PaymentModal({ user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    // 1. Simülasyon: Ödeme işlemi 2 saniye sürsün (Buraya gerçek pos bağlanır)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Veritabanını güncelle: Kullanıcıyı Premium yap
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, is_premium: true });

    setLoading(false);

    if (!error) {
      alert("Tebrikler! Artık Premium üyesisin. 🎉");
      onSuccess(); // Ana sayfaya "başardık" haberini ver
      onClose();   // Pencereyi kapat
    } else {
      alert("Hata oluştu: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[#fffdf9] p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-stone-200 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800">✕</button>
        
        <div className="text-4xl mb-4">💎</div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2 font-bold">Daily Leaf Premium</h2>
        <p className="text-stone-500 text-sm mb-6 font-serif">
          Geçmiş yapraklara erişim, reklamsız deneyim ve özel içerikler için yükselt.
        </p>

        <div className="bg-stone-100 p-4 rounded-lg mb-6 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-stone-800">Yıllık Plan</span>
            <span className="text-stone-900 font-bold">$19.99</span>
          </div>
          <p className="text-xs text-stone-500">Bugün öde, bir yıl boyunca kafan rahat olsun.</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 bg-stone-900 text-[#f5f0e6] rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-stone-700 transition-all shadow-lg flex justify-center items-center gap-2"
        >
          {loading ? "Ödeme Onaylanıyor..." : "Şimdi Yükselt"}
        </button>
        
        <p className="text-[10px] text-stone-400 mt-4">Güvenli ödeme altyapısı ile korunmaktadır.</p>
      </div>
    </div>
  );
}