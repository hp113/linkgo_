import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { toast } from "sonner";
import React from "react";
import { fetchUrlDetails } from "~/dataFetchingHomePage";
import zod from "zod";
import { createSupabaseServerClient } from "~/supabase.server";

const schema = zod.object({
  username: zod.string().min(3),
  storeName: zod.string().min(3),
  bio: zod.string().min(3),
});

const resolver = zodResolver(schema);

export const loader = async({request}: LoaderFunctionArgs) => {
  const storeDetails = await fetchUrlDetails(request, '740e9b83-6c7a-40fc-81a3-dec2d7103e10');
  return json({storeDetails});
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { receivedValues, errors, data } = await getValidatedFormData<
    zod.infer<typeof schema>
  >(request, resolver);
  if (errors) {
    return json({ errors, receivedValues });
  }
  const { username, storeName, bio } = data;
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  const response = await supabaseClient.from("url_details").upsert(
    {
      username,
      store_name: storeName,
      description: bio || "",
      url_id: "740e9b83-6c7a-40fc-81a3-dec2d7103e10",
      created_at: new Date().toISOString(),
    },
    { onConflict: "url_id" }
  );

  if (response.error) {
    return json({ error: response.error.message }, { status: 500, headers });
  }

  return json({ message: "Details added successfully" }, { headers });
};


export default function Details() {
  const {storeDetails} = useLoaderData<typeof loader>();

  const { formState, handleSubmit, register } = useRemixForm<
    zod.infer<typeof schema>
  >({ resolver, defaultValues: {
    username: storeDetails[0].username || "",
    storeName: storeDetails[0].store_name || "",
    bio: storeDetails[0].description || "",
  } });

  const actionData = useActionData<typeof action>();

  React.useEffect(() => {
    if (actionData) {
      if ("message" in actionData) {
        toast.success(actionData.message);
      }

      if ("error" in actionData) {
        toast.error(actionData.error);
      }
    }
  }, [actionData]);

  const { errors } = formState;

  return (
    <div className="flex flex-col bg-gray-100 w-full min-h-screen items-center py-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Basic Details
        </h1>
        <Form
          method="post"
          action="/landing.details"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <CardBody className="space-y-6">
            <Input
              type="text"
              label="Username"
              placeholder="Enter your Username"
              className="w-full"
              {...register("username")}
              isInvalid={!!errors.username}
              errorMessage={errors.username?.message || ""}
            />
            <Input
              type="text"
              label="Store Name"
              placeholder="Enter Store Name"
              className="w-full"
              {...register("storeName")}
              isInvalid={!!errors.storeName}
              errorMessage={errors.storeName?.message || ""}
            />
            <Textarea
              label="Bio"
              placeholder="Enter your description"
              className="w-full"
              {...register("bio")}
              isInvalid={!!errors.bio}
              errorMessage={errors.bio?.message || ""}
            />
            <div className="flex justify-center">
              <Button type="submit" color="primary" className="w-auto px-6">
                Submit
              </Button>
            </div>
          </CardBody>
        </Form>
      </Card>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    toast.error(error.data);
    return redirect("/landing");
  } else {
    return redirect("/landing");
  }
}
