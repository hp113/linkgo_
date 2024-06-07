import {
  Avatar,
  Button,
  Chip,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Snippet,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Link, Outlet } from "@remix-run/react";

import React from "react";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { MdAlbum } from "react-icons/md";
import { RxVideo } from "react-icons/rx";
import { TbBrandGoogleAnalytics } from "react-icons/tb";


export default function LandingPage() {
  return (
    <div className="flex w-full flex-col sm:items-center">
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit sm:text-xl justify-start">link.go</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="w-full px-6 sm:w-fit">

      <h1 className="font-bold">Hi Vima!!!</h1>

      <p>Your link.go URL</p>
      <Snippet symbol=""  variant={undefined}>npm install @nextui-org/react</Snippet>
      </div>
      <Tabs aria-label="Options" color="default" variant="underlined" className="px-3 my-2">
        <Tab
          key="photos"
          title={
            <Link to="details" className="flex flex-col items-center">
                <HiOutlineGlobeAlt />


                <span className="mb-2">Details</span>

            </Link>
          }
        />
        <Tab
          key="music"
          title={
            <Link to="analytics" className="flex flex-col items-center">
                <TbBrandGoogleAnalytics />
                <span className="mb-2">Analytics</span>

            </Link>
          }
        />
        
      </Tabs>
      <Outlet/>
    </div>
  );
}
