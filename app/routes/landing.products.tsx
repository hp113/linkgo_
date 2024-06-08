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
// import { useState } from "react";
import { useForm } from "react-hook-form";


export default function Analytics() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [file, setFile] = useState<string | undefined>(undefined);
  const { register, handleSubmit, formState: { errors } , setValue, watch} = useForm();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files!.length > 0) {
        const fileURL = URL.createObjectURL(files![0]);
        // Use setValue to update the value managed by React Hook Form
        setValue('file', fileURL, { shouldValidate: true });
    }
};

const file = watch('file');

  const onSubmit = (data: any) => {
    console.log(data);
    if (file) {
      console.log("File URL:", file);
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
      Add Product
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit((data) => { onSubmit(data); onClose(); })}>
              <ModalHeader className="flex flex-col gap-1">Add Product</ModalHeader>
              <ModalBody>
                <Input
                  {...register("serviceName", { required: true })}
                  autoFocus
                  label="Service name"
                  placeholder="Enter your service"
                  variant="bordered"
                  />
                  {errors.serviceName && <p className="text-red-500 text-xs mt-1">Service name is required</p>}
                <Input
                {...register("servicePrice", { required: true })}
                  label="Service price"
                  placeholder="Enter your service price"
                  variant="bordered"
                  />
                  {errors.servicePrice && <p className="text-red-500 text-xs mt-1">Service price is required</p>}
                <div>
                  <label
                    htmlFor="service-image"
                    className="block text-sm font-medium text-gray-700"
                    >
                    Service image
                  </label>
                  <Spacer y={0.5} />
                  <input
                    id="service-image"
                    type="file"
                    className="border border-gray-300 rounded-md shadow-sm p-2"
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
