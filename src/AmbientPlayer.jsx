import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"; // <--- İŞTE BU EKSİKTİ, EKLENDİ!

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSound, setCurrentSound] = useState("rain");
  const audioRef = useRef(null);

  // Linkler
  const sounds = {
    rain: "https://github.com/rafaelreis-hotmart/Audio-Samples/raw/master/rain.mp3", 
    fire: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d14e0374ff.mp3",
    cafe: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3"
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.log("Oynatma hatası:", e));
    setIsPlaying(!isPlaying);
  };

  const changeSound = (soundKey) => {
    setCurrentSound(soundKey);
    setIsPlaying(true);
    setTimeout(() => {
        if(audioRef.current) audioRef.current.play();
    }, 50);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 group font-sans">
      <audio ref={audioRef} src={sounds[currentSound]} loop volume={volume} onVolumeChange={(e) => setVolume(e.target.volume)} />
      
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay} 
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl border border-stone-200 dark:border-stone-700 ${isPlaying ? 'bg-green-100 text-green-600 rotate-180' : 'bg-[#fffdf9] dark:bg-[#1c1917] text-stone-400'}`}
      >
        {isPlaying ? <span className="animate-pulse font-bold">II</span> : "♫"}
      </motion.button>

      <div className={`flex items-center gap-3 bg-[#fffdf9] dark:bg-[#1c1917] p-2 pl-4 rounded-full shadow-xl border border-stone-200 dark:border-stone-800 transition-all duration-300 ${isPlaying || "group-hover:opacity-100 group-hover:translate-x-0 opacity-0 -translate-x-4 pointer-events-none group-hover:pointer-events-auto"}`}>
        <button onClick={() => changeSound("rain")} title="Yağmur" className={`text-lg hover:scale-110 transition-transform ${currentSound === 'rain' ? 'opacity-100' : 'opacity-40'}`}>🌧️</button>
        <button onClick={() => changeSound("fire")} title="Şömine" className={`text-lg hover:scale-110 transition-transform ${currentSound === 'fire' ? 'opacity-100' : 'opacity-40'}`}>🔥</button>
        <button onClick={() => changeSound("cafe")} title="Kafe" className={`text-lg hover:scale-110 transition-transform ${currentSound === 'cafe' ? 'opacity-100' : 'opacity-40'}`}>☕</button>
        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => { setVolume(e.target.value); if(audioRef.current) audioRef.current.volume = e.target.value; }} className="w-16 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
      </div>
    </div>
  );
}