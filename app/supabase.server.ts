import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "./types/supabase";
export const createSupabaseServerClient = (request: Request) => {
  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  return { supabaseClient, headers: response.headers };
};
