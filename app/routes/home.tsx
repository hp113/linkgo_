import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Link } from "@remix-run/react";
import { FaWhatsapp } from "react-icons/fa6";

const products = [
    {
      id: 1,
      title: "Product 1",
      img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "$10"
    },
    {
      id: 2,
      title: "Product 2",
      img: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D",
      price: "$20"
    },
    {
      id: 3,
      title: "Product 3",
      img: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8",
      price: "$30"
    },
    {
      id: 4,
      title: "Product 4",
      img: "https://images.unsplash.com/photo-1614680550853-aa00842aa529?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8",
      price: "$40"
    },
    // Add more products as needed
  ];

export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center ">
      
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit sm:text-xl">The Bonton Store</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={Link}
              className="text-white bg-black"
              href="#"
              variant="flat"
            >
              Direction
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="relative flex justify-center items-center ">
        <img src="/images/shop.jpg" alt="shop" className="w-full" />
        <img
          src="/images/bonton.jpg"
          alt="bonton"
          className="absolute -bottom-8 w-1/5 rounded-full transform -translate-x-1/2 left-1/2"
        />
      </div>
      <h1 className="mt-10 font-bold">The Bonton Store</h1>
      <h3 className="text-green-500">Open till 6pm</h3>
      <p className="mx-3">We are a Cafe that serves hand pored coffee made from our own Arabian coffee beans.</p>
      <div className="gap-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mx-4 ">
      {products.map((item, index) => (
        <Card 
          shadow="sm" 
          key={index} 
          isPressable 
          onPress={() => console.log("item pressed", item.title)}
          className="m-2 flex flex-row"
        >
            
          <CardBody className="overflow-visible p-0 flex-shrink-0 flex-row gap-2">
            
            <Image
              shadow="sm"
              radius="lg"
              width={70}
            //   height={50}
              alt={item.title}
              className=" objec-cover w-20 h-20"
              src={item.img}
            />
            <div >

            <h2 className="text-lg">{item.title}</h2>
            <p className="text-default-500">{item.price}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
    <Link to="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4">
      <Button color="success" startContent={<FaWhatsapp/>} className="text-white rounded-full">
        Message us
      </Button> 
    </Link>
    </div>
  );
}
