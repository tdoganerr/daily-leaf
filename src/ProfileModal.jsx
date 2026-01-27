import { useState } from "react";

export default function ProfileModal({ user, language, onClose, onLogout, onSelectDate, onOpenAdmin, onInstallApp, installable }) {
  // SADECE SENİN GÖREBİLECEĞİN BUTON İÇİN KONTROL
  // Buraya kendi mail adresini yazdığından emin ol!
  const isAdmin = user?.email === "tdoganerr@gmail.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#fffdf9] dark:bg-[#1c1917] w-full max-w-sm rounded-[2rem] shadow-2xl p-6 relative flex flex-col items-center border border-stone-100 dark:border-stone-800">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="w-20 h-20 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner">
           👤
        </div>

        <h2 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-1">
          {user?.user_metadata?.full_name || "Gezgin Okur"}
        </h2>
        <p className="text-xs text-stone-500 mb-8">{user?.email}</p>

        <div className="w-full space-y-3">
          
          {/* YÖNETİCİ BUTONU (Sadece Admin Görür) */}
          {isAdmin && (
             <button onClick={onOpenAdmin} className="w-full py-3 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300 rounded-xl font-bold text-xs uppercase tracking-widest border border-red-100 dark:border-red-900 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                🛠️ Yönetici Paneli
             </button>
          )}

          {installable && (
            <button onClick={onInstallApp} className="w-full py-3 bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors">
              📲 Uygulamayı Yükle
            </button>
          )}

          <button onClick={onLogout} className="w-full py-3 border border-stone-200 text-stone-500 dark:border-stone-700 dark:text-stone-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
            {language === "en" ? "Log Out" : "Çıkış Yap"}
          </button>
        </div>

      </div>
    </div>
  );
}