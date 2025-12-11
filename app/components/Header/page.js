import { Waves, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function Header({ onBackToHome, showBackButton }) {
  return (
    <header className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Логотип и Название */}
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300">
              <Waves className="w-8 h-8" />
            </Link>
            <div>
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity">
                  Ертіс / Ertis
                </h1>
              </Link>
              <p className="text-sky-100 text-xs md:text-sm font-medium opacity-90">
                Павлодар - Ақылды қала / Smart City Pavlodar
              </p>
            </div>
          </div>

          {/* Правая часть: Кнопки навигации и авторизации */}
          <div className="flex items-center gap-3 md:gap-4 self-end md:self-auto">
            
            {/* Кнопка "Назад" (если нужна) */}
            {showBackButton && (
              <button
                onClick={onBackToHome}
                className="hidden md:flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200 text-sm font-medium border border-white/10"
              >
                ← Басты бет
              </button>
            )}

            {/* Разделитель (виден только если есть кнопка Назад) */}
            {showBackButton && (
              <div className="hidden md:block w-px h-8 bg-white/20"></div>
            )}

            {/* Блок авторизации */}
            <div className="flex items-center gap-2 md:gap-3">
              
              {/* Кнопка Входа (Прозрачная) */}
              <Link href="/auth">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white hover:text-sky-50 hover:bg-white/10 rounded-lg transition-all duration-200 group">
                  <LogIn className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline">Кіру</span>
                  <span className="sm:hidden">Вход</span>
                </button>
              </Link>

              {/* Кнопка Регистрации (Белая, акцентная) */}
              <Link href="/auth">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-sky-600 hover:bg-sky-50 rounded-lg font-bold text-sm shadow-md shadow-sky-900/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Тіркелу</span>
                  <span className="sm:hidden">Рег-ция</span>
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}