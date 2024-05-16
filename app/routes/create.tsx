import { Button, RadioGroup } from "@nextui-org/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { CustomRadio } from "~/components/CustomRadio";
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
  return (
    <div className="flex flex-[0.8] h-screen w-screen">
      <div className="flex-1">,</div>
      <Form>
        <h1 className="text-2xl font-bold">
          What is the type of your buisness?
        </h1>
        <p className="text-gray-800">
          This will help us tailor your page according to your needs.
        </p>

        <RadioGroup>
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
        <Button variant="solid" color="primary">
          Next
        </Button>
      </Form>
    </div>
  );
}
