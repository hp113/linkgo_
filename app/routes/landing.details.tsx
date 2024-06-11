import { Button, Input, Textarea } from "@nextui-org/react";
import { Resolver, useForm } from "react-hook-form";
import { createSupabaseServerClient } from "~/supabase.server";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useTransition } from "react";

type FormValues = {
  username: string;
  storeName: string;
  bio: string;
};

interface ActionData {
  errors?: {
    [key: string]: string;
  };
}

const resolver: Resolver<FormValues> = async (values) => {
  const errors: { [key: string]: string } = {};
  if (!values.username) {
    errors.username = 'Username is required';
  }
  if (!values.storeName) {
    errors.storeName = 'Store name is required';
  }
  if (!values.bio) {
    errors.bio = 'Bio is required';
  }
  return { values, errors };
};

export const action = async ({ request, context }: { request: Request, context: any }) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  const formData = await request.formData();
  const username = formData.get('username') as string;
  const storeName = formData.get('storeName') as string;
  const bio = formData.get('bio') as string;

  const { data, error } = await supabaseClient
    .from('url_details')
    .insert([
      { 
        username,
        store_name: storeName,
        description: bio || '', 
        url_id: crypto.randomUUID(), 
        created_at: new Date().toISOString(), 
      }
    ]);

  if (error) {
    return json({ error: error.message }, { status: 500, headers });
  }

  return redirect('/success', { headers });
};

export default function Details() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver });

  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  return (
    <div className="flex flex-col bg-gray-300 w-full pt-2 sm:items-center px-3">
      <h1 className="mb-2">Basic details</h1>
      <div className="flex items-center flex-col gap-y-2 mb-2">
        <form method="post"className="flex items-center flex-col gap-y-2 mb-2">
          <Input
            type="text"
            label="Username"
            placeholder="Enter your Username"
            className="sm:min-w-[40rem]"
            {...register('username')}
            isInvalid={!!errors.username || !!actionData?.errors?.username}
            errorMessage={errors.username ? errors.username.message : actionData?.errors?.username}
          />
          <Input
            type="text"
            label="Store Name"
            placeholder="Enter Store Name"
            {...register('storeName')}
            isInvalid={!!errors.storeName || !!actionData?.errors?.storeName}
            errorMessage={errors.storeName ? errors.storeName.message : actionData?.errors?.storeName}
          />
          <Textarea
            label="Bio"
            placeholder="Enter your description"
            {...register('bio')}
            isInvalid={!!errors.bio || !!actionData?.errors?.bio}
            errorMessage={errors.bio ? errors.bio.message : actionData?.errors?.bio}
          />
          <Button type="submit" color="primary">Submit</Button>
        </form>
      </div>
    </div>
  );
}
