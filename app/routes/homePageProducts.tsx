import { Card, CardBody, Image } from "@nextui-org/react";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchProducts } from "~/dataFetchingHomePage";


interface Product {
  id: number;
  service_name: string;
  service_price: string;
  service_logo: string;
}

interface HomePageProductsProps {
  productDetails: Product[];
}

export default function HomeProducts({ productDetails }: HomePageProductsProps) {
  
  // console.log(productDetails);
  return (
    <div className="gap-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mx-4">
      {productDetails.map((product) => (
        <Card
          shadow="sm"
          key={product.id}
          isPressable
          className="m-2 flex flex-row"
        >
          <CardBody className="overflow-visible p-0 flex-shrink-0 flex-row gap-2">
            <Image
              shadow="sm"
              radius="lg"
              // width={70}
              //   height={50}
              alt={product.service_name}
              className=" objec-cover w-20 h-20"
              src={product.service_logo}
            />
            <div>
              <h2 className="text-lg">{product.service_name}</h2>
              <p className="text-default-500">{product.service_price}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
