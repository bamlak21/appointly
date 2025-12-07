import { createClient } from "@supabase/supabase-js";

const config = {
  url:
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (() => {
      throw new Error("Supabase url missing");
    })(),

  anonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (() => {
      throw new Error("Supabase anon key url missing");
    })(),
};

export const supabase = createClient(config.url, config.anonKey);
