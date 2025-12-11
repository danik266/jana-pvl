"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Camera, UploadCloud, RefreshCw, Send, 
  MapPin, AlertTriangle, Trash2, Siren, 
  ThermometerSnowflake, Hammer, CheckCircle, Navigation,
  Trees, ScanLine, ArrowLeft, Loader2
} from "lucide-react";
import Header from "../components/Header/page"; 

export default function ErtisInspector() {
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState(null);
  const [address, setAddress] = useState("");
  const [isSent, setIsSent] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(f));
    setResult(null);
    setIsSent(false);
    setAddress(""); 
    setIsScanning(true);
    setStatusText("Инициализация нейросети...");

    // Имитация этапов анализа
    setTimeout(() => setStatusText("Поиск объектов..."), 1000);
    setTimeout(() => setStatusText("Сверка с базой нарушений..."), 2200);
    setTimeout(() => setStatusText("Формирование отчета..."), 3000);

    setTimeout(() => {
      const name = f.name.toLowerCase();
      let fakeData = {};

      // ЛОГИКА ОПРЕДЕЛЕНИЯ (по названию файла)
      if (name.includes("luk") || name.includes("manhole")) {
        fakeData = {
          title: "Открытый люк",
          dangerLabel: "КРИТИЧЕСКАЯ",
          dangerLevel: 3, // 1-Low, 2-Med, 3-High
          desc: "Отсутствие крышки инженерного колодца. Прямая угроза жизни и здоровью граждан.",
          harm: "Высокий риск падения, ДТП, травматизма.",
          icon: <Siren size={28} className="text-white"/>,
          color: "bg-rose-600",
          bgLight: "bg-rose-50",
          border: "border-rose-200",
          text: "text-rose-700"
        };
      } 
      else if (name.includes("trash") || name.includes("musor")) {
        fakeData = {
          title: "Стихийная свалка",
          dangerLabel: "СРЕДНЯЯ",
          dangerLevel: 2,
          desc: "Несанкционированное складирование ТБО вне отведенных мест.",
          harm: "Ухудшение экологии, антисанитария, пожароопасность.",
          icon: <Trash2 size={28} className="text-white"/>,
          color: "bg-orange-500",
          bgLight: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700"
        };
      }
      else if (name.includes("tree") || name.includes("derevo")) {
        fakeData = {
          title: "Аварийное дерево",
          dangerLabel: "ВЫСОКАЯ",
          dangerLevel: 2,
          desc: "Сухостой, наклон более 45 градусов или надломленные ветви.",
          harm: "Угроза падения на ЛЭП, автомобили и пешеходов.",
          icon: <Trees size={28} className="text-white"/>,
          color: "bg-emerald-600",
          bgLight: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-800"
        };
      }
      else if (name.includes("ice") || name.includes("snow")) {
        fakeData = {
          title: "Наледь / Сосульки",
          dangerLabel: "ВЫСОКАЯ",
          dangerLevel: 3,
          desc: "Неочищенная кровля или тротуар. Нарушение правил благоустройства.",
          harm: "Травматизм пешеходов, повреждение имущества.",
          icon: <ThermometerSnowflake size={28} className="text-white"/>,
          color: "bg-sky-500",
          bgLight: "bg-sky-50",
          border: "border-sky-200",
          text: "text-sky-700"
        };
      }
      else {
        // Дефолт - Яма
        fakeData = {
          title: "Дефект дорожного полотна",
          dangerLabel: "ВЫСОКАЯ",
          dangerLevel: 2,
          desc: "Выбоина/яма превышающая допустимые нормативы ГОСТ.",
          harm: "Аварийные ситуации, повреждение ходовой части авто.",
          icon: <AlertTriangle size={28} className="text-white"/>,
          color: "bg-zinc-800",
          bgLight: "bg-zinc-100",
          border: "border-zinc-300",
          text: "text-zinc-900"
        };
      }

      setResult(fakeData);
      setIsScanning(false);
    }, 3500);
  };

  const handleClear = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendReport = () => {
    if (!address) {
      alert("Пожалуйста, уточните адрес проблемы.");
      return;
    }
    setIsSent(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans selection:bg-blue-100">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb Navigation */}
          <Link 
            href="/" 
            className="group text-neutral-500 mb-8 inline-flex items-center text-sm font-medium hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Вернуться на главную
          </Link>

          <div className="grid md:grid-cols-12 gap-8">
            
            {/* --- ЛЕВАЯ КОЛОНКА: ЗАГРУЗЧИК --- */}
            <div className="md:col-span-5 flex flex-col gap-4">
               {/* Title Card */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <ScanLine size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900">AI Inspector</h1>
                 </div>
                 <p className="text-neutral-500 text-sm leading-relaxed">
                   Загрузите фото городской проблемы. Нейросеть классифицирует нарушение и подготовит отчет.
                 </p>
              </div>

              {/* Upload Zone */}
              <div className="relative group">
                {!image ? (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="relative bg-white border-2 border-dashed border-neutral-300 rounded-3xl h-[400px] flex flex-col items-center justify-center text-neutral-400 cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20"></div>
                    
                    <div className="bg-neutral-100 p-6 rounded-full mb-5 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
                      <Camera size={42} className="text-neutral-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800">Сделать фото</h3>
                    <p className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-wide">Или выбрать из галереи</p>
                  </div>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden border border-neutral-800 h-[400px] bg-black shadow-2xl">
                    <img 
                      src={image} 
                      alt="preview" 
                      className="w-full h-full object-cover opacity-60" 
                    />
                    
                    {/* HUD Elements (Computer Vision Style) */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/50 rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/50 rounded-br-lg"></div>

                    {/* Scanning Animation */}
                    {isScanning && (
                        <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none">
                          <div className="w-full h-[2px] bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)] animate-scan"></div>
                          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent h-12 animate-scan-trail"></div>
                        </div>
                    )}

                    {/* Status Text */}
                    {isScanning ? (
                      <div className="absolute bottom-8 left-0 w-full flex justify-center z-20">
                          <div className="bg-black/70 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-3">
                            <Loader2 size={14} className="animate-spin text-red-500"/>
                            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest animate-pulse">
                              {statusText}
                            </span>
                          </div>
                      </div>
                    ) : (
                       <button 
                        onClick={handleClear} 
                        className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2.5 rounded-xl hover:bg-white text-white hover:text-black transition-all border border-white/10 z-20 group/btn"
                        title="Сбросить"
                       >
                         <RefreshCw size={18} className="group-hover/btn:rotate-180 transition-transform duration-500"/>
                       </button>
                    )}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>
            </div>

            {/* --- ПРАВАЯ КОЛОНКА: РЕЗУЛЬТАТ --- */}
            <div className="md:col-span-7">
              {!result && !image && (
                <div className="h-full flex items-center justify-center p-10 border-2 border-dashed border-neutral-200 rounded-3xl bg-white/50 text-neutral-400 text-center">
                  <div>
                    <UploadCloud size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Ожидание загрузки изображения...</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
                  {/* Header Result */}
                  <div className="p-8 pb-6 border-b border-neutral-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${result.color}`}>
                          {result.icon}
                        </div>
                        <div>
                          <p className="text-xs font-mono text-neutral-400 uppercase mb-1 tracking-wider">Объект обнаружен</p>
                          <h2 className="text-2xl font-bold text-neutral-900 leading-none">{result.title}</h2>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-xl border flex flex-col items-end ${result.bgLight} ${result.border}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${result.text}`}>Угроза</span>
                        <span className={`text-sm font-bold ${result.text}`}>{result.dangerLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-6">
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-2">
                         <span className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                           <ScanLine size={12}/> Анализ дефекта
                         </span>
                         <p className="text-neutral-700 text-sm font-medium leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                           {result.desc}
                         </p>
                      </div>
                      <div className="space-y-2">
                         <span className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                           <AlertTriangle size={12}/> Потенциальный вред
                         </span>
                         <p className={`text-sm font-medium leading-relaxed p-3 rounded-xl border bg-white ${result.text} ${result.border}`}>
                           {result.harm}
                         </p>
                      </div>
                    </div>

                    <div className="w-full h-px bg-neutral-100 mb-8"></div>

                    {/* Action Area */}
                    {!isSent ? (
                      <div className="space-y-5 animate-in fade-in">
                        <div>
                           <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block pl-1">Подтвердите адрес</label>
                           <div className="relative group focus-within:ring-2 ring-blue-500/20 rounded-xl transition-all">
                              <MapPin className="absolute left-4 top-3.5 text-neutral-400 group-focus-within:text-blue-600 transition-colors" size={20}/>
                              
                              <input 
                                type="text" 
                                placeholder="Улица, дом или ориентир..." 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-neutral-400"
                              />
                              
                              <button className="absolute right-2 top-2 p-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm" title="Геолокация">
                                 <Navigation size={18} />
                              </button>
                           </div>
                        </div>

                        <button 
                          onClick={handleSendReport}
                          className="w-full py-4 bg-neutral-900 hover:bg-black text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                          <span>Отправить отчет</span>
                          <Send size={18} className="text-neutral-400"/>
                        </button>
                        <p className="text-center text-xs text-neutral-400">Данные будут отправлены в ситуационный центр 109</p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 text-center animate-in zoom-in duration-300">
                         <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
                            <CheckCircle size={40} />
                         </div>
                         <h3 className="text-xl font-bold text-emerald-900 mb-2">Отчет принят</h3>
                         <div className="text-emerald-700 text-sm space-y-1">
                            <p>Заявка № <span className="font-mono font-bold">REQ-{Math.floor(Math.random() * 9000) + 1000}</span> сформирована.</p>
                            <p>Статус можно отследить в личном кабинете.</p>
                         </div>
                         <button 
                            onClick={handleClear}
                            className="mt-6 text-sm font-bold text-emerald-700 hover:text-emerald-900 underline decoration-dashed underline-offset-4"
                         >
                            Отправить еще одну заявку
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        

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