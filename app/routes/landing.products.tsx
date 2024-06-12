import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
// import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import zod from "zod";


type FormValues = {
  serviceName: string;
  servicePrice: number;
  serviceImage: string;
};

const MAX_FILE_SIZE = 5*1024*1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = zod.object({
  serviceName: zod.string().min(3),
  servicePrice: zod.preprocess((val) => Number(val), zod.number().min(1, "Service price must be at least 1")),
  serviceImage: zod
  .any()
  .refine((files) => files && files.length > 0, "Image is required")
  // .refine((files) => {
  //   const sizeOk = files?.[0]?.size <= MAX_FILE_SIZE;
  //   // console.log('File size:', files?.[0]?.size, 'Valid:', sizeOk); // Debugging: Log file size and validity
  //   return sizeOk; // Validate file size is within the limit
  // }, `Max image size is 5MB.`)
  // .refine(
  //   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //   "Only .jpg, .jpeg, .png and .webp formats are supported."
  // )
});

const resolver = zodResolver(schema);


interface FormErrors {
  serviceName?: {
    type: string;
    message: string;
  };
  servicePrice?: {
    type: string;
    message: string;
  };
}

// const resolver: Resolver<FormValues> = async (values) => {
//   const errors: FormErrors = {};
//   if (!values.serviceName) {
//     errors.serviceName = {
//       type: "required",
//       message: "Service name is required.",
//     };
//   }
//   if (!values.servicePrice) {
//     errors.servicePrice = {
//       type: "required",
//       message: "Service Price is required.",
//     };
//   }
//   return {
//     values: Object.keys(errors).length ? {} : values,
//     errors,
//   };
// };

export const action = async({request}: ActionFunctionArgs)=>{
  // console.log("Request", request);
  const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
  if(errors){
    return json({errors, receivedValues});
  }
  const {serviceName, servicePrice, serviceImage} = data;

  console.log(serviceName, servicePrice, serviceImage);
  return null;
}

export default function Products() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    formState,
    handleSubmit,
    register,
  } = useRemixForm<zod.infer<typeof schema>>({ resolver });

  const [file, setFile] = React.useState<string | undefined>();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileUrl = URL.createObjectURL(selectedFile);
            setFile(fileUrl);
        }
    }
}

  const actionData = useActionData<typeof action>();
  const {errors} = formState;

  console.log("Errors", errors);  



  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Product
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <Form method="post" action="/landing.products" onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Add Product
              </ModalHeader>
              {/* {JSON.stringify(errors)} */}
              <ModalBody>
                <Input
                  {...register("serviceName")}
                  isInvalid={!!errors.serviceName}
                  errorMessage={
                    errors.serviceName?.message||""
                  }
                  autoFocus
                  label="Service name"
                  placeholder="Enter your service"
                  variant="bordered"
                />
                <Input
                  {...register("servicePrice")}
                  isInvalid={!!errors.servicePrice}
                  errorMessage={
                    errors.servicePrice ?.message || ""
                  }
                  type="number"
                  label="Service price"
                  placeholder="Enter your service price"
                  variant="bordered"
                />
                <div>
                  <label
                    htmlFor="service-image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service image
                  </label>
                  <Spacer y={0.5} />
                  <Input
                    id="service-image"
                    type="file"
                    {...register("serviceImage")}
                    placeholder="Insert your image"
                    onChange={handleChange}
                    isInvalid={!!errors.serviceImage}
                    errorMessage={errors.serviceImage?.message as string || ''}
                  />
                  <Spacer y={1} />
                  <div className="mt-4">
                    <p className="text-sm  mb-2">Image Preview:</p>
                    <div className="border border-gray-300 rounded-2xl overflow-hidden w-[300px] h-[200px]">
                      <Image
                        width={300}
                        height={100}
                        alt="Service Preview"
                        src={file}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button type="submit" color="primary">
                  Add Product
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
