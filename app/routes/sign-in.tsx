import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const redirectParam =
    (Object.fromEntries(formData).redirectParam as string | undefined) ??
    request.headers.get("Referer") ??
    "/dashboard";
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${
        process.env.VERCEL_URL || "http://localhost:5173"
      }/auth/callback?redirect=${encodeURI(btoa(redirectParam))}`,
    },
  });
  // just for this example
  // if there is no error, we show "Please check you email" message
  if (error) {
    return json({ success: false }, { headers: headers });
  }

  return redirect(data.url, { headers: headers });
};

const SignIn = () => {
  const actionResponse = useActionData<typeof action>();

  return (
    <>
      {!actionResponse?.success ? (
        <Form method="post">
          {/* <input type="email" name="email" placeholder="Your Email"  /> */}
          <br />
          <button type="submit">Sign In</button>
        </Form>
      ) : (
        <h3>Please check your email.</h3>
      )}
    </>
  );
};

export default SignIn;
