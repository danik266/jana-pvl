"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Montserrat } from "next/font/google";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// Настройка шрифта
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setErrorMsg(null);
  };

  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.refresh();
        router.push("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;

        if (data.session) {
          router.refresh();
          router.push("/");
        } else {
          alert(
            "Тіркелу сәтті өтті! Почтаңызды тексеріңіз. / Регистрация успешна! Проверьте почту."
          );
          setIsLogin(true);
        }
      }
    } catch (error) {
      setErrorMsg(error.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  const handleEGovLogin = () => {
    alert("Функция входа через eGov Mobile находится в разработке.");
  };

  return (
    <div
      className={`${montserrat.className} min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4`}
    >
      {/* Фоновые фигуры */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/40 rounded-full blur-[120px]"></div>

      {/* Кнопка "Назад" */}
      <Link
        href="/"
        className="absolute top-6 left-6 group flex items-center gap-2 text-gray-500 hover:text-cyan-600 transition-colors z-10"
      >
        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:border-cyan-200">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium hidden sm:block">На главную</span>
      </Link>

      {/* Карточка авторизации */}
      <div className="w-full max-w-md relative z-10 animate-scaleIn">
        <div className="bg-white rounded-3xl shadow-2xl shadow-cyan-900/10 border border-white/60 overflow-hidden relative">
          {/* Верхняя градиентная полоса */}
          <div className="h-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 animate-gradient-x"></div>

          <div className="p-8 pb-2 text-center">
            {/* Лого */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 mb-6 shadow-inner">
              <Sparkles className="w-8 h-8 text-cyan-500 animate-pulse" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
              {isLogin ? "Қош келдіңіз!" : "Тіркелу"}
            </h2>
            <p className="text-gray-400 text-sm mb-6 font-medium">
              {isLogin
                ? "Smart Pavlodar Tourism Platform"
                : "Создайте аккаунт путешественника"}
            </p>
          </div>

          <div className="px-8 pb-8">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-start gap-3 text-sm animate-slideIn">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
            >
              {/* Поле ФИО */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isLogin ? "h-0 opacity-0" : "h-[80px] opacity-100"
                }`}
              >
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">
                  Аты-жөніңіз / ФИО
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Асқаров Асқар"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-gray-800 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-all focus:bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-gray-800 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-all focus:bg-white"
                  />
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                  Құпия сөз / Пароль
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-gray-800 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-all focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-400/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isLogin ? (
                      "Кіру / Войти"
                    ) : (
                      "Тіркелу / Создать"
                    )}
                    {!loading && (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* OR */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                <span className="px-3 bg-white text-gray-300">
                  немесе / или
                </span>
              </div>
            </div>

            {/* eGov Button */}
            <button
              onClick={handleEGovLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[#00529B] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:bg-[#004080] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
            >
              <div className="p-1 bg-white/10 rounded-full">
                <Fingerprint className="w-5 h-5 text-white/90" />
              </div>
              <span className="text-sm">eGov Mobile Login</span>
            </button>

            {/* Bottom link */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm mb-2">
                {isLogin ? "Аккаунтыңыз жоқ па?" : "Аккаунтыңыз бар ма?"}
              </p>
              <button
                onClick={toggleMode}
                className="text-cyan-600 hover:text-teal-600 font-bold transition-colors text-sm hover:underline decoration-2 underline-offset-4"
              >
                {isLogin
                  ? "Тіркелу (Зарегистрироваться)"
                  : "Кіру (Войти в аккаунт)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
