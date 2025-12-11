"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Send, Bot, User, Sparkles, Trash2, StopCircle, 
  Menu, Plus, MessageSquare, X 
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Header from "../components/Header/page"; 

const font = Montserrat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

// Тілдік аудармалар / Переводы
const translations = {
  kz: {
    placeholder: "Сұрағыңызды осында жазыңыз...",
    typing: "Жауап жазылуда...",
    intro: "Сәлем! Мен Павлодар қаласының виртуалды көмекшісімін.",
    disclaimer: "Jana Pavlodar AI қателіктер жіберуі мүмкін.",
    stop: "Тоқтату",
    newChat: "Жаңа чат",
    history: "Чат тарихы",
    emptyHistory: "Тарих бос",
    delete: "Өшіру"
  },
  ru: {
    placeholder: "Напишите ваш вопрос здесь...",
    typing: "Печатает...",
    intro: "Привет! Я виртуальный помощник Павлодара.",
    disclaimer: "Jana Pavlodar AI может допускать ошибки.",
    stop: "Стоп",
    newChat: "Новый чат",
    history: "История чатов",
    emptyHistory: "История пуста",
    delete: "Удалить"
  },
  en: {
    placeholder: "Type your question here...",
    typing: "Typing...",
    intro: "Hello! I am the virtual assistant of Pavlodar.",
    disclaimer: "Jana Pavlodar AI may make mistakes.",
    stop: "Stop",
    newChat: "New Chat",
    history: "Chat History",
    emptyHistory: "No history",
    delete: "Delete"
  }
};

export default function ErtisAIPage() {
  const router = useRouter();
  const [lang, setLang] = useState("kz");
  const t = translations[lang] || translations.kz;
  
  // --- STATE ---
  const [chatHistory, setChatHistory] = useState([]); // Все чаты
  const [activeChatId, setActiveChatId] = useState(null); // ID текущего чата
  const [messages, setMessages] = useState([]); // Сообщения текущего чата
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef(null);

  // --- ЗАГРУЗКА ИЗ LOCALSTORAGE ---
  useEffect(() => {
    const savedChats = localStorage.getItem("ertis-ai-history");
    if (savedChats) {
      setChatHistory(JSON.parse(savedChats));
    }
  }, []);

  // --- СОХРАНЕНИЕ В LOCALSTORAGE ---
  const saveHistoryToStorage = (updatedHistory) => {
    setChatHistory(updatedHistory);
    localStorage.setItem("ertis-ai-history", JSON.stringify(updatedHistory));
  };

  // --- UI EFFECTS ---
  // Автоскролл
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText, isTyping]);

  // Сброс сообщений при смене чата
  useEffect(() => {
    if (activeChatId) {
      const chat = chatHistory.find(c => c.id === activeChatId);
      if (chat) {
        setMessages(chat.messages);
      }
    } else {
      // Если чат не выбран (или "Новый чат"), показываем приветствие
      setMessages([{
        id: "init",
        role: "ai",
        text: t.intro,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [activeChatId, lang, t.intro]);

  // --- ЛОГИКА ЧАТА ---

  const createNewChat = () => {
    setActiveChatId(null); // Null означает, что мы в режиме "Новый чат"
    setMessages([{
      id: "init",
      role: "ai",
      text: t.intro,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInput("");
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const deleteChat = (e, chatId) => {
    e.stopPropagation(); // Чтобы не открывался чат при удалении
    const updatedHistory = chatHistory.filter(c => c.id !== chatId);
    saveHistoryToStorage(updatedHistory);
    
    // Если удалили активный чат, сбрасываем в "Новый"
    if (activeChatId === chatId) {
      createNewChat();
    }
  };

  // Симуляция печатания + Сохранение ответа AI
  const simulateStreaming = (fullText, currentChatId) => {
    setStreamedText("");
    setIsTyping(true);
    let i = 0;
    const speed = 20; 

    const interval = setInterval(() => {
      setStreamedText((prev) => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setStreamedText("");

        // 1. Создаем объект сообщения AI
        const aiMsg = {
          id: Date.now(),
          role: "ai",
          text: fullText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // 2. Добавляем в UI
        setMessages(prev => [...prev, aiMsg]);

        // 3. Сохраняем в историю (находим чат и добавляем сообщение)
        setChatHistory(prevHistory => {
            const updatedHistory = prevHistory.map(chat => {
                if (chat.id === currentChatId) {
                    return { ...chat, messages: [...chat.messages, aiMsg] };
                }
                return chat;
            });
            localStorage.setItem("ertis-ai-history", JSON.stringify(updatedHistory));
            return updatedHistory;
        });

      }
    }, speed);
  };

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = textOverride || input;
    if (!text.trim()) return;

    // 1. Формируем сообщение пользователя
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let currentId = activeChatId;
    let updatedHistory = [...chatHistory];

    // 2. Если это "Новый чат", создаем его в истории
    if (!currentId) {
      currentId = Date.now().toString();
      setActiveChatId(currentId);
      
      const newChat = {
        id: currentId,
        title: text, // Заголовок = первое сообщение
        date: new Date().toISOString(),
        messages: [userMsg] // Сразу добавляем сообщение юзера (без приветствия)
      };
      
      updatedHistory = [newChat, ...updatedHistory]; // Добавляем в начало списка
    } else {
      // Если чат уже есть, добавляем сообщение к нему
      updatedHistory = updatedHistory.map(chat => {
        if (chat.id === currentId) {
          return { ...chat, messages: [...chat.messages, userMsg] };
        }
        return chat;
      });
    }

    // 3. Обновляем состояние и Storage
    saveHistoryToStorage(updatedHistory);
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // 4. API Request
      const apiMessages = messages
        .filter(m => m.id !== 'init') // Не отправляем приветствие на сервер
        .concat(userMsg)
        .map((msg) => ({
           role: msg.role === "user" ? "user" : "assistant",
           content: msg.text,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      
      // 5. Запускаем анимацию ответа (передаем ID чата, куда сохранить)
      simulateStreaming(data.reply, currentId);

    } catch (error) {
      console.error("Error:", error);
      const errorText = lang === 'kz' ? "Қателік орын алды." : "Ошибка соединения.";
      simulateStreaming(errorText, currentId);
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-white ${font.className} overflow-hidden`}>
      
      {/* HEADER */}
      <Header 
        currentLanguage={lang}
        onLanguageChange={setLang}
        showBackButton={true}
        onBackToHome={() => router.push('/')}
      />

      {/* LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- SIDEBAR --- */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <aside className={`
          absolute md:static z-40 h-full w-72 bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          {/* Кнопка "Новый чат" */}
          <div className="p-4">
            <button 
              onClick={createNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-600 hover:shadow-md rounded-xl transition-all text-slate-700 font-medium text-sm group"
            >
              <Plus className="w-5 h-5 text-slate-400 group-hover:text-sky-500" />
              {t.newChat}
            </button>
          </div>

          {/* Список чатов */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {chatHistory.length === 0 ? (
                <div className="text-center mt-10 text-slate-400 text-xs">
                    {t.emptyHistory}
                </div>
            ) : (
                chatHistory.map((chat) => (
                    <div 
                      key={chat.id}
                      onClick={() => {
                          setActiveChatId(chat.id);
                          if(window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className={`group w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer relative ${
                          activeChatId === chat.id 
                          ? "bg-sky-100/50 text-sky-800" 
                          : "hover:bg-slate-200/50 text-slate-600"
                      }`}
                    >
                      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeChatId === chat.id ? "text-sky-500" : "text-slate-400"}`} />
                      <span className="text-sm truncate pr-6">{chat.title}</span>
                      
                      {/* Кнопка удаления (появляется при наведении) */}
                      <button 
                        onClick={(e) => deleteChat(e, chat.id)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 hover:text-red-500 rounded-md transition-all text-slate-400"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                ))
            )}
          </div>
        </aside>


        {/* --- MAIN AREA --- */}
        <main className="flex-1 flex flex-col min-w-0 bg-white relative">
          
          {/* Top Bar */}
          <header className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  Ertis AI <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-100 text-sky-600">BETA</span>
                </span>
              </div>
            </div>
            <button 
                onClick={createNewChat}
                className="text-xl text-slate-400 hover:text-sky-600 font-medium transition-colors"
            >
               {activeChatId ? "+ New" : ""}
            </button>
          </header>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            {/* ИЗМЕНЕНО: max-w-2xl -> max-w-6xl (Очень широкий) */}
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "ai" ? "bg-sky-500 text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    {msg.role === "ai" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* ИЗМЕНЕНО: Ширина пузыря max-w-[90%] (чтобы занимал почти всю строку) */}
                  <div className={`flex flex-col gap-1 max-w-[90%] md:max-w-[90%]`}>
                    {/* ИЗМЕНЕНО: text-base вместо text-sm (Шрифт крупнее) */}
                    <div className={`px-4 py-3 rounded-2xl text-base leading-relaxed whitespace-pre-wrap ${
                       msg.role === "user" 
                       ? "bg-sky-50 text-slate-800 rounded-tr-none" 
                       : "text-slate-700 rounded-tl-none border border-slate-100 bg-slate-50/50"
                    }`}>
                        {msg.text}
                    </div>
                    <span className={`text-[10px] text-slate-300 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {/* Анимация печатания */}
              {isTyping && (
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 text-white">
                      <Bot className="w-4 h-4 animate-pulse" />
                   </div>
                   <div className="flex flex-col gap-1 max-w-[90%]">
                      {streamedText ? (
                        <div className="px-4 py-3 text-base text-slate-700 leading-relaxed bg-white border border-slate-100 rounded-2xl rounded-tl-none">
                          {streamedText}<span className="inline-block w-1.5 h-4 bg-sky-500 ml-1 animate-pulse align-middle">|</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 h-10 px-2">
                           <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                           <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                           <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                      )}
                   </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white">
            {/* ИЗМЕНЕНО: max-w-2xl -> max-w-6xl (Поле ввода тоже широкое) */}
            <div className="max-w-6xl mx-auto relative">

                <form onSubmit={handleSend} className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-2 py-2 focus-within:ring-2 focus-within:ring-sky-100 focus-within:border-sky-300 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        placeholder={t.placeholder}
                        disabled={isTyping}
                        className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-2 text-slate-700 placeholder:text-slate-400 text-base"
                        rows={1}
                    />
                    
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="mb-1 p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:bg-slate-300 transition-all flex-shrink-0 shadow-sm"
                    >
                        {isTyping ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
                <p className="text-center text-[15px] text-slate-400 mt-2">
                    {t.disclaimer}
                </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}