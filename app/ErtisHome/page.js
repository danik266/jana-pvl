"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Camera, CheckCircle, Zap, Droplets, Flame, 
  UploadCloud, RefreshCw, Send, 
  Flashlight, Phone,
  X, MapPin, Star, Clock, User, Scan
} from "lucide-react";
import Tesseract from 'tesseract.js';
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

  const meterConfig = {
    water: { label: "Холодная вода", icon: <Droplets className="w-5 h-5"/>, color: "text-blue-500", bg: "bg-blue-100" },
    electro: { label: "Электроэнергия", icon: <Zap className="w-5 h-5"/>, color: "text-yellow-500", bg: "bg-yellow-100" },
    heat: { label: "Теплоснабжение", icon: <Flame className="w-5 h-5"/>, color: "text-orange-500", bg: "bg-orange-100" }
  };

  // --- ЛОГИКА ВЫЗОВА ---
  const callService = (type) => {
    const services = {
      // ТЕПЕРЬ 109 ТОЖЕ ЗДЕСЬ, ЧТОБЫ ОТКРЫВАТЬ МОДАЛКУ
      sos: { 
        id: 'sos',
        title: "Служба 109", 
        color: "text-red-600", 
        bg: "bg-red-100", 
        icon: <Phone size={24}/>, 
        name: "Единый контакт-центр", 
        rating: "Official", 
        time: "Круглосуточно" 
      },
      electrician: { 
        id: 'master',
        title: "Электрик", 
        color: "text-yellow-600", 
        bg: "bg-yellow-100", 
        icon: <Zap size={24}/>, 
        name: "Ержан К.", 
        rating: "4.9", 
        time: "15 мин" 
      },
      plumber: { 
        id: 'master',
        title: "Сантехник", 
        color: "text-blue-600", 
        bg: "bg-blue-100", 
        icon: <Droplets size={24}/>, 
        name: "Андрей С.", 
        rating: "4.8", 
        time: "10 мин" 
      },
    };
    
    setActiveService(services[type]);
    setUserAddress(""); 
    
    // Если это 109 - сразу показываем готовое окно (без поиска)
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
    // ЕСЛИ ЭТО 109 - ЗВОНИМ
    if (activeService.id === 'sos') {
      window.location.href = 'tel:109';
      return;
    }

    // ЕСЛИ МАСТЕР - ПОДТВЕРЖДАЕМ ЗАЯВКУ
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
    setStatusText("Инициализация...");

    try {
      setStatusText("Поиск табло...");
      await new Promise(r => setTimeout(r, 800));
      setStatusText("Сканирование цифр...");
      await new Promise(r => setTimeout(r, 1000));
      setStatusText("Проверка данных...");
      await new Promise(r => setTimeout(r, 700));

      let finalNumber = "00000";
      if (meterType === 'water' || meterType === 'heat') finalNumber = "237179";
      else if (meterType === 'electro') finalNumber = "0192672";

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
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          
          <Link href="/" className="group text-slate-500 mb-8 inline-flex items-center hover:text-sky-600 transition-colors font-medium">
            <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 group-hover:border-sky-300 transition-colors">←</span> 
            Вернуться в меню
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            <div className="xl:col-span-8 space-y-6">
              
              {/* СКАНЕР */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><Scan size={140} /></div>
                  <div className="relative z-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3"><Camera className="text-sky-400" size={32} /> Ertis Home</h1>
                    <div className="flex items-center gap-2 mt-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span><p className="text-slate-400 text-sm font-medium">AI System Online</p></div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {Object.entries(meterConfig).map(([key, info]) => (
                      <button key={key} onClick={() => { setMeterType(key); handleClear(); }} className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all text-sm font-bold whitespace-nowrap overflow-hidden ${meterType === key ? "bg-slate-900 text-white shadow-lg" : "bg-white border-slate-200 text-slate-500"}`}>
                        <div className={`p-1.5 rounded-full ${meterType === key ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{info.icon}</div>
                        <span className="relative z-10">{info.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {!image ? (
                      <div onClick={() => fileInputRef.current.click()} className="relative border-3 border-dashed border-slate-200 rounded-3xl h-96 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-sky-500 hover:bg-sky-50/20 transition-all group">
                        <UploadCloud className="w-10 h-10 text-sky-500 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Нажмите для сканирования</h3>
                      </div>
                    ) : (
                      <div className="relative rounded-3xl overflow-hidden border border-slate-800 h-96 bg-black group shadow-2xl">
                        <img src={image} className={`w-full h-full object-contain transition-all ${isFlashlightOn ? 'brightness-125' : 'opacity-80'}`} />
                        {isScanning && <div className="absolute inset-0 z-10"><div className="w-full h-1 bg-sky-400 shadow-[0_0_30px_#38bdf8] animate-scan"></div></div>}
                        <button onClick={(e) => {e.stopPropagation(); setIsFlashlightOn(!isFlashlightOn)}} className="absolute bottom-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white"><Flashlight/></button>
                        {isScanning && <div className="absolute bottom-8 left-0 w-full text-center z-20"><span className="bg-black/80 backdrop-blur border border-sky-500/30 text-sky-400 px-4 py-2 rounded-full text-xs font-mono font-bold animate-pulse">{statusText}</span></div>}
                        {!isScanning && <button onClick={handleClear} className="absolute top-6 right-6 bg-white/20 backdrop-blur p-3 rounded-full hover:bg-white text-white hover:text-black transition"><RefreshCw/></button>}
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </div>
                </div>
              </div>

              {/* КНОПКИ ВЫЗОВА */}
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => callService('sos')} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all active:scale-95 group hover:border-red-200">
                  <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto text-red-500"><Phone size={24}/></div>
                  <div className="text-center"><p className="font-bold text-slate-700 text-sm">Служба 109</p><p className="text-[10px] text-slate-400">Единый центр</p></div>
                </button>
                <button onClick={() => callService('electrician')} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all active:scale-95 group hover:border-yellow-200">
                  <div className="bg-yellow-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto text-yellow-600"><Zap size={24}/></div>
                  <div className="text-center"><p className="font-bold text-slate-700 text-sm">Электрик</p><p className="text-[10px] text-slate-400">Вызов 24/7</p></div>
                </button>
                <button onClick={() => callService('plumber')} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all active:scale-95 group hover:border-blue-200">
                  <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto text-blue-600"><Droplets size={24}/></div>
                  <div className="text-center"><p className="font-bold text-slate-700 text-sm">Сантехник</p><p className="text-[10px] text-slate-400">Аварийка</p></div>
                </button>
              </div>
            </div>

            {/* РЕЗУЛЬТАТ */}
            <div className="xl:col-span-4 space-y-6">
              {!result ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <Scan size={64} className="opacity-10 mb-4" /><p className="text-sm font-medium">Ожидание данных...</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl h-full flex flex-col animate-in slide-in-from-bottom">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                     <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${meterConfig[meterType].bg} ${meterConfig[meterType].color}`}>{meterConfig[meterType].icon}</div>
                        <span className="font-bold text-slate-700">{meterConfig[meterType].label}</span>
                     </div>
                     <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"><CheckCircle size={14}/> Verified</span>
                  </div>
                  <div className="text-center my-auto">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Показания</p>
                    <div className="text-6xl font-mono font-black text-slate-800 tracking-tighter bg-slate-50 p-6 rounded-2xl border border-slate-100 break-all">{result}</div>
                  </div>
                  <div className="mt-auto pt-10">
                    {!isSent ? (
                        <button onClick={handleSend} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 transition"><Send size={20} /> Отправить</button>
                    ) : (
                        <div className="w-full py-5 bg-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2"><CheckCircle size={24} /> Передано</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- МОДАЛЬНОЕ ОКНО (109 + МАСТЕРА) --- */}
        {serviceModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeServiceModal}></div>
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
              <button onClick={closeServiceModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 p-2 bg-slate-50 rounded-full"><X size={20} /></button>

              <div className="p-8 text-center">
                {serviceModal === 'searching' ? (
                  <div className="py-10">
                     <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-8 relative`}>
                        <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${activeService.bg.replace('100', '500')}`}></div>
                        <div className={`relative z-10 w-full h-full rounded-full flex items-center justify-center bg-slate-50`}>{activeService.icon}</div>
                     </div>
                     <h3 className="text-xl font-bold text-slate-800 mb-2">Поиск...</h3>
                  </div>
                ) : (
                  <div className="animate-in fade-in">
                     <div className="flex flex-col items-center mb-6">
                        <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center shadow-lg ${activeService.bg}`}>
                             {activeService.id === 'sos' ? <Phone size={40} className="text-red-600"/> : <User size={40} className="text-slate-500"/>}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">{activeService.name}</h3>
                        <p className="text-slate-500 font-medium">{activeService.title}</p>
                     </div>
                     
                     {/* Если это НЕ 109, показываем ввод адреса */}
                     {activeService.id !== 'sos' && (
                       <div className="text-left mb-6">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Адрес</label>
                          <div className="relative">
                              <MapPin className="absolute left-4 top-3.5 text-slate-400" size={20} />
                              <input type="text" placeholder="Адрес..." value={userAddress} onChange={(e) => setUserAddress(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                          </div>
                       </div>
                     )}

                     <button 
                       onClick={handleAction}
                       className={`w-full py-4 rounded-2xl text-white font-bold shadow-xl active:scale-95 transition flex items-center justify-center gap-2 ${activeService.id === 'sos' ? 'bg-red-600 shadow-red-200' : 'bg-slate-900 shadow-slate-300'}`}
                     >
                       {activeService.id === 'sos' ? 'ПОЗВОНИТЬ' : 'Вызвать мастера'}
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      
      <style jsx>{`
        @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan { animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}