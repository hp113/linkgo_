import {
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Resolver, useForm } from "react-hook-form";

type FormValues = {
  username: string;
  storeName: string;
  bio: string;
};

interface FormErrors {
  username?: {
    type: string;
    message: string;
  };
  storeName?: {
    type: string;
    message: string;
  };
  bio?: {
    type: string;
    message: string;
  };
}

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FormErrors = {};
  if (!values.username) {
    errors.username = {
      type: 'required',
      message: 'Username is required.',
    };
  }
  if (!values.storeName) {
    errors.storeName = {
      type: 'required',
      message: 'Store Name is required.',
    };
  }
  if (!values.bio) {
    errors.bio = {
      type: 'required',
      message: 'Bio is required.',
    };
  }
  return {
    values: Object.keys(errors).length ? {} : values,
    errors,
  };
};

export default function Details() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className="flex flex-col bg-gray-300 w-full pt-2 sm:items-center px-3">
      <h1 className=" mb-2">Basic details</h1>
      <div className="flex items-center flex-col gap-y-2 mb-2">
        <form onSubmit={onSubmit} className="flex items-center flex-col gap-y-2 mb-2">
          <Input type="text" label="Username" placeholder="Enter your Username"
          className="sm:min-w-[40rem]" {...register('username')}
          isInvalid={!!errors.username}
          errorMessage={errors.username ? errors.username.message : ''}/>
          <Input type="text" label="Store Name" placeholder="Enter Store Name" 
          {...register('storeName')} 
          isInvalid={!!errors.storeName}
          errorMessage={errors.storeName ? errors.storeName.message : ''}/>
          <Textarea
            label="Bio"
            placeholder="Enter your description"
            {...register('bio')}
            isInvalid={!!errors.bio}
          errorMessage={errors.bio ? errors.bio.message : ''}
            />
  <Button type="submit" color="primary">Submit</Button>
        </form>
      </div>
    </div>
  );
}
