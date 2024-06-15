import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardTable from "~/components/DashboardTable";
import { createSupabaseServerClient } from "~/supabase.server";
import { getUser } from "~/utils/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!("avatar_url" in user)) return user;
  const { supabaseClient } = createSupabaseServerClient(request);

  // Fetch URLs associated with the user
  const { data: urls, error: fetchError } = await supabaseClient
    .from("urls")
    .select("*, url_details(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (fetchError) {
    // Handle fetch error appropriately
    console.error("Error fetching URLs:", fetchError);
    throw new Response("Error fetching URLs", { status: 500 });
  }
  const transformedUrls = urls.map((i) => {
    if (i.url_details) {
      i.url_details.homepage_coverimg = supabaseClient.storage
        .from("services")
        .getPublicUrl(i.url_details.homepage_coverimg).data.publicUrl;
      i.url_details.homepage_logo = supabaseClient.storage
        .from("services")
        .getPublicUrl(i.url_details.homepage_logo).data.publicUrl;
    }
    return i;
  });

  // Return JSON response with table data
  return json({ urls: transformedUrls });
};

function DashboardIndex() {
  const { urls } = useLoaderData<typeof loader>();
  return (
    <>
      <p className="sm:text-lg font-bold text-sm py-5 "> Registered URLs</p>
      <DashboardTable urls={urls} />
    </>
  );
}

export default DashboardIndex;
