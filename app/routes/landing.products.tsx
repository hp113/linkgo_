import {
  Button,
  Checkbox,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

import { SiMaterialdesignicons } from "react-icons/si";

export default function Analytics() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState<string | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files);
      setFile(URL.createObjectURL(e.target.files[0]));
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
            <>
              <ModalHeader className="flex flex-col gap-1">Add Product</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Service name"
                  placeholder="Enter your service"
                  variant="bordered"
                />
                <Input
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
                    <div className="border border-gray-300 rounded-lg overflow-hidden w-[300px] h-[200px]">
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
                <Button color="primary" onPress={onClose}>
                  Add Product
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
