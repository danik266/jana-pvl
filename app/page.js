"use client";

import { useState, useEffect } from "react"; // 1. useEffect қосамыз
import Image from "next/image";
import { Home, Map, Scale, Bot, ArrowRight } from "lucide-react";
import Header from "./components/Header/page";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const font = Montserrat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function App() {
  const [lang, setLang] = useState("kz");
  
  // 2. Жүктеу экранының күйі (басында true болып тұрады)
  const [isLoading, setIsLoading] = useState(true);

  // 3. Таймер: Сайт ашылғанда 2.5 секундтан кейін жүктеу экранын өшіреді
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  const translations = {
    kz: {
      tag: "Павлодар қаласының ақылды қала жүйесі",
      mainTitle: "Ертіс - Павлодардың Ақылды Қала Платформасы",
      mainDesc:
        "Тұрғын үй, туризм, заңгерлік көмек және инфрақұрылымға арналған AI шешімдері.",
      btnOpen: "Ашу",
      footer:
        "© 2025 Jana Pavlodar • Павлодар қаласы • Павлодар тұрғындары үшін ❤️ жасалған",
      madeIn: "Made In Kazakhstan",
      loadingText: "Жүктелуде...", // Жаңа аударма
      modules: {
        ErtisHome: {
          title: "Қалалық су және энергетика",
          subtitle: "Water & Energy",
          desc: "AI есептегішін оқу құралы және түбіртек талдауы",
        },
        ErtisTour: {
          title: "Туризм және гид",
          subtitle: "Tourism & City Guide",
          desc: "Көрікті жерлер картасы, қонақ үйлер және маршруттар",
        },
        ErtisLaw: {
          title: "Шағымдар мен өтініштер жіберу",
          subtitle: "Digital Lawyer",
          desc: "Заңды шағымдар мен ресми өтініштерді дайындау және жіберу.",
        },
        ErtisAI: {
          title: "Jana Pavlodar AI",
          subtitle: "City Assistant",
          desc: "Қала бойынша кез келген сұраққа жауап беретін көмекші",
        },
      },
    },
    ru: {
      tag: "Система умного города Павлодар",
      mainTitle: "Jana Pavlodar - Платформа Умного Города",
      mainDesc:
        "AI решения для ГорВодоканала, туризма, подача заявлений и городской инфраструктуры.",
      btnOpen: "Открыть",
      footer:
        "© 2025 Jana Pavlodar • г. Павлодар • Сделано с ❤️ для жителей Павлодара",
      madeIn: "Made In Kazakhstan",
      loadingText: "Загрузка...",
      modules: {
        ErtisHome: {
          title: "Городской Водоконал и Энергия",
          subtitle: "Water & Energy",
          desc: "AI считыватель счетчиков и анализ квитанций",
        },
        ErtisTour: {
          title: "Туризм и Гид",
          subtitle: "Tourism & City Guide",
          desc: "Карта достопримечательностей, отели и маршруты",
        },
        ErtisLaw: {
          title: "Подача жалоб и заявлений",
          subtitle: "Онлайн-приёмная",
          desc: "Оформление и подача жалоб, обращений и заявлений в соответствующие инстанции.",
        },
        ErtisAI: {
          title: "AI Ассистент",
          subtitle: "City Assistant",
          desc: "Умный помощник по вопросам города и услуг",
        },
      },
    },
    en: {
      tag: "Pavlodar Smart City System",
      mainTitle: "Ertis - Smart City Platform",
      mainDesc:
        "AI-powered solutions for housing, tourism, legal assistance, and infrastructure.",
      btnOpen: "Open",
      footer:
        "© 2025 Jana Pavlodar • Pavlodar City • Made with ❤️ for Pavlodar residents",
      madeIn: "Made in Kazakhstan",
      loadingText: "Loading...",
      modules: {
        ErtisHome: {
          title: "City Water and Energy",
          subtitle: "Water & Energy",
          desc: "AI meter reader and receipt analysis",
        },
        ErtisTour: {
          title: "Tourism & Guide",
          subtitle: "Tourism & City Guide",
          desc: "Sights map, hotels, and tourist routes",
        },
        ErtisLaw: {
          title: "Submission of Complaints and Applications",
          subtitle: "Digital Lawyer",
          desc: "Create and submit legal complaints and official applications.",
        },
        ErtisAI: {
          title: "City AI Chat",
          subtitle: "City Assistant",
          desc: "Smart assistant for any city-related questions",
        },
      },
    },
  };

  const t = translations[lang];

  const modules = [
    { id: "ErtisAI", icon: Bot, ...t.modules.ErtisAI },
    { id: "ErtisTour", icon: Map, ...t.modules.ErtisTour },
    { id: "ErtisHome", icon: Home, ...t.modules.ErtisHome },
    { id: "ErtisLaw", icon: Scale, ...t.modules.ErtisLaw },
  ];

  return (
    <div
      className={`min-h-screen bg-slate-50 relative overflow-hidden selection:bg-sky-200 selection:text-sky-900 ${font.className} flex flex-col`}
    >
      
      {/* === 4. PRELOADER (Жүктеу экраны) === */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-sky-500 to-teal-400 transition-all duration-1000 ease-in-out ${
          isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Артқы фондағы әлсіз жарық (Glow effect) */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-sky-500 to-teal-400 rounded-full blur-[100px] animate-pulse"></div>

        {/* Шаңырақ (немесе Домбыра) суреті */}
        <div className="relative w-40 h-40 md:w-56 md:h-56">
           <Image 
             src="/shak.png" 
             alt="Loading..."
             fill
             className="object-contain animate-[spin_10s_linear_infinite]" 
           />
        </div>

        {/* Мәтін */}
        <h1 className="mt-8 text-2xl md:text-3xl font-bold text-white tracking-[0.2em] animate-pulse">
          JANA PAVLODAR
        </h1>
      </div>


      {/* === 1. ГЛОБАЛЬНЫЙ ФОН С ВИДЕО (FULL WIDTH) === */}
      {/* === 1. ВИДЕО ФОН === */}
{/* Изменено: h-[65vh] для мобильных, h-[85vh] для десктопа */}
<div className="absolute top-0 left-0 w-full h-[65vh] md:h-[85vh] overflow-hidden z-0">
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
    poster="https://placehold.co/1920x1080/0f172a/0284c7?text=Jana Pavlodar..."
  >
    <source src="/videoplayback.mp4" type="video/mp4" />
  </video>
  <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/30"></div>

  {/* Градиент внизу: h-20 для мобильных, h-32 для десктопа */}
  <div className="absolute bottom-0 left-0 w-full h-20 md:h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
</div>

{/* === 2. ФОНОВЫЕ ОРНАМЕНТЫ === */}
{/* Изменено: уменьшен размер и скорректирована позиция орнамента для мобильных */}
<div className="absolute top-[-50px] right-[-50px] md:top-[-100px] md:right-[-100px] w-[250px] h-[250px] md:w-[500px] md:h-[500px] z-[5] opacity-20 invert filter drop-shadow-lg pointer-events-none">
  <div className="relative w-full h-full animate-[spin_60s_linear_infinite]">
    <Image
      src="/ornament-circle.png"
      alt="Kazakh Ornament"
      fill
      className="object-contain"
    />
  </div>
</div>

<div
  className="absolute top-[40%] left-0 w-full h-20 md:h-32 z-[5] opacity-[0.07] invert pointer-events-none mix-blend-overlay"
  style={{
    backgroundImage: "url('/ornament-strip.png')",
    backgroundRepeat: "repeat-x",
    backgroundSize: "contain",
    backgroundPosition: "center",
  }}
></div>

{/* === 3. ОСНОВНОЙ КОНТЕНТ === */}
<div className="relative z-10 flex-grow flex flex-col">
  <div className="relative z-50 text-white drop-shadow-md">
    <Header currentLanguage={lang} onLanguageChange={setLang} />
  </div>

  {/* Изменено: отступы pt-24 для мобильных, pt-32 для десктопа */}
  <div className="container mx-auto px-4 pt-14 md:pt-32 pb-8 md:pb-20 text-center relative">
    
    <div className="inline-block mb-4 md:mb-6 px-4 py-1.5 md:px-5 md:py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
      <span className="text-white font-bold tracking-wide uppercase text-xs md:text-sm drop-shadow-sm">
        {t.tag}
      </span>
    </div>

    {/* Изменено: размер шрифта text-3xl (моб) -> text-5xl (планшет) -> text-7xl (ПК) */}
    <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-sky-200">
        Jana Pavlodar
      </span>{" "}
      <span className="block md:inline mt-1 md:mt-0">
        {t.mainTitle.replace("Jana Pavlodar", "").replace("-", "")}
      </span>
    </h2>

    {/* Изменено: размер текста описания и отступы */}
    <p className="text-base sm:text-lg md:text-xl text-slate-100 max-w-3xl mx-auto leading-relaxed font-medium mb-8 md:mb-10 drop-shadow-md px-2">
      {t.mainDesc}
    </p>
  </div>

        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 relative z-20 mt-10">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={`/${module.id}`}>
                <div className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-500 cursor-pointer overflow-hidden h-full flex flex-col">
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/30 rounded-3xl transition-colors duration-500 pointer-events-none" />
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br from-sky-100 to-teal-50 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-out" />

                  <div className="relative flex-grow flex flex-col">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-200 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">
                      {module.title}
                    </h3>

                    <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">
                      {module.subtitle}
                    </p>

                    <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                      {module.desc}
                    </p>

                    <div className="mt-auto">
                      <button className="inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-xl bg-[#eeca00] hover:bg-[#ffd900] shadow-md shadow-amber-200 transform transition-all duration-300 group-hover:translate-x-1">
                        {t.btnOpen}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <footer className="relative bg-slate-900 text-white py-10 mt-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-amber-400 to-teal-500 z-10"></div>
        <div
          className="absolute inset-0 opacity-5 pointer-events-none grayscale"
          style={{
            backgroundImage: "url('/ornament-strip.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "300px",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center gap-4">
          <p className="text-slate-400 font-medium tracking-wide text-center">
            {t.footer}
          </p>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-default group">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
              {t.madeIn}
            </span>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-red-500 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
              <Image
                src="/tulip.png"
                alt="Tulip of Kazakhstan"
                width={24}
                height={24}
                className="relative z-10 w-6 h-6 object-contain"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}