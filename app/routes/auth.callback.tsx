import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { supabaseClient, headers } = createSupabaseServerClient(request);
    const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect("/sign-in");
    }
    const redirectUrl = url.searchParams.get("redirect");
    if (redirectUrl) {
      return redirect(atob(redirectUrl), {
        headers: headers,
      });
    }
    return redirect("/", {
      headers: headers,
    });
  }

  return new Response("Authentication faild", {
    status: 400,
  });
};
