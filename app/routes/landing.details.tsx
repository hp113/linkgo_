import {
    Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
  LinkIcon,
} from "@nextui-org/react";

export default function Details() {
  return (
    <div className="flex flex-col font-bold">
      <h1 className="ml-5 mb-2">Basic details</h1>
      <div className="flex items-center flex-col gap-y-2 mb-2">
        <Card className=" min-w-[400px] max-w-[400px] ">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-default-500 font-medium">Username</p>
              <p className="text-md font-semibold">@thebontonstore</p>
            </div>
          </CardHeader>
        </Card>
        <Card className=" min-w-[400px] max-w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-default-500 font-medium">Store name</p>
              <p className="text-md font-semibold">The Bonton Store</p>
            </div>
          </CardHeader>
        </Card>
        <Card className="min-w-[400px] max-w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-default-500 font-medium">Bio</p>
              <p className="text-md font-semibold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus perferendis recusandae dolores nulla at eligendi inventore optio doloremque, quae corporis enim consectetur alias, ipsum nesciunt perspiciatis. Dolores dolorem maiores, et iure aliquid illum?</p>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="flex flex-col ml-5 ">
        <h1>Products</h1>
        <Button
              as={Link}
              className="text-white bg-black mx-auto rounded-full"
              href="#"
              variant="flat"
            >
              Add product
            </Button>
      </div>
    </div>
  );
}
