import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uygulama Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e6] p-8 text-center">
          <div className="text-4xl mb-4">🍂</div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Bir rüzgar esti...</h2>
          <p className="text-stone-500 mb-8 max-w-xs">Yapraklar biraz karıştı. Teknik ekibimiz (yani sen) durumu inceliyor.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-700 transition-all shadow-lg"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;