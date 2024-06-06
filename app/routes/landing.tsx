import {
  Avatar,
  Button,
  Chip,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Link, Outlet } from "@remix-run/react";

import React from "react";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { MdAlbum } from "react-icons/md";
import { RxVideo } from "react-icons/rx";


export default function LandingPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit sm:text-xl">link.go</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Tabs aria-label="Options" color="primary" variant="underlined">
        <Tab
          key="photos"
          title={
            <Link to="photos">
                <div className="flex items-center space-x-2">
                <BiSolidPhotoAlbum />

                <span>Photos</span>
                </div>

            </Link>
          }
        />
        <Tab
          key="music"
          title={
            <Link to="music">
                <div className="flex items-center space-x-2">
                <BsMusicNoteBeamed />

                <span>Music</span>
                </div>
            </Link>
          }
        />
        <Tab
          key="videos"
          title={
            <Link to="videos">
                <div className="flex items-center space-x-2">
                <RxVideo />
                <span>Videos</span>
                </div>
            </Link>
          }
        />
        <Tab
          key="album"
          title={
            <Link to="album">

            <div className="flex items-center space-x-2">
            <MdAlbum />
              <span>Album</span>
            </div>
            </Link>
          }
        />
      </Tabs>
      <Outlet/>
    </div>
  );
}
