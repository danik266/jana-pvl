"use client";

import { useState } from "react";
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
      modules: {
        ErtisHome: {
          title: "Үй және ТКШ",
          subtitle: "Housing & Utilities",
          desc: "AI есептеуіш оқырманы және квитанция талдауы",
        },
        ErtisTour: {
          title: "Туризм және гид",
          subtitle: "Tourism & City Guide",
          desc: "Көрікті жерлер картасы, қонақ үйлер және маршруттар",
        },
        ErtisLaw: {
          title: "Цифрлық заңгер",
          subtitle: "Digital Lawyer",
          desc: "Шағымдар мен өтініштер генераторы",
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
        "AI решения для ЖКХ, туризма, юридической помощи и городской инфраструктуры.",
      btnOpen: "Открыть",
      footer:
        "© 2025 Jana Pavlodar • г. Павлодар • Сделано с ❤️ для жителей Павлодара",
      madeIn: "Made In Kazakhstan",
      modules: {
        ErtisHome: {
          title: "ЖКХ и Услуги",
          subtitle: "Housing & Utilities",
          desc: "AI считыватель счетчиков и анализ квитанций",
        },
        ErtisTour: {
          title: "Туризм и Гид",
          subtitle: "Tourism & City Guide",
          desc: "Карта достопримечательностей, отели и маршруты",
        },
        ErtisLaw: {
          title: "Цифровой Юрист",
          subtitle: "Digital Lawyer",
          desc: "Генератор жалоб и заявлений",
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
      modules: {
        ErtisHome: {
          title: "Housing & Utilities",
          subtitle: "Housing & Utilities",
          desc: "AI meter reader and receipt analysis",
        },
        ErtisTour: {
          title: "Tourism & Guide",
          subtitle: "Tourism & City Guide",
          desc: "Sights map, hotels, and tourist routes",
        },
        ErtisLaw: {
          title: "Digital Lawyer",
          subtitle: "Digital Lawyer",
          desc: "Complaint and application generator",
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
    { id: "ErtisHome", icon: Home, ...t.modules.ErtisHome },
    { id: "ErtisTour", icon: Map, ...t.modules.ErtisTour },
    { id: "ErtisLaw", icon: Scale, ...t.modules.ErtisLaw },
    { id: "ErtisAI", icon: Bot, ...t.modules.ErtisAI },
  ];

  return (
    <div
      className={`min-h-screen bg-slate-50 relative overflow-hidden selection:bg-sky-200 selection:text-sky-900 ${font.className} flex flex-col`}
    >
      {/* Фоновые фигуры */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-amber-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex-grow">
        <Header currentLanguage={lang} onLanguageChange={setLang} />

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center mb-16">
          <div className="inline-block mb-6 px-5 py-2 bg-white/70 backdrop-blur-md rounded-full border border-sky-200 shadow-sm">
            <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent font-bold tracking-wide uppercase text-sm">
              {t.tag}
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-teal-400 to-sky-500">
              Jana Pavlodar
            </span>{" "}
            <span className="text-slate-800">
              - {t.mainTitle.replace("Jana Pavlodar -", "")}
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {t.mainDesc}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={`/${module.id}`}>
                <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 cursor-pointer overflow-hidden h-full flex flex-col">
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-300/50 rounded-3xl transition-colors duration-500 pointer-events-none" />
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-sky-100 to-teal-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out" />

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
                      <button className="inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-md shadow-amber-200 transform transition-all duration-300 group-hover:translate-x-1">
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

      {/* Footer */}
      <footer className="relative bg-slate-900 text-white py-10 mt-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-amber-400 to-teal-500"></div>
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
