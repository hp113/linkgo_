import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  console.log("User:", user); 
  const id = user.id;
  const datafromsupabase= await supabaseClient.from('urls').select('*').eq('user_id', id);
  return new Response(null);
};

const Dashboard = () => {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Dashboard</h1>

      <Form action="/sign-out" method="post">
        <button type="submit">Sign Out</button>
      </Form>
    </div>
  );
};

export default Dashboard;
