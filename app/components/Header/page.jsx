"use client";

import { Waves, LogIn, UserPlus, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const languages = [
  { code: "kz", name: "Қазақша" },
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
];

export default function Header({
  onBackToHome,
  showBackButton,
  currentLanguage = "kz",
}) {
  const [openLang, setOpenLang] = useState(false);
  const [lang, setLang] = useState(currentLanguage);

  function changeLang(code) {
    setLang(code);
    setOpenLang(false);
    console.log("Смена языка на:", code);
  }

  return (
    <header className="bg-[#419181] text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Логотип */}
          <div className="flex items-center gap-3">
            <div>
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity">
                  JANA PAVLODAR
                </h1>
              </Link>
              <p className="text-white/80 text-xs md:text-sm font-medium">
                Smart City Pavlodar
              </p>
            </div>
          </div>

          {/* Правая панель */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Кнопка назад */}
            {showBackButton && (
              <button
                onClick={onBackToHome}
                className="hidden md:flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all text-sm font-medium border border-white/10"
              >
                ← Басты бет
              </button>
            )}

            {showBackButton && (
              <div className="hidden md:block w-px h-8 bg-white/20"></div>
            )}

            {/* Переключатель языка */}
            <div className="relative">
              <button
                onClick={() => setOpenLang(!openLang)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/10 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-white/90" />
                <span className="font-medium text-sm">
                  {languages.find((l) => l.code === lang)?.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openLang ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Выпадающее меню */}
              {openLang && (
                <div className="absolute right-0 mt-2 w-36 bg-white text-[#419181] rounded-xl shadow-lg overflow-hidden animate-fadeIn border border-sky-100">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => changeLang(l.code)}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-[#419181]/10 transition ${
                        lang === l.code ? "bg-[#419181]/20" : ""
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Разделитель */}
            <div className="w-px h-8 bg-white/20"></div>

            {/* Авторизация */}
            <div className="flex items-center gap-3">
              <Link href="/auth">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 rounded-lg transition-all group">
                  <LogIn className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline">Кіру</span>
                  <span className="sm:hidden">Вход</span>
                </button>
              </Link>

              <Link href="/auth">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#419181] hover:bg-white/90 rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Тіркелу</span>
                  <span className="sm:hidden">Рег-ция</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Анимация dropdown */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
