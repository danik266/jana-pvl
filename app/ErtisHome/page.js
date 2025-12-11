"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Camera, CheckCircle, Zap, Droplets, Flame, 
  UploadCloud, RefreshCw, Send, 
  Flashlight, Phone,
  X, MapPin, Star, Clock, User, Scan, ChevronRight, ShieldCheck
} from "lucide-react";
import Header from "../components/Header/page";

// --- СЛОВАРЬ ПЕРЕВОДОВ ---
const translations = {
  ru: {
    back: "Вернуться в меню",
    aiOnline: "Система активна",
    scannerTitle: "Smart Scanner",
    scannerSubtitle: "AI Распознавание",
    pressToScan: "Нажмите для сканирования",
    init: "Инициализация...",
    searching: "Поиск прибора...",
    ocr: "Распознавание...",
    verify: "Верификация...",
    verified: "Данные верифицированы",
    meterId: "ID прибора",
    digitalMeter: "ЦИФРОВОЙ СЧЕТЧИК",
    sendBtn: "Отправить показания",
    sentSuccess: "Данные приняты",
    sentDesc: "Показания будут переданы в ЕРЦ автоматически.",
    servicesTitle: "Сервисы",
    sosTitle: "Служба 109",
    sosDesc: "Единый центр",
    elecTitle: "Электрик",
    elecDesc: "Вызов 24/7",
    plumbTitle: "Сантехник",
    plumbDesc: "Аварийка",
    waiting: "Ожидание данных...",
    waitingDesc: "Загрузите фото счетчика для передачи показаний",
    modalSearch: "Поиск мастера...",
    modalAddress: "Ваш адрес",
    modalAddressPlace: "Улица, дом, квартира...",
    modalCall: "Вызвать мастера",
    modalCall109: "ПОЗВОНИТЬ 109",
    modalArrival: "Прибытие:",
    alertAddr: "Пожалуйста, введите адрес!",
    alertSent: "Мастер выехал!\nАдрес: ",
    alertWait: "\nОжидайте.",
    footerMade: "Сделано в Казахстане",
    footerText: "© 2025 Jana Pavlodar • г. Павлодар • Сделано с ❤️ для жителей",
    
    // Типы счетчиков
    waterLabel: "Холодная вода",
    electroLabel: "Электроэнергия",
    heatLabel: "Теплоснабжение"
  },
  kz: {
    back: "Мәзірге оралу",
    aiOnline: "Жүйе белсенді",
    scannerTitle: "Smart Сканер",
    scannerSubtitle: "AI Анықтау",
    pressToScan: "Сканерлеу үшін басыңыз",
    init: "Іске қосу...",
    searching: "Құрылғыны іздеу...",
    ocr: "Мәтінді тану...",
    verify: "Тексеру...",
    verified: "Деректер расталды",
    meterId: "Құрылғы ID",
    digitalMeter: "ЦИФРЛЫҚ ЕСЕПТЕГІШ",
    sendBtn: "Көрсеткішті жіберу",
    sentSuccess: "Деректер қабылданды",
    sentDesc: "Көрсеткіштер ЕРТО-ға автоматты түрде жіберіледі.",
    servicesTitle: "Қызметтер",
    sosTitle: "109 Қызметі",
    sosDesc: "Бірыңғай орталық",
    elecTitle: "Электрик",
    elecDesc: "Шақыру 24/7",
    plumbTitle: "Сантехник",
    plumbDesc: "Апаттық қызмет",
    waiting: "Деректерді күту...",
    waitingDesc: "Көрсеткіштерді жіберу үшін суретін жүктеңіз",
    modalSearch: "Шебер іздеу...",
    modalAddress: "Сіздің мекенжайыңыз",
    modalAddressPlace: "Көше, үй, пәтер...",
    modalCall: "Шеберді шақыру",
    modalCall109: "109-ҒА ҚОҢЫРАУ",
    modalArrival: "Келу уақыты:",
    alertAddr: "Мекенжайды енгізіңіз!",
    alertSent: "Шебер жолға шықты!\nМекенжай: ",
    alertWait: "\nКүтіңіз.",
    footerMade: "Қазақстанда жасалған",
    footerText: "© 2025 Jana Pavlodar • Павлодар қ. • Тұрғындарға ❤️ жасалған",

    // Типы счетчиков
    waterLabel: "Суық су",
    electroLabel: "Электр энергиясы",
    heatLabel: "Жылу жүйесі"
  },
  en: {
    back: "Back to Menu",
    aiOnline: "System Online",
    scannerTitle: "Smart Scanner",
    scannerSubtitle: "AI Recognition",
    pressToScan: "Tap to scan",
    init: "Initializing...",
    searching: "Searching meter...",
    ocr: "Processing...",
    verify: "Verifying...",
    verified: "Data Verified",
    meterId: "Device ID",
    digitalMeter: "DIGITAL METER",
    sendBtn: "Send Data",
    sentSuccess: "Data Sent",
    sentDesc: "Readings will be automatically sent to the billing center.",
    servicesTitle: "Services",
    sosTitle: "SOS 109",
    sosDesc: "Unified Center",
    elecTitle: "Electrician",
    elecDesc: "24/7 Call",
    plumbTitle: "Plumber",
    plumbDesc: "Emergency",
    waiting: "Waiting for data...",
    waitingDesc: "Upload a photo of the meter to send readings",
    modalSearch: "Searching master...",
    modalAddress: "Your Address",
    modalAddressPlace: "Street, house, flat...",
    modalCall: "Call Master",
    modalCall109: "CALL 109",
    modalArrival: "Arrival:",
    alertAddr: "Please enter your address!",
    alertSent: "Master is on the way!\nAddress: ",
    alertWait: "\nPlease wait.",
    footerMade: "Made in Kazakhstan",
    footerText: "© 2025 Jana Pavlodar • Pavlodar City • Made with ❤️",

    // Типы счетчиков
    waterLabel: "Cold Water",
    electroLabel: "Electricity",
    heatLabel: "Heating"
  }
};

export default function ErtisHome() {
  // 1. СОСТОЯНИЕ ЯЗЫКА (По умолчанию Русский)
  const [lang, setLang] = useState("ru");
  
  // Получаем нужный набор переводов
  const t = translations[lang] || translations.ru;

  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  
  const [isScanning, setIsScanning] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [meterType, setMeterType] = useState("water");
  
  const [isSent, setIsSent] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  // Для модалки
  const [serviceModal, setServiceModal] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [userAddress, setUserAddress] = useState(""); 

  const fileInputRef = useRef(null);

  // Загрузка языка из localStorage при старте
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  // Функция смены языка (передается в Header)
  const handleLanguageChange = (code) => {
    setLang(code);
    localStorage.setItem("lang", code);
  };

  // КОНФИГУРАЦИЯ СЧЕТЧИКОВ (Теперь использует переводы t)
  const meterConfig = {
    water: { 
      label: t.waterLabel, 
      id: "ГВС-1024",
      icon: <Droplets className="w-6 h-6"/>, 
      color: "text-cyan-500", 
      bg: "bg-cyan-50", 
      gradient: "from-cyan-500 to-blue-600",
      digits: 8, decimals: 3
    },
    electro: { 
      label: t.electroLabel, 
      id: "EL-3492",
      icon: <Zap className="w-6 h-6"/>, 
      color: "text-yellow-500", 
      bg: "bg-yellow-50", 
      gradient: "from-yellow-400 to-orange-500",
      digits: 7, decimals: 1
    },
    heat: { 
      label: t.heatLabel, 
      id: "HEAT-991",
      icon: <Flame className="w-6 h-6"/>, 
      color: "text-orange-500", 
      bg: "bg-orange-50", 
      gradient: "from-orange-500 to-red-500",
      digits: 8, decimals: 3
    }
  };

  // --- ЛОГИКА ВЫЗОВА ---
  const callService = (type) => {
    const services = {
      sos: { 
        id: 'sos',
        title: t.sosTitle, 
        color: "text-white", 
        bg: "bg-red-600", 
        icon: <Phone size={28} className="animate-pulse"/>, 
        name: "iKomek 109", 
        rating: "Official", 
        desc: t.sosDesc,
        time: "24/7" 
      },
      electrician: { 
        id: 'master',
        title: t.elecTitle, 
        color: "text-yellow-700", 
        bg: "bg-yellow-400", 
        icon: <Zap size={28}/>, 
        name: "Ержан К.", 
        rating: "4.9", 
        desc: t.elecDesc,
        time: "~15 min" 
      },
      plumber: { 
        id: 'master',
        title: t.plumbTitle, 
        color: "text-blue-700", 
        bg: "bg-blue-400", 
        icon: <Droplets size={28}/>, 
        name: "Андрей С.", 
        rating: "4.8", 
        desc: t.plumbDesc,
        time: "~10 min" 
      },
    };
    
    setActiveService(services[type]);
    setUserAddress(""); 
    
    if (type === 'sos') {
      setServiceModal('found'); 
    } else {
      setServiceModal('searching');
      setTimeout(() => setServiceModal('found'), 2000);
    }
  };

  const closeServiceModal = () => {
    setServiceModal(null);
    setActiveService(null);
  };

  const handleAction = () => {
    if (activeService.id === 'sos') {
      window.location.href = 'tel:109';
      return;
    }

    if(!userAddress) {
      alert(t.alertAddr);
      return;
    }
    alert(`${t.alertSent}${userAddress}${t.alertWait}`);
    closeServiceModal();
  }

  // --- ЛОГИКА СКАНЕРА ---
  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(f));
    setResult("");
    setIsSent(false); 
    setIsScanning(true);
    setStatusText(t.init);

    try {
      setStatusText(t.ocr);
      await new Promise(r => setTimeout(r, 3000));

      let finalNumber = "";
      if (meterType === 'water' || meterType === 'heat') {
          finalNumber = "00237179"; 
      }
      else if (meterType === 'electro') {
          finalNumber = "0192672";
      }

      setResult(finalNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setResult("");
    setIsSent(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = () => setIsSent(true);

  return (
    <>
      <Header 
        currentLanguage={lang}
        onLanguageChange={handleLanguageChange}
        showBackButton={true}
        onBackToHome={() => window.location.href = '/'}
      />
      <div className="min-h-screen bg-[#F8FAFC] selection:bg-sky-200 text-slate-800 font-sans pb-20 relative overflow-x-hidden">
        
        {/* Background Blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-b from-blue-100/50 to-transparent blur-3xl opacity-60"></div>
            <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-t from-cyan-100/40 to-transparent blur-3xl opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-6">
          
          {/* Top Nav */}
          <div className="flex justify-between items-center mb-8">
             <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                   <ChevronRight className="rotate-180 w-5 h-5"/>
                </div>
                <span className="font-semibold tracking-tight">{t.back}</span>
             </Link>
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-600">{t.aiOnline}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            
            {/* LEFT COLUMN: SCANNER */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* SCANNER CARD */}
              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 relative group">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-900 text-white rounded-xl"><Scan size={20} /></div>
                        <div>
                            <h2 className="text-lg font-bold leading-none text-slate-800">{t.scannerTitle}</h2>
                            <p className="text-xs text-slate-400 font-medium mt-1">{t.scannerSubtitle}</p>
                        </div>
                    </div>
                    {/* Meter Type Selector */}
                    <div className="flex gap-1 bg-slate-100 p-1.5 rounded-xl">
                        {Object.entries(meterConfig).map(([key, info]) => (
                            <button 
                                key={key} 
                                onClick={() => { setMeterType(key); handleClear(); }} 
                                className={`p-2 rounded-lg transition-all duration-300 ${meterType === key ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                title={info.label}
                            >
                                {info.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-slate-50">
                    <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-slate-900 shadow-inner group-hover:shadow-2xl transition-all duration-500">
                        {image ? (
                             <div className="relative w-full h-full">
                                <img src={image} className={`w-full h-full object-contain transition-all duration-500 ${isFlashlightOn ? 'brightness-125 sepia-[.2]' : 'opacity-90'}`} />
                                {isScanning && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent w-full h-[20%] animate-scan z-10 blur-sm"></div>
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                                            <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 text-cyan-400 px-6 py-3 rounded-full font-mono text-sm tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-pulse">
                                                {statusText}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="absolute top-4 right-4 z-30 flex flex-col gap-3">
                                     {!isScanning && (
                                        <button onClick={handleClear} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-red-500 transition-colors">
                                            <RefreshCw size={18}/>
                                        </button>
                                     )}
                                     <button onClick={(e) => {e.stopPropagation(); setIsFlashlightOn(!isFlashlightOn)}} className={`w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-all ${isFlashlightOn ? 'bg-yellow-400 text-black shadow-[0_0_20px_#facc15]' : 'bg-black/40 text-white'}`}>
                                        <Flashlight size={18}/>
                                     </button>
                                </div>
                             </div>
                        ) : (
                            <div onClick={() => fileInputRef.current.click()} className="w-full h-full flex flex-col items-center justify-center cursor-pointer group/upload">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 border border-dashed border-slate-600 rounded-2xl animate-[spin_10s_linear_infinite]"></div>
                                    <div className="absolute inset-2 border border-slate-700 rounded-xl"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 group-hover/upload:text-cyan-400 transition-colors">
                                        <UploadCloud size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-400 font-medium group-hover/upload:text-white transition-colors">{t.pressToScan}</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </div>
                </div>
              </div>

              {/* SERVICES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button onClick={() => callService('sos')} className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 rounded-[2rem] p-6 text-white text-left shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Phone size={80}/></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4"><span className="font-bold">109</span></div>
                        <h3 className="font-bold text-lg leading-tight mb-1">{t.sosTitle}</h3>
                        <p className="text-red-100 text-xs opacity-90">{t.sosDesc}</p>
                    </div>
                 </button>
                 <button onClick={() => callService('electrician')} className="relative overflow-hidden bg-white rounded-[2rem] p-6 text-left border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                     <div className="absolute right-4 top-4 text-yellow-500 bg-yellow-50 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Zap size={24}/></div>
                     <div className="mt-12"><h3 className="font-bold text-slate-800 text-lg">{t.elecTitle}</h3><p className="text-slate-400 text-xs mt-1">{t.elecDesc}</p></div>
                 </button>
                 <button onClick={() => callService('plumber')} className="relative overflow-hidden bg-white rounded-[2rem] p-6 text-left border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                     <div className="absolute right-4 top-4 text-cyan-500 bg-cyan-50 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Droplets size={24}/></div>
                     <div className="mt-12"><h3 className="font-bold text-slate-800 text-lg">{t.plumbTitle}</h3><p className="text-slate-400 text-xs mt-1">{t.plumbDesc}</p></div>
                 </button>
              </div>
            </div>

            {/* RIGHT COLUMN: RESULTS */}
            <div className="lg:col-span-4 h-full">
               <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 h-full p-8 flex flex-col relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${meterConfig[meterType].gradient}`}></div>
                  
                  {!result ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                          <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                              <Scan size={32} className="text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-medium text-sm px-8">{t.waitingDesc}</p>
                      </div>
                  ) : (
                      <div className="flex-1 flex flex-col animate-in slide-in-from-bottom duration-500 fade-in">
                          <div className="flex items-start justify-between mb-8">
                             <div>
                                 <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t.meterId}</h3>
                                 <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                                    {meterConfig[meterType].icon}
                                    {meterConfig[meterType].label}
                                 </div>
                                 <p className="text-xs text-slate-400 mt-1">ID: {meterConfig[meterType].id}</p>
                             </div>
                             <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"><ShieldCheck size={24} /></div>
                          </div>

                          {/* --- DIGITAL DISPLAY --- */}
                          <div className="my-auto">
                              <div className="bg-slate-900 rounded-2xl p-6 shadow-inner relative overflow-hidden group">
                                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                                  <p className="text-slate-500 text-[10px] font-mono mb-2 text-right">{t.digitalMeter}</p>
                                  
                                  {/* Контейнер цифр */}
                                  <div className="flex justify-center gap-[2px] sm:gap-1">
                                      {result.split('').map((char, i) => {
                                          const conf = meterConfig[meterType];
                                          const isRed = i >= (conf.digits - conf.decimals);

                                          return (
                                              <div 
                                                  key={i} 
                                                  className={`
                                                    relative flex items-center justify-center 
                                                    text-xl sm:text-2xl md:text-3xl font-mono font-bold 
                                                    w-7 h-10 sm:w-9 sm:h-14 md:w-10 md:h-14 rounded
                                                    shadow-md border-b-2 border-black/30
                                                    ${isRed ? 'bg-red-700 text-red-50' : 'bg-slate-800 text-white'}
                                                  `}
                                              >
                                                  {char}
                                                  {isRed && i === (conf.digits - conf.decimals) && (
                                                      <div className="absolute -left-[3px] sm:-left-1 bottom-1 w-1 h-1 bg-slate-500 rounded-full"></div>
                                                  )}
                                              </div>
                                          );
                                      })}
                                  </div>
                              </div>
                              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                                  <CheckCircle size={12} className="text-emerald-500"/> {t.verified}
                              </p>
                          </div>

                          <div className="mt-auto pt-8">
                              {!isSent ? (
                                  <button onClick={handleSend} className="w-full group relative overflow-hidden bg-slate-900 text-white p-4 rounded-xl font-bold shadow-lg shadow-slate-900/30 hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all">
                                      <span className="relative z-10 flex items-center justify-center gap-2">{t.sendBtn} <Send size={18} className="group-hover:translate-x-1 transition-transform"/></span>
                                  </button>
                              ) : (
                                  <div className="w-full p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-bold flex flex-col items-center justify-center gap-2 animate-in zoom-in">
                                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1"><CheckCircle size={24} /></div>
                                      <span>{t.sentSuccess}</span>
                                  </div>
                              )}
                          </div>
                      </div>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* SERVICE MODAL */}
        {serviceModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeServiceModal}></div>
            <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
              <button onClick={closeServiceModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 z-10 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"><X size={20} /></button>
              <div className="p-8 text-center">
                {serviceModal === 'searching' ? (
                  <div className="py-12">
                      <div className="relative w-32 h-32 mx-auto mb-8">
                          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${activeService.bg.replace('400', '500')}`}></div>
                          <div className="bg-white p-6 rounded-full shadow-lg text-slate-700 relative z-10">{activeService.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{t.modalSearch}</h3>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in duration-300">
                      <div className="flex justify-center mb-6">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${activeService.bg} ${activeService.color} border-4 border-white`}>
                              {activeService.id === 'sos' ? <Phone size={40} className="text-white"/> : <User size={40} className="text-white"/>}
                          </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">{activeService.name}</h3>
                      <p className="text-slate-500 font-medium mb-6">{activeService.title}</p>
                      
                      {activeService.id !== 'sos' && (
                        <div className="text-left mb-6 group">
                           <label className="text-xs font-bold text-slate-400 uppercase ml-3 mb-1.5 block">{t.modalAddress}</label>
                           <div className="relative">
                               <MapPin className="absolute left-4 top-3.5 text-slate-400" size={20} />
                               <input type="text" placeholder={t.modalAddressPlace} value={userAddress} onChange={(e) => setUserAddress(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900" />
                           </div>
                        </div>
                      )}
                      <button onClick={handleAction} className={`w-full py-4 rounded-2xl text-white font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${activeService.id === 'sos' ? 'bg-red-600' : 'bg-slate-900'}`}>
                        {activeService.id === 'sos' ? t.modalCall109 : t.modalCall}
                      </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes scan { 0% { top: 0%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan { animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
      <footer className="relative bg-slate-900 text-white py-10 mt-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-amber-400 to-teal-500"></div>
      
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center gap-4">
          <p className="text-slate-400 font-medium tracking-wide text-center">
            {t.footerText}
          </p>
      
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-default group">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
              {t.footerMade}
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
    </>
  );
}