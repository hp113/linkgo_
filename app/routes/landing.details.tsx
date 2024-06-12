import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import { createSupabaseServerClient } from "~/supabase.server";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import React from "react";

const schema = zod.object({
  username: zod.string().min(3),
  storeName: zod.string().min(3),
  bio: zod.string().min(3),
});

const resolver = zodResolver(schema);

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
  const { formState, handleSubmit, register } = useRemixForm<
    zod.infer<typeof schema>
  >({ resolver });

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
    // <div className="flex flex-col bg-gray-300 w-full pt-2 sm:items-center px-3">
    //   {/* {JSON.stringify(actionData)} */}
    //   <h1 className="mb-2">Basic details</h1>
    //   <div className="flex items-center flex-col gap-y-2 mb-2">
    //     <Form
    //       method="post"
    //       action="/landing.details"
    //       onSubmit={handleSubmit}
    //       className="flex items-center flex-col gap-y-2 mb-2"
    //     >
    //       <Input
    //         type="text"
    //         label="Username"
    //         placeholder="Enter your Username"
    //         className="sm:min-w-[40rem]"
    //         {...register("username")}
    //         isInvalid={!!errors.username}
    //         errorMessage={errors.username?.message || ""}
    //       />
    //       <Input
    //         type="text"
    //         label="Store Name"
    //         placeholder="Enter Store Name"
    //         {...register("storeName")}
    //         isInvalid={!!errors.storeName}
    //         errorMessage={errors.storeName?.message || ""}
    //       />
    //       <Textarea
    //         label="Bio"
    //         placeholder="Enter your description"
    //         {...register("bio")}
    //         isInvalid={!!errors.bio}
    //         errorMessage={errors.bio?.message || ""}
    //       />
    //       <Button type="submit"  color="primary">
    //         Submit
    //       </Button>

    //     </Form>
    //   </div>
    // </div>

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
