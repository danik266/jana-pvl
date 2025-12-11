"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header/page"; 
import { 
  MapPin, Star, Coffee, Hotel, Navigation, 
  Camera, Search, Clock, ArrowRight, X, 
  Sparkles, CheckCircle, Loader2, Heart 
} from "lucide-react";

// --- КОМПОНЕНТ УВЕДОМЛЕНИЙ (TOAST) ---
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-slideIn z-50">
    <CheckCircle className="text-green-400 w-5 h-5" />
    <span>{message}</span>
  </div>
);

export default function ErtisTour() {
  const router = useRouter();
  const [lang, setLang] = useState("kz");
  const [activeTab, setActiveTab] = useState("sights");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Состояния для AI Модалки
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const [aiSelection, setAiSelection] = useState([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Имитация загрузки данных при старте
  useEffect(() => {
    // Используем useEffect для предотвращения конфликтов гидратации с random/time
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Управление уведомлениями
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- БАЗА ДАННЫХ ---
  const content = {
    kz: {
      hero: { title: "Павлодарды ашыңыз", subtitle: "Ертіс өңірінің інжу-маржаны", placeholder: "Іздеу...", btn: "Табу" },
      tabs: { sights: "Көрікті жерлер", hotels: "Қонақ үйлер", food: "Тағамдар", routes: "Маршруттар" },
      ai: { title: "AI Гид", desc: "Жеке маршрут құрастырушы", btn: "Маршрут құру", step1: "Не қызықтырады?", step2: "Күту...", res: "Сіздің маршрутыңыз" },
      ui: { map: "Картадан ашу", details: "Толығырақ", loading: "Деректер жүктелуде..." }
    },
    ru: {
      hero: { title: "Откройте Павлодар", subtitle: "Жемчужина Прииртышья", placeholder: "Поиск места...", btn: "Найти" },
      tabs: { sights: "Достопримечательности", hotels: "Отели", food: "Еда", routes: "Маршруты" },
      ai: { title: "AI Гид", desc: "Персональный конструктор маршрута", btn: "Создать маршрут", step1: "Что вас интересует?", step2: "Генерация...", res: "Ваш маршрут готов" },
      ui: { map: "Открыть карту", details: "Подробнее", loading: "Загрузка данных..." }
    },
    en: {
      hero: { title: "Discover Pavlodar", subtitle: "The Pearl of the Irtysh", placeholder: "Search places...", btn: "Find" },
      tabs: { sights: "Attractions", hotels: "Hotels", food: "Food", routes: "Routes" },
      ai: { title: "AI Guide", desc: "Personal Route Builder", btn: "Build Route", step1: "Your interests?", step2: "Generating...", res: "Your Route" },
      ui: { map: "Open Map", details: "Details", loading: "Loading data..." }
    }
  };

  const db = {
    sights: [
      { id: 1, title: { kz: "Мәшһүр Жүсіп мешіті", ru: "Мечеть Машхур Жусупа", en: "Mashkhur Jusup Mosque" }, desc: { kz: "Бірегей сәулет өнері", ru: "Уникальная архитектура", en: "Unique architecture" }, rating: 4.9, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Pavlodar_Mosque.jpg/1200px-Pavlodar_Mosque.jpg", tags: ["history", "architecture"] },
      { id: 2, title: { kz: "Ертіс жағалауы", ru: "Набережная Иртыша", en: "Irtysh Embankment" }, desc: { kz: "Серуендеу орны", ru: "Место для прогулок", en: "Walking area" }, rating: 4.8, image: "https://pavlodar.city/wp-content/uploads/2023/05/naberezhnaya-pavlodara.jpg", tags: ["nature", "relax"] },
      { id: 3, title: { kz: "Благовещенск соборы", ru: "Благовещенский собор", en: "Annunciation Cathedral" }, desc: { kz: "Православиелік ғибадатхана", ru: "Православный храм", en: "Orthodox temple" }, rating: 4.7, image: "https://img.tourister.ru/files/3/9/4/5/7/7/5/clons/3945775.jpg", tags: ["history", "religion"] },
      { id: 4, title: { kz: "Гусиный перелет", ru: "Гусиный перелет", en: "Goose Flight Monument" }, desc: { kz: "Палеонтологиялық ескерткіш", ru: "Палеонтологический памятник", en: "Paleontological monument" }, rating: 4.6, image: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Goose_flight.jpg", tags: ["history", "nature"] },
    ],
    hotels: [
      { id: 101, title: { kz: "Irtysh Hotel", ru: "Гостиница Иртыш", en: "Irtysh Hotel" }, desc: { kz: "Өзен көрінісі", ru: "Вид на реку", en: "River view" }, rating: 4.5, image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/46782357.jpg?k=5c325c3898146740685b02131584050962357912061262624646875704123568&o=&hp=1", tags: ["comfort"] },
      { id: 102, title: { kz: "Saryarka", ru: "Сарыарка", en: "Saryarka" }, desc: { kz: "Қала орталығы", ru: "Центр города", en: "City center" }, rating: 4.4, image: "https://q-hotel.kz/wp-content/uploads/2023/04/Saryarka.jpg", tags: ["business"] },
    ],
    food: [
      { id: 201, title: { kz: "Кәмпит", ru: "Кәмпит", en: "Kampit" }, desc: { kz: "Кофейня", ru: "Кофейня", en: "Coffee shop" }, rating: 4.8, image: "https://lh3.googleusercontent.com/p/AF1QipN3-v-y-s-x-z-w-q-r-t-y-u-i-o-p", tags: ["chill"] },
      { id: 202, title: { kz: "Baiga", ru: "Baiga", en: "Baiga" }, desc: { kz: "Мейрамхана", ru: "Ресторан", en: "Restaurant" }, rating: 4.6, image: "https://lh3.googleusercontent.com/p/AF1QipM-a-s-d-f-g-h-j-k-l", tags: ["national"] },
    ],
    routes: [
      { id: 301, title: { kz: "Тарихи жол", ru: "Исторический путь", en: "Historical Way" }, desc: { kz: "2 сағаттық тур", ru: "2-х часовой тур", en: "2 hour tour" }, rating: 5.0, image: null, tags: ["walking"] },
    ]
  };

  const t = content[lang];

  // --- ЛОГИКА ---

  // 1. Фильтрация и поиск
  const filteredItems = useMemo(() => {
    const items = db[activeTab] || [];
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery, lang]);

  // 2. Открытие карты
  const handleOpenMap = (placeName) => {
    const query = encodeURIComponent(`Pavlodar ${placeName}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    showToast(`${placeName} - карта ашылуда...`);
  };

  // 3. AI Генератор
  const handleAiStart = () => {
    setIsAiModalOpen(true);
    setAiStep(1);
    setAiSelection([]);
    setAiResult(null);
  };

  const toggleAiSelection = (tag) => {
    setAiSelection(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const generateAiRoute = () => {
    if (aiSelection.length === 0) {
      showToast("Кем дегенде бір қызығушылықты таңдаңыз / Выберите интерес");
      return;
    }
    setAiStep(2);
    setIsAiGenerating(true);
    
    // Имитация процесса
    setTimeout(() => {
      setIsAiGenerating(false);
      setAiStep(3);
      setAiResult({
        title: lang === 'ru' ? "Маршрут: Культурный код" : "Маршрут: Мәдени код",
        points: [
          db.sights[0], // Мечеть
          db.food[0],   // Кофе
          db.sights[1]  // Набережная
        ]
      });
      showToast("Маршрут сәтті құрылды! / Маршрут построен!");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      <Header 
        currentLanguage={lang} 
        onLanguageChange={setLang} 
        showBackButton={true} 
        onBackToHome={() => router.push('/')}
      />

      {/* --- HERO SECTION --- */}
      <div className="relative h-[400px] w-full overflow-hidden flex items-center justify-center bg-gray-900">
         <div className="absolute inset-0 opacity-60">
            <img 
              src="https://tengrinews.kz/userdata/news/2021/news-445892/thumb_m/photo_366128.jpeg" 
              className="w-full h-full object-cover" 
              alt="Pavlodar Hero"
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

         <div className="relative z-10 text-center w-full max-w-3xl px-4 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-sm mb-4 backdrop-blur-md">
                <Sparkles className="w-3 h-3" /> Pavlodar Smart Tourism
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
               {t.hero.title}
            </h1>
            <p className="text-lg text-gray-200 mb-8 font-light">
               {t.hero.subtitle}
            </p>

            {/* SUPER SEARCH BAR */}
            <div className="flex bg-white rounded-2xl shadow-2xl p-2 transform transition-all hover:scale-[1.02]">
                <div className="flex-1 flex items-center px-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.hero.placeholder}
                        className="w-full p-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium"
                    />
                </div>
                <button className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/30">
                    {t.hero.btn}
                </button>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-20">
        
        {/* --- AI CARD --- */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-1 shadow-2xl mb-12 transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={handleAiStart}>
            <div className="bg-gray-900/10 backdrop-blur-sm rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white border border-white/10">
                <div className="flex items-center gap-5 mb-4 md:mb-0">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur shadow-inner">
                        <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-1">{t.ai.title}</h2>
                        <p className="text-indigo-100 opacity-90">{t.ai.desc}</p>
                    </div>
                </div>
                <button className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg">
                    {t.ai.btn} <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex overflow-x-auto pb-4 gap-3 mb-6 no-scrollbar">
           {Object.keys(t.tabs).map((key) => {
             const icons = { sights: Camera, hotels: Hotel, food: Coffee, routes: Navigation };
             const Icon = icons[key];
             return (
               <button 
                 key={key} 
                 onClick={() => { setActiveTab(key); setSearchQuery(""); }}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 border ${
                   activeTab === key 
                    ? "bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/20" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                 }`}
               >
                 <Icon className="w-4 h-4" /> {t.tabs[key]}
               </button>
             )
           })}
        </div>

        {/* --- CONTENT GRID --- */}
        {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="bg-white h-80 rounded-2xl shadow-sm animate-pulse bg-gray-200"></div>
                ))}
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {filteredItems.length > 0 ? filteredItems.map((item) => (
                    <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                        <div className="h-52 overflow-hidden relative">
                             {item.image ? (
                                <img src={item.image} alt="pic" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             ) : (
                                <div className="w-full h-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                                    <MapPin className="w-12 h-12 text-sky-300" />
                                </div>
                             )}
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500" /> {item.rating}
                             </div>
                             <button className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-red-500 hover:text-white text-white transition-colors">
                                <Heart className="w-4 h-4" />
                             </button>
                        </div>
                        
                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title[lang]}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.desc[lang]}</p>
                            
                            <div className="flex gap-2 mb-6">
                                {item.tags?.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                                <button 
                                    onClick={() => handleOpenMap(item.title[lang])}
                                    className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                                >
                                    <MapPin className="w-4 h-4" /> {t.ui.map}
                                </button>
                                <button className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-sm hover:bg-sky-500 transition-shadow shadow-lg shadow-sky-200">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-3 text-center py-20 opacity-50">
                        <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Ештеңе табылмады / Ничего не найдено</p>
                    </div>
                )}
            </div>
        )}

      </div>

      {/* --- MODAL AI WIZARD --- */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn relative">
                <button onClick={() => setIsAiModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5 text-gray-500"/></button>
                
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-300" /> AI Route Builder
                    </h3>
                </div>

                <div className="p-8 min-h-[300px] flex flex-col">
                    {aiStep === 1 && (
                        <>
                            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">{t.ai.step1}</h4>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {['History', 'Nature', 'Food', 'Art', 'Shopping', 'Extreme'].map(tag => (
                                    <button 
                                        key={tag}
                                        onClick={() => toggleAiSelection(tag)}
                                        className={`py-3 rounded-xl font-medium text-sm transition-all ${
                                            aiSelection.includes(tag) 
                                            ? "bg-violet-100 text-violet-700 ring-2 ring-violet-500" 
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <button onClick={generateAiRoute} className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold shadow-xl shadow-violet-200 hover:bg-violet-700 transition">
                                {t.ai.btn}
                            </button>
                        </>
                    )}

                    {aiStep === 2 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
                            <p className="text-lg font-medium text-gray-600 animate-pulse">{t.ai.step2}</p>
                            <p className="text-xs text-gray-400 mt-2">Analyzing {aiSelection.join(", ")}...</p>
                        </div>
                    )}

                    {aiStep === 3 && aiResult && (
                        <div className="animate-fadeIn">
                            <h4 className="text-lg font-bold text-green-600 mb-1 text-center flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" /> {t.ai.res}
                            </h4>
                            <p className="text-center text-gray-500 text-sm mb-6">{aiResult.title}</p>
                            
                            <div className="space-y-4 relative">
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                {aiResult.points.map((point, idx) => (
                                    <div key={idx} className="relative flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm z-10">
                                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-800">{point.title[lang]}</div>
                                            <div className="text-xs text-gray-400">{point.desc[lang]}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button onClick={() => { setIsAiModalOpen(false); showToast("Сақталды / Сохранено"); }} className="mt-8 w-full py-3 bg-gray-900 text-white rounded-xl font-bold">
                                OK
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}