"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  ChevronDown,
  User,
  LogOut,
  Loader2,
  LogIn,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

// Метаданные языков
const languages = [
  { code: "kz", name: "Қазақша" },
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
];

// Переводы
const headerTranslations = {
  kz: {
    subtitle: "Smart City Pavlodar",
    back: "Басты бет",
    login: "Кіру",
    register: "Тіркелу",
    online: "Желіде",
    logout: "Шығу",
  },
  ru: {
    subtitle: "Умный город Павлодар",
    back: "На главную",
    login: "Вход",
    register: "Регистрация",
    online: "В сети",
    logout: "Выйти",
  },
  en: {
    subtitle: "Smart City Pavlodar",
    back: "Back to Home",
    login: "Login",
    register: "Register",
    online: "Online",
    logout: "Logout",
  },
};

export default function Header({
  onBackToHome,
  showBackButton,
  currentLanguage = "kz",
  onLanguageChange,
  onAuthChange,
}) {
  const router = useRouter();
  const [openLang, setOpenLang] = useState(false);
  const t = headerTranslations[currentLanguage] || headerTranslations.kz;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const sessionUser = session?.user ?? null;

      setUser(sessionUser);
      setLoading(false);

      if (onAuthChange) {
        onAuthChange(sessionUser);
      }
    };
    getUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  function handleLangClick(code) {
    if (onLanguageChange) {
      onLanguageChange(code);
    }
    setOpenLang(false);
  }

  const userName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    // ГРАДИЕНТНЫЙ ФОН + Золотая линия снизу
    <header className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-600 text-white shadow-xl relative z-50 border-b border-amber-400/30">
      
      {/* Декоративный блеск сверху (опционально) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* ЛОГОТИП */}
          <div className="flex items-center gap-4">
            {/* Если нужна иконка логотипа, можно добавить сюда. Пока просто текст */}
            <div className="flex flex-col">
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity drop-shadow-sm">
                  JANA PAVLODAR
                </h1>
              </Link>
              <p className="text-amber-200 text-xs md:text-sm font-bold tracking-wider uppercase opacity-90">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* ПРАВАЯ ПАНЕЛЬ */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Кнопка НАЗАД */}
            {showBackButton && (
              <>
                <button
                  onClick={onBackToHome}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all text-sm font-semibold border border-white/20 hover:border-amber-300/50 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  {t.back}
                </button>
                <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              </>
            )}

            {/* ЯЗЫКОВОЙ ПЕРЕКЛЮЧАТЕЛЬ */}
            <div className="relative">
              <button
                onClick={() => setOpenLang(!openLang)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 transition-all cursor-pointer hover:border-sky-200"
              >
                <Globe className="w-4 h-4 text-sky-100" />
                <span className="font-semibold text-sm">
                  {languages.find((l) => l.code === currentLanguage)?.name.slice(0, 3)}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform text-white/70 ${
                    openLang ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {openLang && (
                <div className="absolute right-0 mt-3 w-40 bg-white text-slate-800 rounded-2xl shadow-xl shadow-sky-900/20 overflow-hidden animate-fadeIn border border-sky-100 ring-1 ring-black/5 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangClick(l.code)}
                      className={`block w-full text-left px-5 py-3 text-sm font-semibold hover:bg-sky-50 transition-colors flex items-center justify-between ${
                        currentLanguage === l.code ? "bg-sky-50 text-teal-600" : ""
                      }`}
                    >
                      {l.name}
                      {currentLanguage === l.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Логика Авторизации */}
            {loading ? (
              <div className="opacity-70 flex items-center gap-2 px-4">
                <Loader2 className="w-5 h-5 animate-spin text-amber-200" />
              </div>
            ) : user ? (
              /* АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ */
              <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-white/10">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-sm font-bold leading-tight text-white shadow-black/10">
                    {userName}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    <span className="text-[10px] text-emerald-200 font-medium uppercase tracking-wider">
                      {t.online}
                    </span>
                  </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/30 shadow-inner">
                  <User className="w-5 h-5 text-white" />
                </div>
                
                <button
                  onClick={handleLogout}
                  title={t.logout}
                  className="p-2.5 bg-white/10 hover:bg-red-500/80 text-white rounded-xl transition-all border border-white/10 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* ГОСТЬ (Кнопки Входа) */
              <div className="flex items-center gap-3">
                <Link href="/auth">
                  <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-100 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <LogIn className="w-4 h-4" />
                    <span>{t.login}</span>
                  </button>
                </Link>
                
                {/* ЗОЛОТАЯ КНОПКА РЕГИСТРАЦИИ */}
                <Link href="/auth">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 transition-all border border-amber-300/20">
                    <UserPlus className="w-4 h-4" />
                    <span>{t.register}</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CSS Анимация для выпадающего меню */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(-10px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
      `}</style>
    </header>
  );
}