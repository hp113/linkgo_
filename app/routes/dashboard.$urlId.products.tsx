import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
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
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { TbTrashFilled } from "react-icons/tb";
import { useRemixForm, validateFormData } from "remix-hook-form";
import { jsonWithSuccess } from "remix-toast";
import { toast } from "sonner";
import zod from "zod";
import { createSupabaseServerClient } from "~/supabase.server";
import { getUser } from "~/utils/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const AddProductSchema = zod.object({
  _action: zod.string(),
  serviceName: zod.string().min(3),
  servicePrice: zod.coerce.number().min(1, "Service price must be at least 1"),
  serviceImage: zod.any(),
});
const DeleteProductSchema = zod.object({
  _action: zod.string(),
  serviceId: zod.string(),
});

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await getUser(request);
  const { urlId } = params;
  if (!urlId) {
    return json({ error: "URL not found" }, { status: 404 });
  }

  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({
      maxPartSize: MAX_FILE_SIZE,
      filter(args) {
        return args.name == "serviceImage"
          ? ACCEPTED_IMAGE_TYPES.includes(args.contentType)
          : true;
      },
    })
  );

  const { supabaseClient } = createSupabaseServerClient(request);
  const _action = formData.get("_action");

  if (_action === "delete") {
    const { errors, data } = await validateFormData<
      zod.infer<typeof DeleteProductSchema>
    >(formData, zodResolver(DeleteProductSchema));
    if (errors) {
      return json({ errors }, { status: 422 });
    }
    const { serviceId } = data;
    const { error } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", serviceId);
    if (error) {
      return json({ error: error.message }, { status: 500 });
    }
    const { error: deleteImageError } = await supabaseClient.storage
      .from("services")
      .remove([`${urlId}/${serviceId}`]);
    if (deleteImageError) {
      return json({ error: deleteImageError.message }, { status: 500 });
    }

    return jsonWithSuccess(
      { message: "Product deleted successfully" },
      "Product deleted successfully"
    );
  } else if (_action === '"add"') {
    const { errors, data } = await validateFormData<
      zod.infer<typeof AddProductSchema>
    >(formData, zodResolver(AddProductSchema));
    if (errors) {
      return json({ errors }, { status: 422 });
    }
    const { serviceName, servicePrice, serviceImage } = data;

    const { data: uploadedData, error } = await supabaseClient.storage
      .from("services")
      .upload(`${urlId}/${Date.now()}`, serviceImage);
    if (error) {
      return json({ error: error.message }, { status: 500 });
    }
    const { error: insertError } = await supabaseClient
      .from("products")
      .insert({
        service_name: serviceName.slice(1, -1),
        service_price: servicePrice,
        service_logo: uploadedData.path,
        url_id: urlId,
      });
    if (insertError) {
      return json({ error: insertError.message }, { status: 500 });
    }
    return json({ message: "Product added successfully" });
  }
  return json({ error: "Invalid action" }, { status: 400 });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await getUser(request);
  const { urlId } = params;
  if (!urlId) {
    throw new Response("URL not found", { status: 404 });
  }
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("url_id", urlId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Response(error.message, { status: 500, headers });
  }
  const dataWithPublicUrl = data.map((item) => {
    return {
      ...item,
      service_logo: supabaseClient.storage
        .from("services")
        .getPublicUrl(item.service_logo).data.publicUrl,
    };
  });
  return json({ data: dataWithPublicUrl }, { headers });
};

export default function Products() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { formState, watch, handleSubmit, register, control, reset } =
    useRemixForm<zod.infer<typeof AddProductSchema>>({
      resolver: zodResolver(AddProductSchema),
      submitConfig: { encType: "multipart/form-data" },
    });

  const loaderData = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();
  const { state } = useNavigation();
  const { errors } = formState;

  useEffect(() => {
    if (actionData) {
      if ("message" in actionData) {
        toast.success(actionData.message);
        reset();
        onClose();
      }

      if ("error" in actionData) {
        toast.error(actionData.error);
      }
    }
  }, [actionData, onClose, reset]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="gap-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mx-4 ">
        {loaderData?.data.map((item, index) => (
          <Card shadow="sm" key={index} className="m-2 flex flex-row">
            <CardBody className=" p-0 flex-shrink-0 flex-row flex-1 gap-2">
              <Image
                shadow="sm"
                radius="lg"
                // width={70}
                //   height={50}
                alt={item.service_name}
                className=" objec-cover w-20 h-20"
                src={item.service_logo}
              />
              <Form method="post" encType="multipart/form-data">
                <div>
                  <h2 className="text-lg">{item.service_name}</h2>
                  <input type="hidden" name="serviceId" value={item.id} />
                  <p className="text-default-500">{item.service_price}</p>
                </div>
                <Button
                  isIconOnly
                  className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                  radius="full"
                  variant="light"
                  type="submit"
                  name="_action"
                  value="delete"
                >
                  <TbTrashFilled className="w-4 h-4" />
                </Button>
              </Form>
            </CardBody>
          </Card>
        ))}
      </div>
      <Button onPress={onOpen} color="primary">
        Add Product
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <Form
              method="post"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <ModalHeader className="flex flex-col gap-1">
                Add Product
              </ModalHeader>
              {/* {JSON.stringify(errors)} */}
              <ModalBody>
                <Input
                  {...register("serviceName", {})}
                  isInvalid={!!errors.serviceName}
                  errorMessage={errors.serviceName?.message || ""}
                  label="Service name"
                  placeholder="Enter your service"
                  variant="bordered"
                />
                <Input
                  {...register("servicePrice", {
                    valueAsNumber: true,
                  })}
                  isInvalid={!!errors.servicePrice}
                  errorMessage={errors.servicePrice?.message || ""}
                  type="number"
                  label="Service price"
                  placeholder="Enter your service price"
                  variant="bordered"
                />
                <div>
                  <label
                    htmlFor="serviceImage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service image
                  </label>
                  <Spacer y={0.5} />
                  <Controller
                    control={control}
                    name={"serviceImage"}
                    rules={{ required: "Service image is required" }}
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <input
                          {...field}
                          value={value?.fileName}
                          accept="image/*"
                          onChange={(event) => {
                            onChange(event.target.files?.[0]);
                          }}
                          type="file"
                          id="picture"
                        />
                      );
                    }}
                  />

                  <Spacer y={1} />
                  <div className="mt-4">
                    <p className="text-sm  mb-2">Image Preview:</p>
                    <Image
                      width={300}
                      height={100}
                      alt="Service Preview"
                      src={
                        watch("serviceImage") &&
                        URL.createObjectURL(watch("serviceImage"))
                      }
                      className="border border-gray-300 rounded-2xl overflow-hidden w-[300px] h-[200px] object-cover"
                    />
                  </div>
                </div>
                <input
                  type="hidden"
                  {...register("_action", {
                    value: "add",
                  })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={state == "submitting"}
                  disabled={state == "submitting"}
                >
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
