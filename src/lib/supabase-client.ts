// src/lib/supabase-client.ts

import { createClient } from '@supabase/supabase-js'

// Pega as variáveis de ambiente que configuramos no arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cria e exporta uma única instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)