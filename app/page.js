"use client";

import { useState } from "react";
import { Home, Map, Scale, Construction } from "lucide-react";
import Header from "./components/Header/page"; // Убедитесь, что путь верный
import Link from "next/link";

export default function App() {
  // Состояние для выбранного языка: 'kz', 'ru' или 'en'
  const [lang, setLang] = useState("kz");

  // Словарь переводов
  const translations = {
    kz: {
      tag: "Павлодар қаласының ақылды қала жүйесі",
      mainTitle: "Ертіс - Павлодардың Ақылды Қала Платформасы",
      mainDesc: "Тұрғын үй, туризм, заңгерлік көмек және инфрақұрылымға арналған AI шешімдері.",
      btnOpen: "Ашу",
      footer: "© 2025 Ertis Smart City Platform • Павлодар қаласы • Павлодар тұрғындары үшін ❤️ жасалған",
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
        ErtisRoad: {
          title: "Көлік және жолдар",
          subtitle: "Transportation & Roads",
          desc: "Жол ақауларын анықтау және қауіптілікті бағалау",
        },
      },
    },
    ru: {
      tag: "Система умного города Павлодар",
      mainTitle: "Ertis - Платформа Умного Города",
      mainDesc: "AI решения для ЖКХ, туризма, юридической помощи и городской инфраструктуры.",
      btnOpen: "Открыть",
      footer: "© 2025 Ertis Smart City Platform • г. Павлодар • Сделано с ❤️ для жителей Павлодара",
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
        ErtisRoad: {
          title: "Транспорт и Дороги",
          subtitle: "Transportation & Roads",
          desc: "Обнаружение дефектов дорог и оценка рисков",
        },
      },
    },
    en: {
      tag: "Pavlodar Smart City System",
      mainTitle: "Ertis - Smart City Platform",
      mainDesc: "AI-powered solutions for housing, tourism, legal assistance, and infrastructure.",
      btnOpen: "Open",
      footer: "© 2025 Ertis Smart City Platform • Pavlodar City • Made with ❤️ for Pavlodar residents",
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
        ErtisRoad: {
          title: "Transport & Roads",
          subtitle: "Transportation & Roads",
          desc: "Road defect detection and hazard assessment",
        },
      },
    },
  };

  // Получаем текущие тексты на основе выбранного языка
  const t = translations[lang];

  // Массив модулей с динамическими данными
  const modules = [
    {
      id: "ErtisHome",
      icon: Home,
      ...t.modules.ErtisHome,
    },
    {
      id: "ErtisTour",
      icon: Map,
      ...t.modules.ErtisTour,
    },
    {
      id: "ErtisLaw",
      icon: Scale,
      ...t.modules.ErtisLaw,
    },
    {
      id: "ErtisRoad",
      icon: Construction,
      ...t.modules.ErtisRoad,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      
      {/* Подключаем Header и передаем ему управление языком:
         currentLanguage — текущий язык страницы
         onLanguageChange — функция для смены языка 
      */}
      <Header 
        currentLanguage={lang} 
        onLanguageChange={setLang} 
      />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border-2 border-sky-200">
            <span className="text-sky-700 font-semibold">
              {t.tag}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.mainTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.mainDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={`/${module.id}`}>
                <div className="group relative bg-white rounded-2xl shadow-lg border-2 border-sky-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer text-left h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                  <div className="relative p-8 flex-grow flex flex-col">
                    <div className="inline-flex p-4 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      {module.subtitle}
                    </p>
                    <p className="text-gray-600 mb-6">{module.desc}</p>

                    <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-300 w-fit">
                      {t.btnOpen}
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sky-100">
            {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}