import { Button, RadioGroup } from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { CustomRadio } from "~/components/CustomRadio";
import { createSupabaseServerClient } from "../supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const url = body.get("url")?.toString() ?? "";
  const type = body.get("type")?.toString() ?? "";
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const params = new URL(request.url).searchParams;
  const storeName = params.get("store_name") ?? "";
  if (storeName.trim() === "") return json({});
  console.log(params);
  const { count } = await supabaseClient
    .from("urls")
    .select("*", { count: "exact" })
    .eq("url", storeName);
  if (count !== 0) {
    return redirect("/?store_name=" + storeName);
  }
  return json({});
};

export default function Create() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start h-screen w-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      {/* {JSON.stringify(actionData)} */}
      {/* <div className="flex-1">{searchParams.get("store_name")}</div> */}
      <form method="post" action="/sign-out" className="absolute top-0 right-0 mt-3 mr-3">
              <Button type="submit">Sign Out</Button>
            </form>
      <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <Form method="post" className="w-full flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">  
            What is the type of your buisness?
          </h1>
          <p className="text-gray-700 text-center mb-6">
            This will help us tailor your page according to your needs.
          </p>
          <input
            type="hidden"
            value={searchParams.get("store_name") ?? ""}
            name="url"
          />
          <RadioGroup name="type" className="mx-auto my-3">
            <CustomRadio
              description="For cafes, restaurants, boutiques etc that have a physical location"
              value="free"
            >
              Physical store
            </CustomRadio>
            <CustomRadio
              description="For any business that runs completely online."
              value="pro"
            >
              Digital Business
            </CustomRadio>
          </RadioGroup>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            className="mx-auto mt-6"
          >
            Next
          </Button>
        </Form>
      </div>
    </div>
  );
}
