"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, User, Sparkles, Trash2, Clock, MapPin, StopCircle } from "lucide-react";
import { Montserrat } from "next/font/google";
import Header from "../components/Header/page"; // Сіздің Header компонентіңіз

const font = Montserrat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

// Тілдік аудармалар
const translations = {
  kz: {
    placeholder: "Сұрағыңызды осында жазыңыз...",
    typing: "Жауап жазылуда...",
    clear: "Тазалау",
    intro: "Сәлем! Мен Павлодар қаласының виртуалды көмекшісімін. Сізге автобус маршруттары, ХҚКО қызметтері немесе ауа райы бойынша көмектесе аламын.",
    suggestions: ["🚌 22-ші автобус қайда?", "🌤 Павлодарда ауа райы", "🏥 Емханаға жазылу", "📅 Демалыс күндері не істеуге болады?"],
    disclaimer: "Jana Pavlodar AI қателіктер жіберуі мүмкін.",
    stop: "Тоқтату"
  },
  ru: {
    placeholder: "Напишите ваш вопрос здесь...",
    typing: "Печатает...",
    clear: "Очистить",
    intro: "Привет! Я виртуальный помощник Павлодара. Могу помочь с маршрутами автобусов, услугами ЦОН или погодой.",
    suggestions: ["🚌 Где 22-й автобус?", "🌤 Погода в Павлодаре", "🏥 Запись в поликлинику", "📅 Что делать на выходных?"],
    disclaimer: "Jana Pavlodar AI может допускать ошибки.",
    stop: "Стоп"
  },
  en: {
    placeholder: "Type your question here...",
    typing: "Typing...",
    clear: "Clear",
    intro: "Hello! I am the virtual assistant of Pavlodar. I can help you with bus routes, PSC services, or weather.",
    suggestions: ["🚌 Where is bus 22?", "🌤 Weather in Pavlodar", "🏥 Clinic appointment", "📅 Weekend activities"],
    disclaimer: "Jana Pavlodar AI may make mistakes.",
    stop: "Stop"
  }
};

export default function ErtisAIPage() {
  const router = useRouter();
  const [lang, setLang] = useState("kz"); // Басты тіл state-і
  const t = translations[lang] || translations.kz;
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamedText, setStreamedText] = useState(""); // Streaming эффект үшін
  const messagesEndRef = useRef(null);
  
  // Бастапқы хабарлама (тіл өзгергенде жаңарады, егер чат бос болса)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "init",
        role: "ai",
        text: t.intro,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [lang, t.intro, messages.length]);

  // Автоскролл
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText, isTyping]);

  // Typewriter Effect Logic
  const simulateStreaming = (fullText) => {
    setStreamedText("");
    setIsTyping(true);
    let i = 0;
    const speed = 30; // жылдамдық (мс)

    const interval = setInterval(() => {
      setStreamedText((prev) => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        // Ағын біткен соң хабарламаны толық тізімге қосамыз
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "ai",
            text: fullText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setStreamedText("");
      }
    }, speed);
  };

const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = textOverride || input;
    if (!text.trim()) return;

    // 1. Добавляем сообщение пользователя в интерфейс
    const newMessage = {
      id: Date.now(),
      role: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessagesList = [...messages, newMessage];
    setMessages(newMessagesList);
    setInput("");
    setIsTyping(true);

    try {
      // 2. Форматируем историю сообщений для отправки на API
      // Gemini API ожидает формат: { role: "user" | "assistant", content: string }
      const apiMessages = newMessagesList.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // 3. Отправляем запрос на сервер
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // 4. Получаем ответ и запускаем анимацию печатания
      simulateStreaming(data.reply);

    } catch (error) {
      console.error("Error:", error);
      // Если ошибка, выводим сообщение об ошибке
      const errorText = lang === 'kz' 
        ? "Кешіріңіз, байланыс қателігі орын алды." 
        : "Извините, произошла ошибка соединения.";
      simulateStreaming(errorText);
    }
  };

  const handleClear = () => {
    setMessages([{
      id: Date.now(),
      role: "ai",
      text: t.intro,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setStreamedText("");
    setIsTyping(false);
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${font.className}`}>
      
      {/* 1. ИНТЕГРАЦИЯ HEADER */}
      <Header 
        currentLanguage={lang}
        onLanguageChange={setLang} // Header тілді өзгертсе, осында сақталады
        showBackButton={true}
        onBackToHome={() => router.push('/')}
      />

      {/* 2. Chat Container */}
      <main className="flex-grow container mx-auto px-4 py-6 relative z-10 w-full max-w-4xl flex flex-col">
        
        {/* Chat Control Bar (Sticky under header) */}
        <div className="sticky top-2 z-20 flex justify-between items-center bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-sky-100 shadow-sm mb-4">
            <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Pavlodar AI</span>
            </div>
            <button 
                onClick={handleClear}
                className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                {t.clear}
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-grow flex flex-col gap-6 pb-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  msg.role === "ai"
                    ? "bg-gradient-to-br from-sky-500 to-teal-400 text-white"
                    : "bg-white text-slate-600 border border-slate-100"
                }`}>
                {msg.role === "ai" ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[75%]">
                <div
                    className={`p-4 rounded-2xl shadow-sm leading-relaxed whitespace-pre-wrap text-sm md:text-base ${
                    msg.role === "user"
                        ? "bg-sky-600 text-white rounded-tr-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay"
                        : "bg-white border border-sky-100 text-slate-700 rounded-tl-none"
                    }`}
                >
                    {msg.text}
                </div>
                {/* Time */}
                <span className={`text-[10px] text-slate-400 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <Clock className="w-3 h-3" /> {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Streaming / Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 md:gap-4 flex-row animate-in fade-in">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                
                {streamedText ? (
                    // Typewriter text
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-sky-100 text-slate-700 shadow-sm max-w-[85%]">
                        {streamedText}
                        <span className="inline-block w-1.5 h-4 bg-sky-500 ml-1 animate-pulse align-middle"></span>
                    </div>
                ) : (
                    // Dots animation (Thinking)
                    <div className="bg-white border border-sky-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                        <span className="text-xs text-sky-500 font-semibold mr-2">{t.typing}</span>
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions (Empty State) */}
        {messages.length < 2 && !isTyping && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 animate-in slide-in-from-bottom-5">
                {t.suggestions.map((sug, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(null, sug)}
                        className="text-left p-3 md:p-4 bg-white hover:bg-sky-50 border border-sky-100 hover:border-sky-300 rounded-xl text-slate-600 text-sm transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        {sug}
                    </button>
                ))}
             </div>
        )}

      </main>

      {/* 3. Input Area */}
      <div className="relative z-20 bg-white/80 backdrop-blur-xl border-t border-sky-100 py-4 pb-6 md:pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={isTyping}
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-0 focus:border-sky-400 focus:bg-white transition-all outline-none text-slate-800 placeholder:text-slate-400 shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
            />
            {isTyping ? (
                 <button
                 type="button"
                 onClick={() => setIsTyping(false)} // Тоқтату логикасы қарапайым
                 className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-200 text-slate-500 rounded-xl hover:bg-slate-300 transition-all flex items-center justify-center"
                 title={t.stop}
               >
                 <StopCircle className="w-6 h-6" />
               </button>
            ) : (
                <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-r from-sky-600 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-sky-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center transform active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
          <p className="text-center text-[10px] md:text-xs text-slate-400 mt-3">
             {t.disclaimer}
          </p>
        </div>
      </div>
      
      {/* Фон әсерлері */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-amber-200/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-sky-200/20 rounded-full blur-[100px]"></div>
      </div>

    </div>
  );
}