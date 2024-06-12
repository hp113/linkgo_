import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Link, useLoaderData } from "@remix-run/react";
import { FaWhatsapp } from "react-icons/fa6";
import HomeProducts from "./homePageProducts";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { fetchProducts, fetchUrlDetails } from "~/dataFetchingHomePage";

export const loader = async ({request}:LoaderFunctionArgs) => {
  const storeDetails = await fetchUrlDetails(request);
  const productDetails = await fetchProducts(request);
  return json({ storeDetails, productDetails });  
}
export default function HomePage() {
  const {storeDetails, productDetails } = useLoaderData<typeof loader>();
  return (
    <div className="w-full min-h-screen flex flex-col items-center ">
      
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit sm:text-xl md:text-2xl lg:text-3xl">{storeDetails.store_name}</p>
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
      <div className="relative flex justify-center items-center w-full">
        <img src="/images/shop.jpg" alt="shop" className="h-[50vh] w-full object-cover" />
        <img
          src="/images/bonton.jpg"
          alt="bonton"
          className="absolute -bottom-8 w-[80px] sm:w-[10vw] xl:w-[8vw] rounded-full transform -translate-x-1/2 left-1/2"
        />
      </div>
      <h1 className="mt-10 font-bold sm:text-2xl">{storeDetails.store_name}</h1>
      <h3 className="text-green-500 sm:text-lg">Open till 6pm</h3>
      <p className="mx-3 sm:text-lg">{storeDetails.description}</p>
      <HomeProducts productDetails={productDetails}/>
    <Link to="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4">
      <Button color="success" startContent={<FaWhatsapp/>} className="text-white rounded-full">
        Message us
      </Button> 
    </Link>
    </div>
  );
}
