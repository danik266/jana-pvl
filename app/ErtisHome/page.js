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

export default function ErtisHome() {
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

  // КОНФИГУРАЦИЯ СЧЕТЧИКОВ (добавили decimals для красных цифр)
  const meterConfig = {
    water: { 
      label: "Холодная вода", 
      id: "ГВС-1024",
      icon: <Droplets className="w-6 h-6"/>, 
      color: "text-cyan-500", 
      bg: "bg-cyan-50", 
      gradient: "from-cyan-500 to-blue-600",
      digits: 8,     // Всего символов
      decimals: 3    // Последние 3 - красные (литры)
    },
    electro: { 
      label: "Электроэнергия", 
      id: "EL-3492",
      icon: <Zap className="w-6 h-6"/>, 
      color: "text-yellow-500", 
      bg: "bg-yellow-50", 
      gradient: "from-yellow-400 to-orange-500",
      digits: 7,     // Всего символов
      decimals: 1    // Последняя 1 - красная (десятые)
    },
    heat: { 
      label: "Теплоснабжение", 
      id: "HEAT-991",
      icon: <Flame className="w-6 h-6"/>, 
      color: "text-orange-500", 
      bg: "bg-orange-50", 
      gradient: "from-orange-500 to-red-500",
      digits: 8,     // Как у воды
      decimals: 3
    }
  };

  // --- ЛОГИКА ВЫЗОВА ---
  const callService = (type) => {
    const services = {
      sos: { 
        id: 'sos',
        title: "Экстренная служба", 
        color: "text-white", 
        bg: "bg-red-600", 
        icon: <Phone size={28} className="animate-pulse"/>, 
        name: "iKomek 109", 
        rating: "Official", 
        desc: "Единый контакт-центр города",
        time: "Круглосуточно" 
      },
      electrician: { 
        id: 'master',
        title: "Электрик", 
        color: "text-yellow-700", 
        bg: "bg-yellow-400", 
        icon: <Zap size={28}/>, 
        name: "Ержан К.", 
        rating: "4.9", 
        desc: "Мастер 1-й категории",
        time: "Прибытие ~15 мин" 
      },
      plumber: { 
        id: 'master',
        title: "Сантехник", 
        color: "text-blue-700", 
        bg: "bg-blue-400", 
        icon: <Droplets size={28}/>, 
        name: "Андрей С.", 
        rating: "4.8", 
        desc: "Устранение протечек",
        time: "Прибытие ~10 мин" 
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
      alert("Пожалуйста, введите адрес!");
      return;
    }
    alert(`Мастер выехал!\nАдрес: ${userAddress}\nОжидайте.`);
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
    setStatusText("Инициализация камеры...");

    try {
      setStatusText("Поиск прибора учета...");
      await new Promise(r => setTimeout(r, 800));
      setStatusText("Оптическое распознавание...");
      await new Promise(r => setTimeout(r, 1000));
      setStatusText("Верификация данных...");
      await new Promise(r => setTimeout(r, 700));

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
      <Header />
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
                <span className="font-semibold tracking-tight">Меню сервисов</span>
             </Link>
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-600">Система активна</span>
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
                            <h2 className="text-lg font-bold leading-none text-slate-800">Smart Scanner</h2>
                            <p className="text-xs text-slate-400 font-medium mt-1">AI Meter Recognition</p>
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
                                <p className="text-slate-400 font-medium group-hover/upload:text-white transition-colors">Нажмите для сканирования</p>
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
                        <h3 className="font-bold text-lg leading-tight mb-1">iKomek</h3>
                        <p className="text-red-100 text-xs opacity-90">Единый центр</p>
                    </div>
                 </button>
                 <button onClick={() => callService('electrician')} className="relative overflow-hidden bg-white rounded-[2rem] p-6 text-left border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                     <div className="absolute right-4 top-4 text-yellow-500 bg-yellow-50 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Zap size={24}/></div>
                     <div className="mt-12"><h3 className="font-bold text-slate-800 text-lg">Электрик</h3><p className="text-slate-400 text-xs mt-1">Вызов 24/7</p></div>
                 </button>
                 <button onClick={() => callService('plumber')} className="relative overflow-hidden bg-white rounded-[2rem] p-6 text-left border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                     <div className="absolute right-4 top-4 text-cyan-500 bg-cyan-50 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Droplets size={24}/></div>
                     <div className="mt-12"><h3 className="font-bold text-slate-800 text-lg">Сантехник</h3><p className="text-slate-400 text-xs mt-1">Аварийка</p></div>
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
                          <p className="text-slate-400 font-medium text-sm px-8">Сделайте снимок счетчика для получения данных</p>
                      </div>
                  ) : (
                      <div className="flex-1 flex flex-col animate-in slide-in-from-bottom duration-500 fade-in">
                          <div className="flex items-start justify-between mb-8">
                             <div>
                                 <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Прибор учета</h3>
                                 <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                                    {meterConfig[meterType].icon}
                                    {meterConfig[meterType].label}
                                 </div>
                                 <p className="text-xs text-slate-400 mt-1">ID: {meterConfig[meterType].id}</p>
                             </div>
                             <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"><ShieldCheck size={24} /></div>
                          </div>

                          {/* --- DIGITAL DISPLAY (ГЛАВНОЕ ИЗМЕНЕНИЕ) --- */}
                          <div className="my-auto">
                              <div className="bg-slate-900 rounded-2xl p-6 shadow-inner relative overflow-hidden group">
                                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                                  <p className="text-slate-500 text-[10px] font-mono mb-2 text-right">DIGITAL METER</p>
                                  
                                  {/* Контейнер цифр */}
                                  <div className="flex justify-center gap-[2px] sm:gap-1">
                                      {result.split('').map((char, i) => {
                                          const conf = meterConfig[meterType];
                                          // Определяем, является ли цифра "красной" (десятичной/литрами)
                                          // Индекс начала красной зоны = (Длина) - (К-во красных)
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
                                                  {/* Разделитель (запятая) перед первой красной цифрой, если нужно визуально отделить */}
                                                  {isRed && i === (conf.digits - conf.decimals) && (
                                                      <div className="absolute -left-[3px] sm:-left-1 bottom-1 w-1 h-1 bg-slate-500 rounded-full"></div>
                                                  )}
                                              </div>
                                          );
                                      })}
                                  </div>
                              </div>
                              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                                  <CheckCircle size={12} className="text-emerald-500"/> Данные верифицированы
                              </p>
                          </div>
                          {/* ------------------------------------------- */}

                          <div className="mt-auto pt-8">
                              {!isSent ? (
                                  <button onClick={handleSend} className="w-full group relative overflow-hidden bg-slate-900 text-white p-4 rounded-xl font-bold shadow-lg shadow-slate-900/30 hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all">
                                      <span className="relative z-10 flex items-center justify-center gap-2">Отправить показания <Send size={18} className="group-hover:translate-x-1 transition-transform"/></span>
                                  </button>
                              ) : (
                                  <div className="w-full p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-bold flex flex-col items-center justify-center gap-2 animate-in zoom-in">
                                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1"><CheckCircle size={24} /></div>
                                      <span>Данные приняты</span>
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
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Поиск мастера...</h3>
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
                           <label className="text-xs font-bold text-slate-400 uppercase ml-3 mb-1.5 block">Ваш Адрес</label>
                           <div className="relative">
                               <MapPin className="absolute left-4 top-3.5 text-slate-400" size={20} />
                               <input type="text" placeholder="Адрес..." value={userAddress} onChange={(e) => setUserAddress(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900" />
                           </div>
                        </div>
                      )}
                      <button onClick={handleAction} className={`w-full py-4 rounded-2xl text-white font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${activeService.id === 'sos' ? 'bg-red-600' : 'bg-slate-900'}`}>
                        {activeService.id === 'sos' ? 'ПОЗВОНИТЬ 109' : 'Вызвать мастера'}
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
            © 2025 Jana Pavlodar • г. Павлодар • Сделано с ❤️ для жителей Павлодара
          </p>
      
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-default group">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
              Made in Kazakhstan
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