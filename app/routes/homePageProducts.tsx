import { Card, CardBody, Image } from "@nextui-org/react";

const products = [
  {
    id: 1,
    title: "Product 1",
    img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$10",
  },
  {
    id: 2,
    title: "Product 2",
    img: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D",
    price: "$20",
  },
  {
    id: 3,
    title: "Product 3",
    img: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8",
    price: "$30",
  },
  {
    id: 4,
    title: "Product 4",
    img: "https://images.unsplash.com/photo-1614680550853-aa00842aa529?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8",
    price: "$40",
  },
  // Add more products as needed
];

export default function HomeProducts() {
  return (
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
              // width={70}
              //   height={50}
              alt={item.title}
              className=" objec-cover w-20 h-20"
              src={item.img}
            />
            <div>
              <h2 className="text-lg">{item.title}</h2>
              <p className="text-default-500">{item.price}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
