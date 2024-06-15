import { Card, CardBody, Image, Link } from "@nextui-org/react";
import { Tables } from "~/types/supabase";

interface Product {
  id: number;
  service_name: string;
  service_price: number;
  service_logo: string;
}

interface HomePageProductsProps {
  storeDetails: Tables<"url_details">;
  productDetails: Product[];
}

export default function HomeProducts({
  storeDetails,
  productDetails,
}: HomePageProductsProps) {
  return (
    <div className="gap-2 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full mx-4">
      {productDetails.map((product) => (
        <Card
          shadow="sm"
          key={product.id}
          isPressable
          as={Link}
          isExternal
          href={`https://wa.me/${storeDetails.phone_no}?text=Hello%20I%20want%20to%20order%20${product.service_name}%20from%20your%20store`}
          className="m-4 flex flex-row"
        >
          <CardBody className="overflow-visible p-0 flex-shrink-0 flex-row gap-2">
            <Image
              shadow="sm"
              radius="lg"
              // width={70}
              //   height={50}
              alt={product.service_name}
              className=" object-cover w-20 h-20"
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
