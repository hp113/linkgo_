import { Button, Input, Textarea } from "@nextui-org/react";
import { createSupabaseServerClient } from "~/supabase.server";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import zod from "zod";
import {zodResolver} from '@hookform/resolvers/zod'

const schema = zod.object({
  username: zod.string().min(3),
  storeName: zod.string().min(3),
  bio: zod.string().min(3),
});

const resolver = zodResolver(schema);

export const action = async({request}: ActionFunctionArgs) =>{
  const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
  if(errors){
    return json({errors, receivedValues});
  }
  const {username, storeName, bio} = data;
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
  
  return redirect("/success", { headers });
}


export default function Details() {
  const {formState, handleSubmit, register } = useRemixForm<zod.infer<typeof schema>>({ resolver });

  const { errors } = formState;
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col bg-gray-300 w-full pt-2 sm:items-center px-3">
      {/* {JSON.stringify(actionData)} */}
      <h1 className="mb-2">Basic details</h1>
      <div className="flex items-center flex-col gap-y-2 mb-2">
        <Form
          method="post"
          action="/landing.details"
          onSubmit={handleSubmit}
          className="flex items-center flex-col gap-y-2 mb-2"
        >
          <Input
            type="text"
            label="Username"
            placeholder="Enter your Username"
            className="sm:min-w-[40rem]"
            {...register("username")}
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message || ""}
          />
          <Input
            type="text"
            label="Store Name"
            placeholder="Enter Store Name"
            {...register("storeName")}
            isInvalid={!!errors.storeName}
            errorMessage={errors.storeName?.message||''}
          />
          <Textarea
            label="Bio"
            placeholder="Enter your description"
            {...register("bio")}
            isInvalid={!!errors.bio}
            errorMessage={errors.bio?.message||""}
          />
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}
