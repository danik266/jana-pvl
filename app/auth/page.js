"use client";

import { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck 
} from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Переключатель состояния (Вход / Регистрация)
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4">
      
      {/* Кнопка "На главную" (абсолютное позиционирование или просто сверху) */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 text-sky-700 font-medium flex items-center gap-2 hover:text-sky-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Басты бетке / На главную</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Карточка */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-sky-100 overflow-hidden">
          
          {/* Шапка карточки */}
          <div className="p-8 pb-0 text-center">
            <div className="inline-flex p-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl shadow-lg mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Қош келдіңіз!" : "Тіркелу"}
            </h2>
            <p className="text-gray-500 mb-6">
              {isLogin 
                ? "Добро пожаловать в Ertis Smart City" 
                : "Создайте аккаунт для доступа к услугам"}
            </p>
          </div>

          {/* Форма */}
          <div className="p-8 pt-0">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              
              {/* Поле имени (только для регистрации) */}
              <div className={`transition-all duration-300 overflow-hidden ${isLogin ? 'h-0 opacity-0' : 'h-[76px] opacity-100'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                  Аты-жөніңіз / ФИО
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Мысалы: Асқаров Асқар"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" size={20} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                  Құпия сөз / Пароль
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {isLogin && (
                  <div className="text-right mt-2">
                    <a href="#" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                      Забыли пароль?
                    </a>
                  </div>
                )}
              </div>

              {/* Кнопка отправки */}
              <button
                className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {isLogin ? "Кіру / Войти" : "Тіркелу / Зарегистрироваться"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

            </form>

            {/* Разделитель */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {isLogin ? "Аккаунт жоқ па?" : "Аккаунт бар ма?"}
                </span>
              </div>
            </div>

            {/* Переключатель режима */}
            <div className="text-center">
              <button
                onClick={toggleMode}
                className="text-sky-600 hover:text-sky-700 font-bold transition-colors"
              >
                {isLogin ? "Тіркелу (Регистрация)" : "Кіру (Войти)"}
              </button>
            </div>
          </div>
          
          {/* Нижняя полоса декоративная */}
          <div className="h-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-500 animate-gradient-x"></div>
        </div>

        {/* Футер */}
        <p className="text-center text-sky-800/60 text-sm mt-8">
          © 2025 Ertis Smart City Platform
        </p>
      </div>
    </div>
  );
}