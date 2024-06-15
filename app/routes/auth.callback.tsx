import { ActionFunctionArgs } from "@remix-run/node";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import { createSupabaseServerClient } from "~/supabase.server";
export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { supabaseClient, headers } = createSupabaseServerClient(request);
    const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
    if (error) {
      return redirectWithError("/sign-in", "Authentication failed");
    }
    const redirectUrl = url.searchParams.get("redirect");
    if (redirectUrl) {
      return redirectWithSuccess(atob(redirectUrl), "Successfully logged in!", {
        headers: headers,
      });
    }
    return redirectWithSuccess("/", "Successfully logged in!", {
      headers: headers,
    });
  }

  return new Response("Authentication faild", {
    status: 400,
  });
};
