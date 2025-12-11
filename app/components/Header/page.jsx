"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // <--- 1. Добавляем импорт Image
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
      <div className="container mx-auto px-3 py-2">
        {/* Добавляем relative сюда, чтобы шанырак центрировался относительно этого блока */}
        <div className="flex items-center justify-between h-14 max-[400px]:justify-end relative">
          
          {/* ЛОГО (Текст) */}
          <div className="leading-tight max-[400px]:hidden z-10">
            <Link href="/">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                JANA PAVLODAR
              </h1>
            </Link>
            <p className="text-amber-200 text-[10px] md:text-xs font-bold uppercase -mt-1">
              {t.subtitle}
            </p>
          </div>

          {/* --- ЦЕНТРАЛЬНЫЙ ШАНЫРАК --- */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
             <Link href="/">
                <div className="relative group cursor-pointer">
                  {/* Эффект свечения сзади */}
                  <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <Image 
                    src="/shak.png" 
                    alt="Shanyrak" 
                    width={80} 
                    height={80} 
                    className="w-8 h-8 sm:w-14 sm:h-14 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out "
                    priority
                  />
                </div>
             </Link>
          </div>
          {/* ----------------------------- */}

          {/* ПРАВАЯ ПАНЕЛЬ */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            {/* ЯЗЫК */}
            <div className="relative">
              <button
                onClick={() => setOpenLang(!openLang)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-xs sm:text-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                {languages.find((l) => l.code === langToUse)?.name.slice(0, 3)}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    openLang ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openLang && (
                <div className="absolute right-0 mt-2 w-32 sm:w-36 bg-white text-slate-800 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
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
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-white/20">
                <div className="hidden sm:flex flex-col items-end mr-1 leading-tight">
                  <span className="text-xs font-bold">{userName}</span>
                  <span className="text-[9px] text-emerald-200 uppercase flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    {t.online}
                  </span>
                </div>

                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                  <User className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg border border-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/auth">
                  <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-white/10 rounded-lg transition-colors">
                    <LogIn className="w-4 h-4" />
                    {t.login}
                  </button>
                </Link>

                <Link href="/auth">
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-[#eeca00] hover:from-[#dfbe02] hover:to-[#ceaf01] text-white rounded-lg font-bold text-[10px] sm:text-sm flex items-center gap-1 max-[440px]:px-2 max-[440px]:text-[9px] shadow-md transition-all hover:shadow-lg">
                    <UserPlus className="w-4 h-4" />
                    {t.register}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } }
      `}</style>
    </header>
  );
}