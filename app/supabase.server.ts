import { createServerClient } from "@supabase/auth-helpers-remix";

export const createSupabaseServerClient = (request: Request) => {
  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  return { supabaseClient, headers: response.headers };
};
