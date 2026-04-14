import { createClient } from '@supabase/supabase-js'

// .env.local に書いた秘密の鍵をここで呼び出します
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 鍵を使って、Supabaseへの地下通路（クライアント）を開通！
export const supabase = createClient(supabaseUrl, supabaseAnonKey)