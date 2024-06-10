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
import React, { useEffect, useState } from "react";
// import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";

type FormValues = {
  serviceName: string;
  servicePrice: number;
  serviceImage: string;
};

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

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FormErrors = {};
  if (!values.serviceName) {
    errors.serviceName = {
      type: "required",
      message: "Service name is required.",
    };
  }
  if (!values.servicePrice) {
    errors.servicePrice = {
      type: "required",
      message: "Service Price is required.",
    };
  }
  return {
    values: Object.keys(errors).length ? {} : values,
    errors,
  };
};

export default function Products() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({ resolver });

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

  


  const onSubmit = handleSubmit((data) => {
    // Handle form submission here
    console.log(data);
  });

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Product
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Add Product
              </ModalHeader>
              <ModalBody>
                <Input
                  {...register("serviceName")}
                  isInvalid={!!errors.serviceName}
                  errorMessage={
                    errors.serviceName ? errors.serviceName.message : ""
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
                    errors.servicePrice ? errors.servicePrice.message : ""
                  }
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
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
