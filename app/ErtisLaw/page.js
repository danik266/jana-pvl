"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  Camera, UploadCloud, RefreshCw, Send, 
  MapPin, AlertTriangle, Trash2, Siren, 
  ThermometerSnowflake, Hammer, CheckCircle, Navigation,
  Trees // Добавил иконку дерева
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
    setStatusText("Анализ изображения...");

    setTimeout(() => setStatusText("Классификация объекта..."), 2000);
    setTimeout(() => setStatusText("Оценка степени опасности..."), 2000);

    setTimeout(() => {
      const name = f.name.toLowerCase();
      let fakeData = {};

      // 1. ОТКРЫТЫЙ ЛЮК (Файл: luk.jpg)
      if (name.includes("luk") || name.includes("manhole")) {
        fakeData = {
          title: "Открытый колодец",
          danger: "КРИТИЧЕСКАЯ",
          desc: "Отсутствует крышка инженерного колодца. Прямая угроза жизни.",
          harm: "Травматизм пешеходов, падение в шахту, повреждение авто.",
          icon: <Siren size={32} className="text-white"/>,
          color: "bg-red-600",
          border: "border-red-200",
          text: "text-red-700"
        };
      } 
      // 2. МУСОР (Файл: musor.jpg)
      else if (name.includes("trash") || name.includes("musor")) {
        fakeData = {
          title: "Стихийная свалка",
          danger: "СРЕДНЯЯ",
          desc: "Накопление ТБО в неустановленном месте. Нарушение правил благоустройства.",
          harm: "Антисанитария, запах, привлечение грызунов.",
          icon: <Trash2 size={32} className="text-white"/>,
          color: "bg-orange-500",
          border: "border-orange-200",
          text: "text-orange-700"
        };
      }
      // 3. ДЕРЕВО / ВЕТКИ (Файл: derevo.jpg) -> НОВОЕ!
      else if (name.includes("tree") || name.includes("derevo")) {
        fakeData = {
          title: "Аварийное дерево",
          danger: "ВЫСОКАЯ",
          desc: "Сухостой или упавшая крупная ветка. Угроза обрыва проводов.",
          harm: "Падение на людей/авто, обрыв линий электропередач.",
          icon: <Trees size={32} className="text-white"/>,
          color: "bg-green-600",
          border: "border-green-200",
          text: "text-green-800"
        };
      }
      // 4. ГОЛОЛЕД (Файл: ice.jpg)
      else if (name.includes("ice") || name.includes("snow")) {
        fakeData = {
          title: "Гололед / Сосульки",
          danger: "ВЫСОКАЯ",
          desc: "Обледенение тротуара или нависание льда с кровли.",
          harm: "Риск падения пешеходов, травмы головы от сосулек.",
          icon: <ThermometerSnowflake size={32} className="text-white"/>,
          color: "bg-blue-500",
          border: "border-blue-200",
          text: "text-blue-700"
        };
      }
      // 5. ЯМА (Любой другой файл)
      else {
        fakeData = {
          title: "Дорожная яма",
          danger: "ВЫСОКАЯ",
          desc: "Разрушение асфальта. Глубина превышает нормы ГОСТ (более 5 см).",
          harm: "Аварийная ситуация, пробитие колес, повреждение подвески.",
          icon: <AlertTriangle size={32} className="text-white"/>,
          color: "bg-slate-800",
          border: "border-slate-300",
          text: "text-slate-900"
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
      alert("Пожалуйста, укажите адрес!");
      return;
    }
    setIsSent(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
        <div className="max-w-3xl mx-auto">
          
          <Link href="/" className="group text-slate-500 mb-6 inline-flex items-center hover:text-sky-600 transition-colors font-medium">
            <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 group-hover:border-sky-300 transition-colors">←</span> 
            Назад в меню
          </Link>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Hammer className="text-red-500" /> Ertis Inspector
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Модуль анализа городской среды
              </p>
            </div>

            <div className="p-6 md:p-8">
              
              {/* --- ЗОНА ЗАГРУЗКИ --- */}
              <div className="space-y-6">
                {!image ? (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="relative border-3 border-dashed border-slate-200 rounded-3xl h-80 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-red-400 hover:bg-red-50/10 transition-all group overflow-hidden"
                  >
                    <div className="bg-slate-100 p-5 rounded-full mb-4 group-hover:scale-110 transition shadow-lg">
                      <Camera size={40} className="text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Нажмите для фото</h3>
                    <p className="text-sm mt-2 opacity-70">Ямы, люки, мусор, гололед</p>
                  </div>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden border border-slate-800 h-80 bg-black group shadow-2xl">
                    <img 
                      src={image} 
                      alt="preview" 
                      className="w-full h-full object-cover opacity-80" 
                    />
                    
                    {/* Сканирующий эффект */}
                    {isScanning && (
                       <div className="absolute inset-0 z-10 flex flex-col justify-center">
                          <div className="w-full h-1 bg-red-500 shadow-[0_0_30px_red] animate-scan"></div>
                       </div>
                    )}

                    {isScanning ? (
                      <div className="absolute bottom-6 left-0 w-full text-center z-20">
                         <span className="bg-black/80 backdrop-blur border border-red-500/50 text-red-400 px-4 py-2 rounded-full text-xs font-mono font-bold animate-pulse">
                           {statusText}
                         </span>
                      </div>
                    ) : (
                       <button onClick={handleClear} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white text-white hover:text-black transition z-20">
                         <RefreshCw size={20} />
                       </button>
                    )}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>

              {/* --- РЕЗУЛЬТАТ АНАЛИЗА --- */}
              {result && (
                <div className="mt-8 animate-in slide-in-from-bottom duration-500">
                  <div className={`rounded-3xl border-2 overflow-hidden ${result.border}`}>
                    
                    {/* Заголовок проблемы */}
                    <div className={`${result.color} p-6 flex items-center gap-4 text-white`}>
                       <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                          {result.icon}
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">Объект распознан</p>
                          <h2 className="text-2xl font-bold">{result.title}</h2>
                       </div>
                       <div className="ml-auto bg-white/20 px-3 py-1 rounded-lg text-xs font-bold border border-white/30 text-center">
                          УГРОЗА:<br/>{result.danger}
                       </div>
                    </div>

                    <div className="p-6 bg-white">
                       
                       {/* Описание и Вред */}
                       <div className="space-y-4 mb-6">
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase mb-1">Описание дефекта</p>
                             <p className="text-slate-700 font-medium leading-snug">{result.desc}</p>
                          </div>
                          <div className={`p-4 rounded-xl bg-slate-50 border-l-4 ${result.border.replace('border', 'border-l')}`}>
                             <p className="text-xs font-bold text-slate-400 uppercase mb-1">Вред для города/жителей</p>
                             <p className={`font-bold ${result.text}`}>{result.harm}</p>
                          </div>
                       </div>

                       {/* Ввод адреса (ИСПРАВЛЕНО: text-slate-900) */}
                       {!isSent ? (
                         <div className="space-y-4">
                            <div>
                               <label className="text-xs font-bold text-slate-400 uppercase mb-2 block ml-1">Местоположение</label>
                               <div className="relative">
                                  <MapPin className="absolute left-4 top-3.5 text-slate-400" size={20}/>
                                  
                                  {/* ВОТ ТУТ ИСПРАВИЛ ЦВЕТ ТЕКСТА */}
                                  <input 
                                    type="text" 
                                    placeholder="Улица, дом, ориентир..." 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-400"
                                  />
                                  
                                  <button className="absolute right-2 top-2 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-sky-500 transition" title="Моя геопозиция">
                                     <Navigation size={16} />
                                  </button>
                               </div>
                            </div>

                            <button 
                              onClick={handleSendReport}
                              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <Send size={18} /> Отправить отчет в Акимат
                            </button>
                         </div>
                       ) : (
                         <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-in zoom-in">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                               <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-800 mb-1">Заявка принята!</h3>
                            <p className="text-emerald-600 text-sm">
                               Ваш отчет передан подрядчику.<br/>
                            </p>
                         </div>
                       )}

                    </div>
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
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 1.5s linear infinite;
        }
      `}</style>
    </>
  );
}