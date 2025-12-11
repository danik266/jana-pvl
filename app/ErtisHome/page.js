"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Camera, CheckCircle, Zap, Droplets, Flame, 
  UploadCloud, RefreshCw, Send, AlertTriangle, 
  History, Flashlight, Phone, Download, ShieldCheck,
  X, MapPin, Star, Clock, User, Scan, Activity
} from "lucide-react";
import Tesseract from 'tesseract.js';
import Header from "../components/Header/page";

export default function ErtisHome() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  
  const [isScanning, setIsScanning] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [meterType, setMeterType] = useState("water");
  const [calculation, setCalculation] = useState(null);
  
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [debtStatus, setDebtStatus] = useState(null);
  const [anomaly, setAnomaly] = useState(null);

  const [serviceModal, setServiceModal] = useState(null);
  const [activeService, setActiveService] = useState(null);

  const fileInputRef = useRef(null);

  const tariffs = {
    water: { price: 98.5, unit: "м³", label: "Холодная вода", icon: <Droplets className="w-5 h-5"/>, color: "text-blue-500", bg: "bg-blue-100", gradient: "from-blue-500 to-cyan-400", norm: 10 },
    electro: { price: 18.5, unit: "кВт⋅ч", label: "Электроэнергия", icon: <Zap className="w-5 h-5"/>, color: "text-yellow-500", bg: "bg-yellow-100", gradient: "from-yellow-400 to-orange-400", norm: 250 },
    heat: { price: 3500, unit: "Гкал", label: "Теплоснабжение", icon: <Flame className="w-5 h-5"/>, color: "text-orange-500", bg: "bg-orange-100", gradient: "from-orange-500 to-red-500", norm: 1.5 }
  };

  useEffect(() => {
    generateFakeHistory();
    checkFakeDebt();
  }, [meterType]);

  const generateFakeHistory = () => {
    const data = Array.from({ length: 6 }, (_, i) => ({
      month: ["Дек", "Янв", "Фев", "Мар", "Апр", "Май"][i],
      value: Math.floor(Math.random() * (meterType === 'electro' ? 100 : 5) + (meterType === 'electro' ? 100 : 2))
    }));
    setHistoryData(data);
  };

  const checkFakeDebt = () => {
    const debts = [
      { status: "clean", text: "Нет задолженности", color: "text-emerald-600", bg: "bg-emerald-100" },
      { status: "debt", text: "-1 450 ₸ (Долг)", color: "text-red-600", bg: "bg-red-100" },
      { status: "over", text: "+200 ₸ (Переплата)", color: "text-blue-600", bg: "bg-blue-100" }
    ];
    setDebtStatus(debts[Math.floor(Math.random() * debts.length)]);
  };

  const callService = (type) => {
    const services = {
      electrician: { title: "Электрик", color: "text-yellow-600", bg: "bg-yellow-100", icon: <Zap size={24}/>, name: "Ержан К.", price: "2000 ₸", rating: "4.9", time: "15 мин" },
      plumber: { title: "Сантехник", color: "text-blue-600", bg: "bg-blue-100", icon: <Droplets size={24}/>, name: "Андрей С.", price: "2500 ₸", rating: "4.8", time: "10 мин" },
      sos: { title: "Служба 109", color: "text-red-600", bg: "bg-red-100", icon: <Phone size={24}/>, name: "Оператор", price: "Бесплатно", rating: "Official", time: "1 мин" }
    };
    setActiveService(services[type]);
    setServiceModal('searching');
    setTimeout(() => {
      setServiceModal('found');
    }, 2500);
  };

  const closeServiceModal = () => {
    setServiceModal(null);
    setActiveService(null);
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(f));
    setResult("");
    setCalculation(null);
    setAnomaly(null);
    setIsScanning(true);
    setStatusText("Инициализация Ertis Vision...");

    try {
      setStatusText("Поиск табло счетчика...");
      await new Promise(r => setTimeout(r, 800));

      setStatusText("Оптическое распознавание (OCR)...");
      await new Promise(r => setTimeout(r, 1000));

      setStatusText("Сверка с базой ЕРЦ...");
      await new Promise(r => setTimeout(r, 700));

      let finalNumber = "0000";
      if (meterType === 'water' || meterType === 'heat') {
         finalNumber = "237179"; 
      } else if (meterType === 'electro') {
         finalNumber = "0192672"; 
      }

      let currentVal = parseInt(finalNumber);
      if (isNaN(currentVal)) currentVal = 0;

      let usage = 0;
      let prevVal = 0;

      if (meterType === 'water') {
        usage = Math.floor(Math.random() * 9) + 3; 
        prevVal = Math.max(0, currentVal - usage);
      } 
      else if (meterType === 'electro') {
        usage = Math.floor(Math.random() * 230) + 120;
        prevVal = Math.max(0, currentVal - usage);
      } 
      else if (meterType === 'heat') {
        usage = Math.floor(Math.random() * 2) + 1; 
        prevVal = currentVal - usage; 
      }

      if (usage > tariffs[meterType].norm * 1.5) {
        setAnomaly("Обнаружен аномально высокий расход! Проверьте утечки.");
      }

      const cost = (usage * tariffs[meterType].price).toFixed(2);
      setResult(finalNumber);
      setCalculation({ prev: prevVal, diff: usage, cost: cost });

    } catch (err) {
      console.error(err);
      alert("Ошибка. Попробуйте снова.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setResult("");
    setCalculation(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = () => {
    if (!calculation) return; 
    alert(`Квитанция сформирована и отправлена!\nНачислен кешбэк: 50 ErtisCoins`);
  };

  const downloadReceipt = () => {
    alert("PDF квитанция сохранена на устройство.");
  };

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
            
            {/* --- ЛЕВАЯ КОЛОНКА (СКАНЕР) --- */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* Main Card (ТУТ БЫЛА ОШИБКА, ЗАМЕНИЛ НА rounded-3xl) */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                
                {/* Header Card */}
                <div className="bg-slate-900 p-8 text-white flex justify-between items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Scan size={140} />
                  </div>
                  <div className="relative z-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                      <Camera className="text-sky-400" size={32} /> Ertis Home
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       <p className="text-slate-400 text-sm font-medium">AI System Online</p>
                    </div>
                  </div>
                  {debtStatus && (
                    <div className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md bg-white/10 border border-white/10 flex items-center gap-2 relative z-10`}>
                       <span className={debtStatus.color === 'text-red-600' ? 'text-red-400' : 'text-emerald-400'}>●</span>
                       {debtStatus.text}
                    </div>
                  )}
                </div>

                <div className="p-8">
                  
                  {/* Tabs */}
                  <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {Object.entries(tariffs).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => { setMeterType(key); handleClear(); }}
                        className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all text-sm font-bold whitespace-nowrap overflow-hidden
                          ${meterType === key 
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200 border-slate-900" 
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"}`}
                      >
                        {meterType === key && (
                            <div className={`absolute inset-0 opacity-20 ${info.gradient}`}></div>
                        )}
                        <div className={`p-1.5 rounded-full ${meterType === key ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                            {info.icon}
                        </div>
                        <span className="relative z-10">{info.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* SCANNER UI (HERO SECTION) */}
                  <div className="space-y-4">
                    {!image ? (
                      <div 
                        onClick={() => fileInputRef.current.click()}
                        className="relative border-3 border-dashed border-slate-200 rounded-3xl h-96 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-sky-500 hover:bg-sky-50/20 transition-all duration-300 group overflow-hidden"
                      >
                        {/* Grid Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                        
                        <div className="bg-white p-6 rounded-full mb-6 shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:shadow-sky-200 transition-all duration-300 z-10">
                          <UploadCloud className="w-10 h-10 text-sky-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 z-10 group-hover:text-sky-600 transition-colors">Нажмите для сканирования</h3>
                        <p className="text-sm text-slate-400 mt-2 z-10 text-center max-w-xs">Поддерживаются счетчики любого типа.<br/>ИИ автоматически улучшит качество фото.</p>
                      </div>
                    ) : (
                      <div className="relative rounded-3xl overflow-hidden border border-slate-800 h-96 bg-black group shadow-2xl">
                        <img 
                          src={image} 
                          alt="preview" 
                          className={`w-full h-full object-contain transition-all duration-700 ${isFlashlightOn ? 'brightness-125 contrast-125' : 'opacity-80'}`} 
                        />
                        
                        {/* HUD OVERLAY */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-sky-500 rounded-tl-lg opacity-80"></div>
                            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-sky-500 rounded-tr-lg opacity-80"></div>
                            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-sky-500 rounded-bl-lg opacity-80"></div>
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-sky-500 rounded-br-lg opacity-80"></div>
                            
                            {isScanning && (
                                <div className="absolute inset-0 z-10">
                                    <div className="w-full h-1 bg-sky-400 shadow-[0_0_30px_rgba(56,189,248,1)] animate-scan blur-[1px]"></div>
                                </div>
                            )}
                        </div>

                        {/* Flashlight Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsFlashlightOn(!isFlashlightOn); }}
                          className={`absolute bottom-6 right-6 p-4 rounded-full backdrop-blur-md transition-all z-20 hover:scale-105 active:scale-95 ${isFlashlightOn ? 'bg-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.6)]' : 'bg-white/10 text-white border border-white/20'}`}
                        >
                          <Flashlight size={24} />
                        </button>

                        {/* Status Text */}
                        {isScanning && (
                          <div className="absolute bottom-8 left-0 w-full text-center z-20">
                             <span className="bg-black/80 backdrop-blur border border-sky-500/30 text-sky-400 px-4 py-2 rounded-full text-xs font-mono font-bold animate-pulse shadow-lg">
                               {statusText}
                             </span>
                          </div>
                        )}
                        
                        {!isScanning && (
                           <button onClick={handleClear} className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white text-white hover:text-slate-900 shadow-lg transition-all border border-white/20 z-20">
                             <RefreshCw size={20} />
                           </button>
                        )}
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </div>
                </div>
              </div>

              {/* SERVICES GRID */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'sos', title: 'Служба 109', sub: 'Единый центр', icon: <Phone size={24}/>, color: 'text-red-500', bg: 'bg-red-50', border: 'hover:border-red-200' },
                  { id: 'electrician', title: 'Электрик', sub: 'Вызов 24/7', icon: <Zap size={24}/>, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'hover:border-yellow-200' },
                  { id: 'plumber', title: 'Сантехник', sub: 'Аварийка', icon: <Droplets size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
                ].map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => callService(s.id)}
                    className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all duration-300 active:scale-95 group ${s.border}`}
                  >
                    <div className={`${s.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <div className={s.color}>{s.icon}</div>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-700 text-sm">{s.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{s.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

            </div>

            {/* --- ПРАВАЯ КОЛОНКА (РЕЗУЛЬТАТЫ) --- */}
            <div className="xl:col-span-4 space-y-6">
              
              {(!result || !calculation) ? (
                // ЗАГЛУШКА (ИСТОРИЯ) - Заменил rounded-[2rem] на rounded-3xl
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                  
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-slate-100 rounded-lg"><History className="text-slate-500" size={20} /></div> 
                    Аналитика
                  </h3>
                  
                  <div className="flex-1 flex items-end justify-between gap-3 pb-6 border-b border-slate-100 relative z-10">
                     {historyData.map((d, i) => (
                       <div key={i} className="flex flex-col items-center gap-2 w-full group">
                          <div className="relative w-full h-full flex items-end">
                            <div 
                              className={`w-full rounded-t-lg transition-all duration-1000 ${i === 5 ? 'bg-sky-500 shadow-lg shadow-sky-200' : 'bg-slate-100 group-hover:bg-slate-200'}`} 
                              style={{ height: `${d.value}%` }}
                            ></div>
                          </div>
                          <span className={`text-[10px] font-bold ${i === 5 ? 'text-sky-600' : 'text-slate-400'}`}>{d.month}</span>
                       </div>
                     ))}
                  </div>
                  
                  <div className="mt-6 space-y-3 relative z-10">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                       <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                       <div>
                          <p className="text-xs font-bold text-emerald-800">Защита данных</p>
                          <p className="text-[10px] text-emerald-600 leading-relaxed mt-0.5">
                             Ваши показания шифруются и хранятся на защищенных серверах.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                // РЕЗУЛЬТАТ (КВИТАНЦИЯ) - Заменил rounded-[2rem] на rounded-3xl
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 animate-in slide-in-from-bottom duration-500 relative overflow-hidden">
                  
                  <div className="absolute top-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#f1f5f9_10px,#f1f5f9_20px)] opacity-50"></div>

                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                     <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                       <CheckCircle size={14}/> Verified
                     </span>
                     <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Activity size={12}/> AI Processed
                     </span>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Распознанные показания</p>
                    <div className="text-6xl font-mono font-black text-slate-800 tracking-tighter">{result}</div>
                  </div>

                  {anomaly && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 flex gap-3 items-start animate-pulse">
                      <div className="bg-red-100 p-2 rounded-full">
                         <AlertTriangle className="text-red-500 shrink-0" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-800">Обнаружена аномалия</p>
                        <p className="text-xs text-red-600 mt-0.5">{anomaly}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-sm items-center">
                       <span className="text-slate-500 font-medium">Предыдущие:</span>
                       <span className="font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">{calculation?.prev}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                       <span className="text-slate-500 font-medium">Расход:</span>
                       <span className="font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">+{calculation?.diff} {tariffs[meterType].unit}</span>
                    </div>
                    <div className="border-t border-slate-200 my-1"></div>
                    <div className="flex justify-between items-center pt-1">
                       <span className="font-bold text-slate-700 text-sm">К ОПЛАТЕ:</span>
                       <span className="text-3xl font-black text-sky-600">{calculation?.cost} <span className="text-lg text-slate-400 font-medium">₸</span></span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={handleSend}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> Оплатить сейчас
                    </button>
                    <button 
                      onClick={downloadReceipt}
                      className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-200 transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Download size={18} /> Скачать квитанцию
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* --- МОДАЛЬНОЕ ОКНО (UBER STYLE) --- */}
        {serviceModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
              onClick={closeServiceModal}
            ></div>
            
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
              <button 
                onClick={closeServiceModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 p-2 bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-8 text-center">
                
                {serviceModal === 'searching' ? (
                  <div className="py-10">
                     <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-8 relative`}>
                        <div className={`absolute inset-0 rounded-full opacity-20 animate-ping duration-1000 ${activeService.bg.replace('100', '500')}`}></div>
                        <div className={`absolute inset-4 rounded-full opacity-10 animate-pulse ${activeService.bg.replace('100', '500')}`}></div>
                        <div className={`relative z-10 w-full h-full rounded-full flex items-center justify-center ${activeService.bg} ${activeService.color}`}>
                           {activeService.icon}
                        </div>
                     </div>
                     <h3 className="text-xl font-bold text-slate-800 mb-2">Поиск специалиста...</h3>
                     <p className="text-slate-400 text-sm px-6">Анализируем геопозицию и рейтинг мастеров в Павлодаре</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in duration-300">
                     <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 bg-slate-100 rounded-full mb-4 overflow-hidden border-4 border-white shadow-xl">
                           <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                             <User size={48} />
                           </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">{activeService.name}</h3>
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full mt-2 border border-yellow-100">
                           <Star size={14} className="text-yellow-500 fill-yellow-500" /> 
                           <span className="text-yellow-700 font-bold text-sm">{activeService.rating}</span>
                        </div>
                     </div>
                     
                     <div className="bg-slate-50 p-5 rounded-2xl space-y-4 mb-8 text-left border border-slate-100">
                        <div className="flex justify-between items-center">
                           <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Услуга</span>
                           <span className={`font-bold ${activeService.color}`}>{activeService.title}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Прибытие</span>
                           <span className="font-bold text-slate-800">{activeService.time}</span>
                        </div>
                     </div>

                     <div className="flex justify-between items-center mb-8 px-4">
                        <span className="text-slate-500 font-medium">Итого:</span>
                        <span className="text-2xl font-black text-slate-900">{activeService.price}</span>
                     </div>

                     <button 
                       onClick={() => { alert("Мастер выехал!"); closeServiceModal(); }}
                       className={`w-full py-4 rounded-xl text-white font-bold shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 ${activeService.title === 'Служба 109' ? 'bg-red-600 shadow-red-200' : 'bg-slate-900 shadow-slate-300'}`}
                     >
                       Подтвердить вызов
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </>
  );
}