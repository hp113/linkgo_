// routes/signout.tsx
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  // Check if user is logged in
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  // Sign out
  await supabaseClient.auth.signOut();
  return redirect("/", {
    headers,
  });
};

export default function SignOut() {
  return (
    <div>
      <p>Signing out...</p>
    </div>
  );
}
