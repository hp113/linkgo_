import {
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Snippet,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Link, Outlet } from "@remix-run/react";

import { HiOutlineGlobeAlt } from "react-icons/hi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";


export default function LandingPage() {
  return (
    <div className="flex w-full flex-col sm:items-center">
      <Navbar className="bg-gray-200">
        <NavbarBrand>
          <p className="font-bold text-inherit sm:text-2xl justify-start">link.go</p>
        </NavbarBrand>
        <NavbarContent justify="end" >
          <NavbarItem >
            <Avatar  src="https://i.pravatar.cc/150?u=a04258114e29026702d" size="lg"/>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="w-full px-6 sm:w-fit">

      <h1 className="font-bold mt-4 sm:text-xl">Hi Vima!!!</h1>

      <p className="sm:text-lg"> Your link.go URL</p>
      <Snippet symbol=""  variant={undefined} className="mt-2 text-blue-600"><Link to="/success">npm install @nextui-org/react</Link></Snippet>
      
      </div>
      <Tabs aria-label="Options" color="default" variant="underlined" className="px-3 my-2 ">
        <Tab
          key="details"
          className="sm:text-lg mt-2 sm:mt-4 sm:mb-2"
          title={
            <Link to="details" className="flex flex-col items-center">
                <HiOutlineGlobeAlt />


                <span className="mb-2 sm:mb-4 ">Details</span>

            </Link>
          }
        />
        <Tab
          key="analytics"
          className="sm:text-lg mt-2 sm:mt-4 sm:mb-2"
          title={
            <Link to="analytics" className="flex flex-col items-center">
                <TbBrandGoogleAnalytics />
                <span className="mb-2  sm:mb-4">Analytics</span>

            </Link>
          }
        />
        <Tab
          key="products"
          className="sm:text-lg mt-2 sm:mt-4 sm:mb-2"
          title={
            <Link to="products" className="flex flex-col items-center">
                <MdOutlineProductionQuantityLimits />

                <span className="mb-2 sm:mb-4">Products</span>

            </Link>
          }
        />
        
      </Tabs>
      <Outlet/>
    </div>
  );
}
