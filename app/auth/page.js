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
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;

        if (data.session) {
          router.refresh();
          router.push("/");
        } else {
          alert("Тіркелу сәтті өтті! Почтаңызды тексеріңіз.");
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
    alert("Функция eGov в разработке.");
  };

  return (
    <div
      className={`${montserrat.className} min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4
      max-[400px]:p-2 max-[360px]:p-1`}
    >
      {/* Background */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200/40 rounded-full blur-[120px]
      max-[400px]:blur-[90px] max-[360px]:blur-[70px]"
      ></div>

      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/40 rounded-full blur-[120px]
      max-[400px]:blur-[90px] max-[360px]:blur-[70px]"
      ></div>

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 group flex items-center gap-2 text-gray-500 hover:text-cyan-600 transition-colors z-10
        max-[400px]:top-3 max-[400px]:left-3"
      >
        <div
          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm
        group-hover:shadow-md transition-all group-hover:border-cyan-200 max-[380px]:w-8 max-[380px]:h-8"
        >
          <ArrowLeft size={20} className="max-[380px]:w-4 max-[380px]:h-4" />
        </div>
        <span className="font-medium hidden sm:block">На главную</span>
      </Link>

      {/* Card Wrapper */}
      <div
        className="w-full max-w-md relative z-10 animate-scaleIn
      max-[400px]:max-w-sm max-[360px]:max-w-[90%]"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden relative
        max-[380px]:rounded-2xl"
        >
          <div className="h-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 animate-gradient-x"></div>

          <div className="p-8 pb-2 text-center max-[400px]:p-6 max-[360px]:p-5">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br
            from-cyan-50 to-teal-50 border border-cyan-100 mb-6 shadow-inner
            max-[400px]:w-14 max-[400px]:h-14 max-[360px]:w-12 max-[360px]:h-12"
            >
              <Sparkles className="w-8 h-8 text-cyan-500 animate-pulse max-[360px]:w-6 max-[360px]:h-6" />
            </div>

            <h2
              className="text-3xl font-extrabold text-gray-800 mb-2
            max-[400px]:text-2xl max-[360px]:text-xl"
            >
              {isLogin ? "Қош келдіңіз!" : "Тіркелу"}
            </h2>

            <p className="text-gray-400 text-sm mb-6 font-medium max-[360px]:text-xs">
              {isLogin
                ? "Smart Pavlodar Tourism Platform"
                : "Создайте аккаунт путешественника"}
            </p>
          </div>

          <div className="px-8 pb-8 max-[400px]:px-6 max-[360px]:px-5">
            {errorMsg && (
              <div
                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-sm flex gap-3
              max-[360px]:text-xs max-[360px]:p-3"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              className="space-y-4 max-[360px]:space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
            >
              {/* Full name */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isLogin ? "h-0 opacity-0" : "h-[80px] opacity-100"
                } max-[360px]:h-[65px]`}
              >
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
                  Аты-жөніңіз / ФИО
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl 
                    focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400
                    max-[360px]:py-3"
                    placeholder="Асқаров Асқар"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl 
                    focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400
                    max-[360px]:py-3"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
                  Құпия сөз / Пароль
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl 
                    focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400
                    max-[360px]:py-3"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold 
                text-lg py-4 rounded-xl shadow-xl hover:-translate-y-1 transition-all
                max-[380px]:text-base max-[360px]:py-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isLogin ? (
                  "Кіру / Войти"
                ) : (
                  "Тіркелу / Создать"
                )}
              </button>
            </form>

            {/* OR */}
            <div className="relative my-8 max-[360px]:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                <span className="px-3 bg-white text-gray-300 max-[360px]:text-[10px]">
                  немесе / или
                </span>
              </div>
            </div>

            {/* eGov Button */}
            <button
              onClick={handleEGovLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#00529B] text-white font-bold py-3.5 rounded-xl shadow-lg 
              hover:bg-[#004080] transition-all
              max-[360px]:py-3 max-[360px]:text-sm"
            >
              <Fingerprint className="w-5 h-5 max-[360px]:w-4 max-[360px]:h-4" />
              eGov Mobile Login
            </button>

            {/* Bottom link */}
            <div className="mt-8 text-center max-[360px]:mt-6">
              <p className="text-gray-500 text-sm max-[360px]:text-xs mb-2">
                {isLogin ? "Аккаунтыңыз жоқ па?" : "Аккаунтыңыз бар ма?"}
              </p>
              <button
                onClick={toggleMode}
                className="text-cyan-600 font-bold text-sm hover:underline
                max-[360px]:text-xs"
              >
                {isLogin ? "Тіркелу (Зарегистрироваться)" : "Кіру (Войти)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
