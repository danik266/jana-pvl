import { Waves } from 'lucide-react';


export default function Header({ onBackToHome, showBackButton }) {
  return (
    <header className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Waves className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ертіс / Ertis</h1>
              <p className="text-sky-100 text-sm">Павлодар - Ақылды қала / Smart City Pavlodar</p>
            </div>
          </div>
          {showBackButton && (
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 font-medium"
            >
              ← Басты бет / Home
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
