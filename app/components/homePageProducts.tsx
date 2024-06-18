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
    <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full mx-4 pb-12">
      {productDetails.map((product) => (
        <Card
          shadow="none"
          key={product.id}
          isPressable
          as={Link}
          isExternal
          href={`https://wa.me/${storeDetails.phone_no}?text=Hello%20I%20want%20to%20order%20${product.service_name}%20from%20your%20store`}
          className="m-4 flex flex-row border-none"
        >
          <CardBody className="overflow-visible p-0 flex-shrink-0 flex-row gap-3">
            <div className="flex-shrink-0 w-[4rem] h-[4rem] overflow-hidden rounded-lg">
              <Image
                shadow="sm"
                alt={product.service_name}
                className="object-cover w-full h-full"
                src={product.service_logo}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">{product.service_name}</h2>
              <p className="text-green-500 text-lg font-bold mr-2">
                Rs.{product.service_price}
              </p>
            </div>
          </CardBody>

          {/* <CardBody className="overflow-visible  flex-shrink-0 flex-row gap-4 ">
  <Image
    shadow="sm"
    radius="lg"
    alt={product.service_name}
    className="object-cover w-20 h-20"
    src={product.service_logo}
  />
  <div className="flex justify-between items-center w-full">
    <h2 className="text-xl font-semibold">{product.service_name}</h2>
    <p className="text-green-500 text-lg font-bold mr-4">
      Rs.{product.service_price}
    </p>
  </div>
</CardBody> */}
        </Card>
      ))}
    </div>
  );
}
