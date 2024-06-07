import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
  LinkIcon,
  Textarea,
} from "@nextui-org/react";

export default function Details() {
  return (
    <div className="flex flex-col bg-gray-300 w-full pt-2 sm:items-center px-3">
      <h1 className=" mb-2">Basic details</h1>
      <div className="flex items-center flex-col gap-y-2 mb-2">
        <Input type="text" label="Username" placeholder="Enter your Username"
        className="sm:min-w-[40rem]"/>
        <Input type="email" label="Store Name" placeholder="Enter Store Name" 
        />
        <Textarea
          label="Bio"
          placeholder="Enter your description"
          
           />
      </div>
    </div>
  );
}
