"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; 
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, Fingerprint 
} from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Состояния для данных формы
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // Состояния загрузки и ошибок
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
        // --- ЛОГИКА ВХОДА ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Обновляем роутер, чтобы Next.js увидел новую куку сессии
        router.refresh();
        router.push("/"); 
      } else {
        // --- ЛОГИКА РЕГИСТРАЦИИ ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;

        // ПРОВЕРКА: Если Supabase вернул сессию сразу (Email Confirmation выключен)
        if (data.session) {
            router.refresh();
            router.push("/");
        } else {
            // Если требуется подтверждение почты
            alert("Тіркелу сәтті өтті! Почтаңызды тексеріңіз. / Регистрация успешна! Проверьте почту для подтверждения.");
            setIsLogin(true);
        }
      }
    } catch (error) {
      setErrorMsg(error.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  // Заглушка для eGov
  const handleEGovLogin = () => {
    alert("eGov Mobile (Digital ID) арқылы кіру функциясы интеграция сатысында.\n\nФункция входа через eGov Mobile находится в разработке.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4">
      <Link href="/" className="absolute top-6 left-6 text-sky-700 font-medium flex items-center gap-2 hover:text-sky-900 transition-colors">
        <ArrowLeft size={20} />
        <span>Басты бетке / На главную</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-sky-100 overflow-hidden">
          
          <div className="p-8 pb-0 text-center">
            <div className="inline-flex p-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl shadow-lg mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Қош келдіңіз!" : "Тіркелу"}
            </h2>
            <p className="text-gray-500 mb-6">
              {isLogin ? "Добро пожаловать в Ertis Smart City" : "Создайте аккаунт для доступа к услугам"}
            </p>
          </div>

          <div className="p-8 pt-0">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
              
              <div className={`transition-all duration-300 overflow-hidden ${isLogin ? 'h-0 opacity-0' : 'h-[76px] opacity-100'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Аты-жөніңіз / ФИО</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" size={20} />
                  <input
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Мысалы: Асқаров Асқар"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Құпия сөз / Пароль</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Жүктелуде..." : (isLogin ? "Кіру / Войти" : "Тіркелу / Зарегистрироваться")}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* РАЗДЕЛИТЕЛЬ eGOV */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-400">немесе / или</span></div>
            </div>

            {/* КНОПКА eGOV */}
            <button
              onClick={handleEGovLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[#00529B] text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:bg-[#004080] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              <Fingerprint className="w-6 h-6 text-white/90" />
              <span>eGov Mobile арқылы кіру</span>
            </button>

            {/* РАЗДЕЛИТЕЛЬ ДЛЯ СМЕНЫ РЕЖИМА */}
            <div className="relative my-6">
               {/* Пустое пространство для отступа */}
            </div>

            <div className="text-center pb-2">
              <button onClick={toggleMode} className="text-sky-600 hover:text-sky-700 font-bold transition-colors">
                {isLogin ? "Тіркелу (Регистрация)" : "Кіру (Войти)"}
              </button>
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-500 animate-gradient-x"></div>
        </div>
      </div>
    </div>
  );
}