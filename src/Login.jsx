import { useState } from "react";
import { supabase } from "./supabase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Kayıt ol modu mu?
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let error;
    
    if (isSignUp) {
      // Kayıt Olma İşlemi
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
      if (!error) setMessage("Kayıt başarılı! Giriş yapılıyor...");
    } else {
      // Giriş Yapma İşlemi
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    }

    if (error) {
      setMessage(error.message);
    } else if (!isSignUp) {
      // Başarılı giriş
      onLogin(); 
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5f0e6] p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-stone-200">
        <h2 className="text-2xl font-serif text-stone-900 mb-2 font-bold text-center">
          {isSignUp ? "Aramıza Katıl" : "Tekrar Hoşgeldin"}
        </h2>
        <p className="text-stone-500 text-sm text-center mb-6 font-serif">
          {isSignUp ? "Günlük yaprağını saklamak için kaydol." : "Kaldığın yerden devam et."}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="E-posta Adresin"
              className="w-full p-3 bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:border-stone-600 font-serif"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Şifren"
              className="w-full p-3 bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:border-stone-600 font-serif"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && <p className="text-xs text-red-500 text-center">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-[#f5f0e6] rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-stone-700 transition-all disabled:opacity-50"
          >
            {loading ? "İşleniyor..." : (isSignUp ? "Kayıt Ol" : "Giriş Yap")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
            className="text-xs text-stone-500 underline hover:text-stone-800 transition-colors"
          >
            {isSignUp ? "Zaten hesabın var mı? Giriş yap." : "Hesabın yok mu? Kayıt ol."}
          </button>
        </div>
        
        {/* Kapat Butonu (Giriş yapmadan devam etmek için opsiyonel) */}
        <button onClick={onLogin} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800">
          ✕
        </button>
      </div>
    </div>
  );
}