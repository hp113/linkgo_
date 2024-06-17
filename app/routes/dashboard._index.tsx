import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
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
export const action = async ({ request, params }: ActionFunctionArgs) => {
  // console.log("Hello this is request", request);

  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler()
  );

  // console.log("Form Data", formData);
  const receivedValues = {
    url: formData.get("url"),
    store_type: formData.get("store_type"),
  };

  let { url, store_type } = receivedValues;
  url = url!.toString().replace(/"/g, "").trim();
  store_type = store_type!.toString().replace(/"/g, "").trim();
  const { supabaseClient } = createSupabaseServerClient(request);

  // const userId = (await supabaseClient.auth.getUser()).data.user?.id ?? "";
  const user = await getUser(request);
  if (!user || typeof user !== "object" || !("id" in user)) {
    return json(
      { error: "User not found or invalid user data." },
      { status: 401 }
    );
  }
  // console.log(user);
  // Check if the URL already exists in the database
  const { data, error } = await supabaseClient
    .from("urls")
    .select("id")
    .eq("url", url!.toString())
    .single();

    if (error && error.code !== 'PGRST116') { // If error is not "no rows returned" error
      // console.error('Error querying database:', error);
      return json({ error: 'Database error occurred.' });
    }

  if (data) {
    return json({ error: "URL already exists." });
  }

  const { data: insertData, error: insertError } = await supabaseClient
    .from("urls")
    .insert({ url, store_type, user_id: user.id });

  if (insertError) {
    console.error("Error inserting into database:", insertError);
    return json({ error: "Failed to insert data." });
  }

  // Successful insertion
  return json({ message: "URL successfully added." });
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
