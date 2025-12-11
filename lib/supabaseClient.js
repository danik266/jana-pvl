import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ВРЕМЕННО: Проверка в консоли браузера (F12)
console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseAnonKey ? "Ключ есть" : "Ключа нет");

export const supabase = createClient(supabaseUrl, supabaseAnonKey)