"use client";

import { Home, Shield, Scale, Construction } from "lucide-react";
import Header from "./components/Header/page";
import Link from "next/link";

export default function App() {
  const modules = [
    {
      id: "ErtisHome",
      title: "Үй және коммуналдық қызметтер",
      subtitle: "Housing & Utilities",
      description: "AI есептеуіш оқырманы және квитанция талдауы",
      icon: Home,
    },
    {
      id: "ErtisSafe",
      title: "Маусымдық қауіпсіздік",
      subtitle: "Seasonal Safety",
      description: "Мошқалар картасы және мұз қауіпінің ескертуі",
      icon: Shield,
    },
    {
      id: "ErtisLaw",
      title: "Цифрлық заңгер",
      subtitle: "Digital Lawyer",
      description: "Шағымдар мен өтініштер генераторы",
      icon: Scale,
    },
    {
      id: "ErtisRoad",
      title: "Көлік және жолдар",
      subtitle: "Transportation & Roads",
      description: "Жол ақауларын анықтау және қауіптілікті бағалау",
      icon: Construction,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border-2 border-sky-200">
            <span className="text-sky-700 font-semibold">
              Павлодар қаласының ақылды қала жүйесі
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ертіс - Павлодардың Ақылды Қала Платформасы
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart City Platform for Pavlodar: AI-powered solutions for housing,
            safety, legal assistance, and infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={`/${module.id}`}>
                <div className="group relative bg-white rounded-2xl shadow-lg border-2 border-sky-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer text-left">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                  <div className="relative p-8">
                    <div className="inline-flex p-4 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      {module.subtitle}
                    </p>
                    <p className="text-gray-600">{module.description}</p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-300">
                      Ашу / Open
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

      <footer className="bg-[#419181] text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">
            © 2025 Ertis Smart City Platform • Павлодар қаласы • Сделано с ❤️
            для жителей Павлодара
          </p>
        </div>
      </footer>
    </div>
  );
}
