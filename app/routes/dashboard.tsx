import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  // Fetch authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    // Handle error or redirect if user is not authenticated
    return redirect("/");
  }

  // Fetch URLs associated with the user
  const { data: urls, error: fetchError } = await supabaseClient
    .from("urls")
    .select("*")
    .eq("user_id", user.id);

  if (fetchError) {
    // Handle fetch error appropriately
    console.error("Error fetching URLs:", fetchError);
    return new Response("Error fetching URLs", { status: 400 });
  }
  
  // Return JSON response with table data
  return json({ urls});
};

const Dashboard = () => {
  const data = useLoaderData<typeof loader>();
  console.log("This is data", typeof data);
  return (
    <div>
      <Table aria-label="Example table with dynamic content">
        <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>STORE TYPE</TableColumn>
        <TableColumn>ID</TableColumn>
        </TableHeader>
        <TableBody items={[data]}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.url}</TableCell>
                <TableCell>{item.store_type}</TableCell>
              </TableRow>
            )}
          </TableBody>
      </Table>

      <Form action="/sign-out" method="post">
        <button type="submit">Sign Out</button>
      </Form>
    </div>
  );
};

export default Dashboard;
