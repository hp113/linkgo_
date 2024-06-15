import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FaWhatsapp } from "react-icons/fa6";
import { redirectWithError } from "remix-toast";
import { fetchProducts, fetchUrlDetails } from "~/utils/server";
import HomeProducts from "../components/homePageProducts";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { username } = params;
  if (!username) {
    return redirectWithError("/", "This store does not exist");
  }
  const storeDetails = await fetchUrlDetails(request, username);
  if (!storeDetails || !storeDetails.url_details) {
    return redirectWithError("/", "This store does not exist");
  }
  const productDetails = await fetchProducts(request, storeDetails.id);
  return json({ storeDetails: storeDetails.url_details, productDetails });
};
export default function HomePage() {
  const { storeDetails, productDetails } = useLoaderData<typeof loader>();
  console.log("This is storedetails", storeDetails);
  return (
    <div className="w-full min-h-screen flex flex-col items-center ">
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit sm:text-xl md:text-2xl lg:text-3xl">
            {storeDetails!.store_name}
          </p>
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
        <img
          src={storeDetails!.homepage_coverimg}
          alt="shop"
          className="h-[50vh] w-full object-cover"
        />
        <img
          src={storeDetails!.homepage_logo}
          alt="bonton"
          className="absolute -bottom-8 xl:-bottom-[2vw] h-20 w-20 sm:w-[10vw] sm:h-[10vw] lg:w-[7vw] lg:h-[7vw] rounded-full transform -translate-x-1/2 left-1/2"
        />
      </div>
      <h1 className="mt-10 font-bold sm:text-2xl">
        {storeDetails!.store_name}
      </h1>
      <h3 className="text-green-500 sm:text-lg">Open till 6pm</h3>
      <p className="mx-3 sm:text-lg">{storeDetails!.description}</p>
      <p>{storeDetails!.phone_no}</p>
      <HomeProducts productDetails={productDetails} />
      <Link
        to={`https://wa.me/${
          storeDetails!.phone_no
        }?text=Hello%20I%20want%20to%20order%20some%20items`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4"
      >
        <Button
          color="success"
          startContent={<FaWhatsapp />}
          className="text-white rounded-full"
        >
          Message us
        </Button>
      </Link>
    </div>
  );
}
