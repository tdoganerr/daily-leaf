export default function Skeleton() {
  return (
    <div className="flex flex-col h-full relative bg-[#fffdf9] animate-pulse">
      
      {/* Görsel Alanı İskeleti */}
      <div className="w-full h-2/3 md:h-1/2 relative bg-stone-200">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fffdf9] to-transparent"></div>
      </div>

      {/* İçerik Alanı İskeleti */}
      <div className="px-8 -mt-6 relative z-10 space-y-6">
        
        {/* Başlık Kartı */}
        <div className="bg-[#fffdf9] border border-stone-100 p-6 rounded-3xl shadow-sm space-y-4">
          {/* Tarih */}
          <div className="h-3 w-1/3 bg-stone-200 rounded-full mx-auto"></div>
          {/* Büyük Başlık */}
          <div className="h-8 w-3/4 bg-stone-200 rounded-full mx-auto"></div>
          
          {/* Liste Öğeleri */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-200 rounded-2xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-2 w-10 bg-stone-200 rounded-full"></div>
                <div className="h-3 w-full bg-stone-200 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-200 rounded-2xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-2 w-10 bg-stone-200 rounded-full"></div>
                <div className="h-3 w-2/3 bg-stone-200 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 bg-stone-200 rounded-2xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-2 w-10 bg-stone-200 rounded-full"></div>
                <div className="h-3 w-1/2 bg-stone-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Alt Buton İskeleti */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20">
        <div className="w-full h-14 bg-stone-200 rounded-2xl"></div>
      </div>

    </div>
  );
}