"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  ChevronDown,
  User,
  LogOut,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";

const languages = [
  { code: "kz", name: "Қазақша" },
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
];

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
  currentLanguage,
  onLanguageChange,
  onAuthChange,
}) {
  const router = useRouter();
  const [openLang, setOpenLang] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && onLanguageChange) onLanguageChange(savedLang);
  }, []);

  const langToUse = currentLanguage || "kz";
  const t = headerTranslations[langToUse];

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setLoading(false);
      if (onAuthChange) onAuthChange(sessionUser);
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

  const handleLangClick = (code) => {
    localStorage.setItem("lang", code);
    onLanguageChange(code);
    setOpenLang(false);
  };

  const userName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <header className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-600 text-white shadow-lg border-b border-amber-400/20 relative z-40">
      <div className="container mx-auto px-2 sm:px-4 py-2">
        {/* Контейнер хедера */}
        <div className="flex items-center justify-between h-12 sm:h-14 relative">
          
          {/* --- ЛЕВАЯ ЧАСТЬ: ЛОГОТИП (ТЕКСТ) --- */}
          {/* Скрываем текст на экранах меньше md (768px), чтобы дать место центру */}
          <div className=" leading-tight z-10 w-1/3">
            <Link href="/">
              <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight hover:text-amber-100 transition-colors">
                JANA PAVLODAR
              </h1>
            </Link>
            <p className="hidden md:block text-amber-200 text-xs font-bold uppercase -mt-1 opacity-90">
              {t.subtitle}
            </p>
          </div>
          
          {/* Для мобильных: пустой блок слева для баланса, если текст скрыт */}
          <div className="block md:hidden w-10"></div> 

          {/* --- ЦЕНТРАЛЬНЫЙ ШАНЫРАК --- */}
          {/* Абсолютное позиционирование по центру */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <Link href="/">
              <div className="relative group cursor-pointer p-2">
                {/* Эффект свечения */}
                <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <Image 
                  src="/shak.png" 
                  alt="Shanyrak" 
                  width={80} 
                  height={80} 
                  // Адаптивные размеры: меньше на телефоне (w-10), больше на ПК (sm:w-14)
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out group-hover:rotate-180"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* --- ПРАВАЯ ЧАСТЬ: КНОПКИ --- */}
          <div className="flex items-center justify-end gap-2 z-10 w-auto md:w-1/3">
            
            {/* ЯЗЫК */}
            <div className="relative">
              <button
                onClick={() => setOpenLang(!openLang)}
                className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
                aria-label="Change Language"
              >
                <Globe className="w-4 h-4 sm:w-4 sm:h-4" />
                {/* Текст языка скрыт на мобильных (hidden sm:block) */}
                <span className="hidden sm:block text-xs sm:text-sm font-medium">
                   {languages.find((l) => l.code === langToUse)?.name.slice(0, 3)}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    openLang ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openLang && (
                <div className="absolute right-0 mt-2 w-32 sm:w-36 bg-white text-slate-800 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden border border-slate-100">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangClick(l.code)}
                      className={`block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-sky-50 transition-colors ${
                        langToUse === l.code ? "bg-sky-50 text-teal-600" : ""
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* АВТОРИЗАЦИЯ */}
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white/70" />
            ) : user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20 ml-1">
                {/* Инфо о юзере (скрыто на мобильных) */}
                <div className="hidden lg:flex flex-col items-end mr-1 leading-tight">
                  <span className="text-xs font-bold max-w-[100px] truncate">{userName}</span>
                  <span className="text-[9px] text-emerald-200 uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    {t.online}
                  </span>
                </div>

                {/* Аватар */}
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                  <User className="w-4 h-4" />
                </div>

                {/* Кнопка выхода */}
                <button
                  onClick={handleLogout}
                  className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg border border-white/10 transition-colors text-white"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                {/* Кнопка Вход: Только иконка на моб, Текст на ПК */}
                <Link href="/auth">
                  <button className="flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-semibold hover:bg-white/10 rounded-lg transition-colors">
                    <LogIn className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t.login}</span>
                  </button>
                </Link>

                {/* Кнопка Регистрация: Только иконка на моб (стиль кнопки сохраняется) */}
                <Link href="/auth">
                  <button className="flex items-center justify-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-[#eeca00] hover:from-[#dfbe02] hover:to-[#ceaf01] text-white rounded-lg shadow-md transition-all hover:shadow-lg border-b-2 border-[#b89c00] active:border-b-0 active:translate-y-[2px]">
                    <UserPlus className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline text-xs sm:text-sm font-bold shadow-black drop-shadow-sm">
                      {t.register}
                    </span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}