"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header/page"; 
import { supabase } from "../../lib/supabaseClient"; 
import { 
  MapPin, Star, Coffee, Hotel, Navigation, 
  Camera, Search, ArrowRight, X, 
  Sparkles, CheckCircle, Loader2, LayoutGrid, Lock, UserCircle,
  Thermometer 
} from "lucide-react";

// --- TOAST ---
const Toast = ({ message, type = "success" }) => (
  <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn z-50 border ${type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-900 text-white border-amber-500/50'}`}>
    {type === 'success' ? <CheckCircle className="text-amber-400 w-5 h-5" /> : <X className="text-red-500 w-5 h-5" />}
    <span className="font-medium">{message}</span>
  </div>
);

export default function ErtisTour() {
  const router = useRouter();
  const [lang, setLang] = useState("ru");
  const [activeTab, setActiveTab] = useState("all"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRoutesLoading, setIsRoutesLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [user, setUser] = useState(null); 
  const [myRoutes, setMyRoutes] = useState([]); 

  // AI States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const [aiSelection, setAiSelection] = useState([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // --- БАЗА ДАННЫХ ---
  // Добавил точные координаты (lat, lng) для OpenStreetMap
  const staticDb = {
    sights: [
      { id: 1, title: { kz: "Мәшһүр Жүсіп мешіті", ru: "Мечеть Машхур Жусупа", en: "Mashkhur Jusup Mosque" }, desc: { kz: "Бірегей сәулет өнері", ru: "Уникальная архитектура, сердце города", en: "Unique architecture" }, rating: 4.9, image: "/images/mashur.jpg", tags: ["history", "architecture"] },
      { id: 2, title: { kz: "Ертіс жағалауы", ru: "Набережная Иртыша", en: "Irtysh Embankment" }, desc: { kz: "Қазақстандағы ең ұзын жағалау", ru: "Самая длинная набережная", en: "The longest embankment" }, rating: 4.8, image: "/images/nabka.jpg", tags: ["nature", "walking"] },
      { id: 3, title: { kz: "Благовещенск соборы", ru: "Благовещенский собор", en: "Annunciation Cathedral" }, desc: { kz: "Православиелік сәулет", ru: "Памятник православной архитектуры", en: "Orthodox architecture" }, rating: 4.7, image: "/images/sobor.jpg", tags: ["history", "religion"] },
      { id: 4, title: { kz: "Гусиный перелет", ru: "Гусиный перелет", en: "Goose Flight Monument" }, desc: { kz: "Ашық аспан астындағы мұражай", ru: "Музей под открытым небом", en: "Open-air museum" }, rating: 4.6, image: "/images/perelet.jpg", tags: ["history", "nature"] },
      { id: 5, title: { kz: "Батырмол", ru: "Батырмолл", en: "Batyr Mall" }, desc: { kz: "Сауда орталығы", ru: "Торгово-развлекательный центр", en: "Shopping center" }, rating: 4.5, image: "/images/bm.jpg", tags: ["shopping", "relax"] },
    ],
    hotels: [
      { id: 101, title: { kz: "Irtysh Hotel", ru: "Гостиница Иртыш", en: "Irtysh Hotel" }, desc: { kz: "Өзен көрінісі бар қонақ үй", ru: "Гостиница с видом на реку", en: "River view hotel" }, rating: 4.5, image: "/images/hotel.jpg", tags: ["comfort"] },
      { id: 102, title: { kz: "Saryarka", ru: "Сарыарка", en: "Saryarka" }, desc: { kz: "Қала орталығында", ru: "В центре города", en: "City center" }, rating: 4.4, image: "/images/saryarka.jpg", tags: ["business"] },
    ],
    food: [
      { id: 201, title: { kz: "Discovery coffee", ru: "Discovery coffee", en: "Discovery coffee" }, desc: { kz: "Тамак жане кофе", ru: "Еда и кофейня", en: "Food and coffee" }, rating: 4.8, image: "/images/discover.jpg", tags: ["relax", "food"] },
      { id: 202, title: { kz: "RestoBar 7182", ru: "RestoBar 7182", en: "RestoBar 7182" }, desc: { kz: "Еуропалық тағамдар", ru: "Европейская кухня", en: "European cuisine" }, rating: 4.7, image: "/images/restobar.jpg", tags: ["food", "relax"] },
    ],
    // ТЕПЛЫЕ ОСТАНОВКИ (с координатами)
    warmStops: [
        { id: 301, lat: 52.283315, lng: 76.941333, title: { kz: "ЦУМ (Орталық)", ru: "ЦУМ (Центральная)", en: "Central Square" }, desc: { kz: "Wi-Fi, қуаттағыш", ru: "Wi-Fi, зарядка, центр города", en: "Wi-Fi, charging" }, rating: 5.0, image: "/images/cum.jpg", tags: ["wifi", "center"] },
        { id: 302, lat: 52.300263, lng: 76.972509, title: { kz: "Теміржол вокзалы", ru: "Ж/Д Вокзал", en: "Railway Station" }, desc: { kz: "Кең, жылы, орындықтар", ru: "Большая остановка", en: "Big warm stop" }, rating: 4.6, image: "/images/vokzal.jpg", tags: ["transport"] },
        { id: 303, lat: 52.284890, lng: 76.972880, title: { kz: "Малайсары батыр", ru: "Рынок / Ярмарка", en: "Market Stop" }, desc: { kz: "Базар жанында", ru: "Рядом с рынком", en: "Near market" }, rating: 4.3, image: "/images/yarmarka.jpg", tags: ["market"] },
        { id: 304, lat: 52.297195, lng: 76.933698, title: { kz: "Конституция алаңы", ru: "Площадь Конституции", en: "Constitution Square" }, desc: { kz: "Жағалау маңы", ru: "Рядом с набережной", en: "Near embankment" }, rating: 4.7, image: "/images/konsti.jpg", tags: ["center"] },
    ]
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!user?.id) {
        setMyRoutes([]);
        return;
      }
      if (isRoutesLoading) return; 

      setIsRoutesLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_routes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          showToast("Ошибка загрузки данных", "error");
        } else {
          const formattedRoutes = data.map(row => {
            if (!row.route_data) return null; 
            return { ...row.route_data, db_id: row.id };
          }).filter(Boolean);
          setMyRoutes(formattedRoutes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsRoutesLoading(false);
      }
    };
    fetchRoutes();
  }, [user?.id]);
  
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const translations = {
    kz: {
      hero: { title: "Павлодарды ашыңыз", subtitle: "Ертіс өңірінің інжу-маржаны", placeholder: "Іздеу...", btn: "Табу" },
      tabs: { all: "Барлық жерлер", sights: "Көрікті жерлер", hotels: "Қонақ үйлер", food: "Тағамдар", routes: "Маршруттар", warmStops: "Жылы аялдамалар" },
      ai: { title: "AI Гид", desc: "Жеке маршрут құрастырушы", btn: "Маршрут құру", step1: "Не қызықтырады?", step2: "Маршрут құрылуда...", res: "Сіздің маршрутыңыз", save: "Маршрутты сақтау" },
      ui: { map: "Картадан ашу", details: "Толығырақ", loading: "Деректер жүктелуде...", loginReq: "Маршрут құру үшін жүйеге кіріңіз!", loginViewRoutes: "Маршруттарды көру үшін кіріңіз", nothing: "Ештеңе табылмады" },
      interests: { history: "Тарих", nature: "Табиғат", food: "Тағам", art: "Өнер", shopping: "Сауда", relax: "Демалыс" }
    },
    ru: {
      hero: { title: "Откройте Павлодар", subtitle: "Жемчужина Прииртышья", placeholder: "Поиск места...", btn: "Найти" },
      tabs: { all: "Все места", sights: "Достопримечательности", hotels: "Отели", food: "Еда", routes: "Мои Маршруты", warmStops: "Тёплые остановки" },
      ai: { title: "AI Гид", desc: "Персональный конструктор маршрута", btn: "Создать маршрут", step1: "Что вас интересует?", step2: "Генерация маршрута...", res: "Ваш маршрут готов", save: "Сохранить маршрут" },
      ui: { map: "Открыть карту", details: "Подробнее", loading: "Загрузка данных...", loginReq: "Войдите, чтобы создать маршрут!", loginViewRoutes: "Войдите, чтобы увидеть свои маршруты", nothing: "Ничего не найдено" },
      interests: { history: "История", nature: "Природа", food: "Еда", art: "Искусство", shopping: "Шопинг", relax: "Отдых" }
    },
    en: {
      hero: { title: "Discover Pavlodar", subtitle: "The Pearl of the Irtysh", placeholder: "Search places...", btn: "Find" },
      tabs: { all: "All Places", sights: "Attractions", hotels: "Hotels", food: "Food", routes: "My Routes", warmStops: "Warm Stops" },
      ai: { title: "AI Guide", desc: "Personal Route Builder", btn: "Build Route", step1: "Your interests?", step2: "Generating route...", res: "Your Route", save: "Save Route" },
      ui: { map: "Open Map", details: "Details", loading: "Loading data...", loginReq: "Please login to build a route!", loginViewRoutes: "Please login to view your routes", nothing: "Nothing found" },
      interests: { history: "History", nature: "Nature", food: "Food", art: "Art", shopping: "Shopping", relax: "Relax" }
    }
  };

  const t = translations[lang];

  const filteredItems = useMemo(() => {
    let items = [];
    if (activeTab === 'routes') {
      if (!user) return []; 
      items = myRoutes;
    } else if (activeTab === 'all') {
      items = [...staticDb.sights, ...staticDb.hotels, ...staticDb.food];
    } else {
      items = staticDb[activeTab] || [];
    }
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery, lang, myRoutes, user]);

  const handleOpenMap = (item) => {
    const name = item.title?.[lang] || item.title?.ru || "";
    const description = item.desc?.[lang] || "";
    if (!name) return;
    let url = "";
    if (description.includes(" -> ")) {
      const points = description.split(" -> ");
      const pathParams = points.map(p => encodeURIComponent(`Pavlodar ${p.trim()}`)).join("/");
      url = `https://www.google.com/maps/dir/${pathParams}`;
    } else {
      const query = encodeURIComponent(`Pavlodar ${name}`);
      url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    window.open(url, '_blank');
  };

  const handleAiStart = () => {
    if (!user) {
      showToast(t?.ui?.loginReq, "error");
      return;
    }
    setIsAiModalOpen(true);
    setAiStep(1);
    setAiSelection([]);
    setAiResult(null);
  };

  const toggleAiSelection = (tag) => {
    const lowerTag = tag.toLowerCase();
    setAiSelection(prev => 
      prev.includes(lowerTag) ? prev.filter(t => t !== lowerTag) : [...prev, lowerTag]
    );
  };

  const generateMockRoute = () => {
    if (aiSelection.length === 0) {
      showToast(lang === 'kz' ? "Қызығушылықтарды таңдаңыз" : lang === 'ru' ? "Выберите интересы" : "Select interests", "error");
      return;
    }
    setAiStep(2);
    setIsAiGenerating(true);
    setTimeout(() => {
      const allPlaces = [...staticDb.sights, ...staticDb.food, ...staticDb.hotels];
      let matchedPlaces = allPlaces.filter(place => 
        place.tags.some(tag => aiSelection.includes(tag))
      );
      if (matchedPlaces.length < 3) {
        const popular = staticDb.sights.slice(0, 3);
        matchedPlaces = [...new Set([...matchedPlaces, ...popular])];
      }
      const routePoints = matchedPlaces.slice(0, 4).map(place => ({
        title: place.title,
        desc: place.desc,
        originalImage: place.image
      }));
      const routeTitles = {
        kz: `Сіздің ${aiSelection.length > 1 ? 'Арнайы' : ''} Тур`,
        ru: `Ваш ${aiSelection.length > 1 ? 'Особенный' : ''} Тур по Павлодару`,
        en: `Your ${aiSelection.length > 1 ? 'Special' : ''} Pavlodar Tour`
      };
      setAiResult({
        title: routeTitles[lang],
        points: routePoints,
        tags: aiSelection
      });
      setAiStep(3);
      setIsAiGenerating(false);
      showToast(lang === 'kz' ? "Маршрут дайын!" : lang === 'ru' ? "Маршрут готов!" : "Route ready!");
    }, 1500);
  };

  const saveRouteToProfile = async () => {
    if (!aiResult || !user) return;
    const newRouteData = {
      id: Date.now(),
      title: { 
        kz: "Менің AI маршрутым " + new Date().toLocaleDateString(), 
        ru: "Мой AI маршрут " + new Date().toLocaleDateString(), 
        en: "My AI Route " + new Date().toLocaleDateString() 
      },
      desc: {
        kz: aiResult.points.map(p => p.title.kz).join(" -> "),
        ru: aiResult.points.map(p => p.title.ru).join(" -> "),
        en: aiResult.points.map(p => p.title.en).join(" -> ")
      },
      rating: 5.0,
      image: aiResult.points[0].originalImage,
      tags: aiResult.tags
    };

    try {
      const { data, error } = await supabase
        .from('user_routes')
        .insert([{ user_id: user.id, route_data: newRouteData }])
        .select();

      if (error) throw error;
      const savedRoute = { ...newRouteData, db_id: data[0].id };
      setMyRoutes(prev => [savedRoute, ...prev]);
      setIsAiModalOpen(false);
      setActiveTab("routes");
      showToast(lang === 'kz' ? "Сақталды!" : lang === 'ru' ? "Сохранено!" : "Saved!");
    } catch (e) {
      console.error(e);
      showToast("Ошибка сохранения в базу", "error");
    }
  };

  // --- МАГИЯ: ГЕНЕРАЦИЯ HTML ДЛЯ КАРТЫ С МЕТКАМИ ---
  // Мы вставляем Leaflet (OpenStreetMap) напрямую в iframe, чтобы не требовать установки библиотек
  const getMapHtml = () => {
    const stopsJson = JSON.stringify(staticDb.warmStops.map(s => ({
       lat: s.lat, 
       lng: s.lng, 
       name: s.title[lang] || s.title.ru,
       desc: s.desc[lang] || s.desc.ru
    })));

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
          .leaflet-popup-content-wrapper { border-radius: 12px; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Инициализация карты (Павлодар)
          var map = L.map('map').setView([52.287, 76.955], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          // Данные из React
          var stops = ${stopsJson};

          // Красная иконка
          var redIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          // Добавление маркеров
          stops.forEach(function(stop) {
             L.marker([stop.lat, stop.lng], {icon: redIcon})
              .addTo(map)
              .bindPopup("<b>" + stop.name + "</b><br>" + stop.desc);
          });
        </script>
      </body>
      </html>
    `;
  };

  const renderContent = () => {
    // 1. Логин для маршрутов
    if (activeTab === 'routes' && !user) {
      return (
        <div className="col-span-1 md:col-span-3 py-20 flex flex-col items-center justify-center text-center animate-fadeIn">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
             <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {t.ui.loginViewRoutes}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {lang === 'ru' 
              ? "Авторизуйтесь, чтобы создавать, сохранять и просматривать свои уникальные туристические маршруты." 
              : "Please login to create, save and view your unique travel routes."}
          </p>
          <button 
            onClick={() => router.push('/auth')} 
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <UserCircle className="w-6 h-6" />
            <span className="relative z-10">
              {lang === 'ru' ? "Войти / Регистрация" : lang === 'kz' ? "Кіру / Тіркелу" : "Login / Sign Up"}
            </span>
          </button>
        </div>
      );
    }

    // 2. Лоадер
    if (isLoading || (activeTab === 'routes' && isRoutesLoading)) {
       return (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
           {[1,2,3].map(i => (
               <div key={i} className="bg-white h-80 rounded-2xl shadow-sm animate-pulse"></div>
           ))}
         </div>
       );
    }

    // 4. --- КАРТА (OpenStreetMap в iframe) ---
    // Это гарантирует, что метки будут показаны, так как мы их рисуем сами скриптом
    const warmStopsMap = activeTab === 'warmStops' ? (
        <div className="col-span-1 md:col-span-3 mb-10 animate-fadeIn">
            <div className="bg-white p-3 rounded-2xl shadow-lg border border-cyan-100">
                <div className="flex items-center gap-2 mb-3 px-2">
                    <MapPin className="text-red-500 animate-bounce" />
                    <h3 className="font-bold text-gray-700">
                        {lang === 'ru' ? "Карта теплых остановок" : lang === 'kz' ? "Жылы аялдамалар картасы" : "Warm Stops Map"}
                    </h3>
                </div>
                <div className="w-full h-[450px] rounded-xl overflow-hidden relative bg-gray-100 shadow-inner z-0">
                    <iframe 
                        className="w-full h-full border-0"
                        srcDoc={getMapHtml()} 
                        title="Warm Stops Map"
                    />
                </div>
            </div>
        </div>
    ) : null;


    // 3. Если ничего не найдено
    if (filteredItems.length === 0 && activeTab !== 'warmStops') {
      return (
         <div className="col-span-1 md:col-span-3 text-center py-20 opacity-50">
             <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
             <p>{t.ui.nothing}</p>
         </div>
      );
    }

    return (
      <div className="w-full">
         {/* Сначала рисуем карту, если нужно */}
         {warmStopsMap}

         {/* Потом сетку карточек */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn w-full">
            {filteredItems.map((item) => (
                <div key={item.id || item.db_id} className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/40 overflow-hidden hover:shadow-2xl hover:shadow-cyan-100 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full relative">
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/20 rounded-2xl pointer-events-none transition-all"></div>
                    
                    <div className="h-52 overflow-hidden relative">
                        {item.image ? (
                            <img src={item.image} alt="pic" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-teal-50 flex items-center justify-center">
                                <MapPin className="w-12 h-12 text-cyan-300" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" /> {item.rating}
                        </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-cyan-700 transition-colors">
                          {item.title?.[lang] || "Без названия"} 
                        </h3>

                        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                          {item.desc?.[lang] || "Нет описания"}
                        </p>
                        
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {item.tags?.map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                            <button 
                                onClick={() => handleOpenMap(item)}
                                className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-600 font-semibold text-sm hover:bg-white hover:text-cyan-600 hover:shadow-md transition-all flex items-center justify-center gap-2 border border-gray-200"
                            >
                                <MapPin className="w-4 h-4" /> {t.ui.map}
                            </button>
                            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#eeca00] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#eeca00]">
                                →
                            </button>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 selection:bg-cyan-200">
      <Header 
        currentLanguage={lang} 
        onLanguageChange={setLang}
        onBackToHome={() => router.push('/')}
        showBackButton={true}
        onAuthChange={(currentUser) => setUser(currentUser)} 
      />

      {/* --- HERO SECTION --- */}
      <div className="relative h-[450px] w-full overflow-hidden flex items-center justify-center bg-gray-900">
         <div className="absolute inset-0 opacity-70">
            <img 
              src="/images/pvl.jpg" 
              className="w-full h-full object-cover" 
              alt="Pavlodar Hero"
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

         <div className="relative z-10 text-center w-full max-w-3xl px-4 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-400/30 text-cyan-200 text-sm mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Sparkles className="w-4 h-4 text-amber-400" /> 
                <span className="font-semibold tracking-wide">Pavlodar Smart Tourism</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
               {t.hero.title}
            </h1>
            <p className="text-lg text-gray-200 mb-10 font-light max-w-2xl mx-auto">
               {t.hero.subtitle}
            </p>

            {/* SEARCH BAR */}
            <div className="flex bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-2 transform transition-all hover:scale-[1.01] ring-1 ring-cyan-100">
                <div className="flex-1 flex items-center px-4">
                    <Search className="w-5 h-5 text-cyan-500" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.hero.placeholder}
                        className="w-full p-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium"
                    />
                </div>
                <button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/30">
                    {t.hero.btn}
                </button>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
        
        {/* --- AI CARD --- */}
        <div 
          className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-3xl p-1 shadow-2xl mb-12 transform hover:-translate-y-1 transition-transform cursor-pointer group" 
          onClick={handleAiStart}
        >
            <div className="bg-white/10 backdrop-blur-sm rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-400/20 blur-3xl rounded-full"></div>
                
                <div className="flex items-center gap-5 mb-4 md:mb-0 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                            {t.ai.title} <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">New</span>
                        </h2>
                        <p className="text-cyan-50 opacity-90">{t.ai.desc}</p>
                    </div>
                </div>
                
                <button className="px-6 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-cyan-50 transition-colors flex items-center gap-2 shadow-lg z-10">
                    {t.ai.btn} <ArrowRight className="w-4 h-4 text-amber-500" />
                </button>
            </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex overflow-x-auto pb-4 gap-3 mb-8 no-scrollbar">
           {Object.keys(t.tabs).map((key) => {
             const icons = { all: LayoutGrid, sights: Camera, hotels: Hotel, food: Coffee, routes: Navigation, warmStops: Thermometer };
             const Icon = icons[key];
             const isActive = activeTab === key;
             return (
               <button 
                 key={key} 
                 onClick={() => { setActiveTab(key); setSearchQuery(""); }}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 border ${
                   isActive 
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-transparent shadow-lg shadow-cyan-500/20" 
                    : "bg-white text-gray-500 border-gray-100 hover:border-cyan-200 hover:text-cyan-600 hover:bg-cyan-50/50"
                 }`}
               >
                 <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-cyan-500'}`} /> {t.tabs[key]}
               </button>
             )
           })}
        </div>
        {renderContent()}
      </div>
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn relative">
                <button 
                    onClick={() => setIsAiModalOpen(false)} 
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition text-white z-50"
                >
                    <X className="w-5 h-5"/>
                </button>
                <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 blur-3xl rounded-full"></div>
                    <h3 className="text-xl font-bold flex items-center gap-2 relative z-10">
                        <Sparkles className="w-6 h-6 text-amber-300" /> AI Route Builder
                    </h3>
                </div>

                <div className="p-8 min-h-[300px] flex flex-col">
                    {aiStep === 1 && (
                        <>
                            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">{t.ai.step1}</h4>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {['History', 'Nature', 'Food', 'Art', 'Shopping', 'Relax'].map(tag => (
                                    <button 
                                        key={tag}
                                        onClick={() => toggleAiSelection(tag)}
                                        className={`py-3 rounded-xl font-medium text-sm transition-all border ${
                                            aiSelection.includes(tag.toLowerCase()) 
                                            ? "bg-cyan-50 text-cyan-700 border-cyan-200 ring-1 ring-cyan-300" 
                                            : "bg-white text-gray-600 border-gray-100 hover:border-cyan-200 hover:text-cyan-600"
                                        }`}
                                    >
                                        {t.interests[tag.toLowerCase()] || tag}
                                    </button>
                                ))}
                            </div>
                            <button onClick={generateMockRoute} className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold shadow-xl shadow-amber-200 hover:from-amber-500 hover:to-amber-600 transition flex justify-center items-center gap-2">
                                <Sparkles className="w-4 h-4 text-white" /> {t.ai.btn}
                            </button>
                        </>
                    )}

                    {aiStep === 2 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                            <p className="text-lg font-medium text-gray-600 animate-pulse">{t.ai.step2}</p>
                        </div>
                    )}

                    {aiStep === 3 && aiResult && (
                        <div className="animate-fadeIn">
                            <h4 className="text-lg font-bold text-teal-600 mb-1 text-center flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" /> {t.ai.res}
                            </h4>
                            <p className="text-center text-gray-400 text-sm mb-6">{aiResult.title}</p>
                            
                            <div className="space-y-4 relative">
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                                {aiResult.points.map((point, idx) => (
                                    <div key={idx} className="relative flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm z-10 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 text-white flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-800">{point.title[lang]}</div>
                                            <div className="text-xs text-gray-400 line-clamp-1">{point.desc[lang]}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button onClick={saveRouteToProfile} className="mt-8 w-full py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                {t.ai.save}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}