
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'home' | 'my-bookings' | 'admin';
  setView: (view: 'home' | 'my-bookings' | 'admin') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const handleAdminAccess = () => {
    const code = prompt("Entrez le code administrateur :");
    if (code === "padelist!!") {
      setView('admin');
    } else if (code !== null) {
      alert("Code incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <span className="text-white font-bold text-xl">P+</span>
            </div>
            <span className="text-2xl font-black text-gray-800 tracking-tight">PadelPlus</span>
          </div>
          
          <nav className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setView('home')}
              className={`text-sm font-semibold transition-colors ${currentView === 'home' ? 'text-green-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Terrains
            </button>
            <button 
              onClick={() => setView('my-bookings')}
              className={`text-sm font-semibold transition-colors ${currentView === 'my-bookings' ? 'text-green-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Réservations
            </button>
            <button 
              onClick={handleAdminAccess}
              className={`text-xs uppercase tracking-widest font-bold transition-colors border-l pl-4 ${currentView === 'admin' ? 'text-red-600' : 'text-gray-300 hover:text-gray-600'}`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center">
        <p className="text-gray-400 text-sm">© 2024 PadelPlus 🇱🇧. Beyrouth, Achrafieh.</p>
      </footer>
    </div>
  );
};
