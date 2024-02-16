import { createClient } from '@supabase/supabase-js'

const sbUrl = process.env.SUPABASE_URL
const sbAnon = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(sbUrl ?? '', sbAnon ?? '')
