import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const url = params.url ?? "";
  const type = params.type ?? "";
  const searchParams = new URL(request.url).searchParams;
  const redirectUrl = searchParams.get("redirect") ?? "/";
  if (url.trim() === "" || type.trim() === "")
    return json({ message: "No url or store_type in place" }, { status: 400 });

  const supabase = createSupabaseServerClient(request);
  const data = await supabase.supabaseClient.auth.getUser();
  const user = data.data.user!;
  const { error } = await supabase.supabaseClient
    .from("urls")
    .insert({ url: url, user_id: user?.id, store_type: type });
  if (error) {
    return json({ message: error.message }, 400);
  }
  return redirect(redirectUrl);
};

export default function Create() {
  return <></>;
}
