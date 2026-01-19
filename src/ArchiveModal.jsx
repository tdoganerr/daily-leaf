import { useState } from "react";

export default function ArchiveModal({ onClose, onSelectDate, selectedDate }) {
  // Bugünün tarihi (Maksimum seçilebilir tarih bugün olmalı, yarına gidemesinler)
  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
      <div className="bg-[#fffdf9] p-8 rounded-[2rem] shadow-2xl max-w-sm w-full border border-stone-200 text-center relative">
        
        {/* Kapat Butonu */}
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors bg-stone-100 rounded-full p-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="text-stone-300 mb-4 flex justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        
        <h2 className="text-2xl font-serif text-stone-900 mb-2 font-bold">Geçmişe Yolculuk</h2>
        <p className="text-stone-500 text-sm mb-8 font-serif">
          Hangi günün yaprağını okumak istersin?
        </p>

        {/* Tarih Seçici */}
        <div className="relative mb-8">
            <input 
                type="date" 
                max={maxDate}
                value={selectedDate}
                onChange={(e) => onSelectDate(e.target.value)}
                className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl text-stone-800 font-bold text-center focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-widest cursor-pointer"
            />
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-stone-900 text-[#f5f0e6] rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-stone-700 transition-all shadow-lg"
        >
          Yaprağı Getir
        </button>
      </div>
    </div>
  );
}