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
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";

import { HiOutlineGlobeAlt } from "react-icons/hi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const userId = (await supabaseClient.auth.getUser()).data.user?.id ?? "";
  const { data: user, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (user === null) return redirect("/");
  return json({ user });
};

export default function LandingPage() {
  const { user } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  return (
    <div className="flex w-full flex-col sm:items-center">
      <Navbar className="bg-gray-200">
        <NavbarBrand>
          <p className="font-bold text-inherit sm:text-2xl justify-start">
            link.go
          </p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Avatar src={user.avatar_url ?? ""} size="lg" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="w-full px-6 sm:w-fit">
        <h1 className="font-bold mt-4 sm:text-xl">Hi {user.full_name}!!!</h1>

        <p className="sm:text-lg"> Your link.go URL</p>
        <Snippet symbol="" variant={undefined} className="mt-2 text-blue-600">
          <Link to="/success">npm install @nextui-org/react</Link>
        </Snippet>
      </div>
      <Tabs
        selectedKey={pathname.split("/").at(-1) ?? "details"}
        aria-label="Options"
        color="default"
        variant="underlined"
        className="px-3 my-2 "
      >
        <Tab
          key="details"
          as={Link}
          className="sm:text-lg mt-2 sm:mt-4 sm:mb-2"
          //@ts-expect-error - `to` prop is missing
          to="details"
          title={
            <div className="flex flex-col items-center">
              <HiOutlineGlobeAlt />
              <span className="mb-2 sm:mb-4 ">Details</span>
            </div>
          }
        />
        <Tab
          as={Link}
          key="analytics"
          className="sm:text-lg mt-2 sm:mt-4 sm:mb-2"
          //@ts-expect-error - `to` prop is missing
          to="analytics"
          title={
            <div className="flex flex-col items-center">
              <TbBrandGoogleAnalytics />
              <span className="mb-2  sm:mb-4">Analytics</span>
            </div>
          }
        />
        <Tab
          as={Link}
          key="products"
          className="sm:text-lg mt-2 sm:mt-4 sm:mb-2 "
          //@ts-expect-error - `to` prop is missing
          to="products"
          title={
            <div className="flex flex-col items-center">
              <MdOutlineProductionQuantityLimits />
              <span className="mb-2 sm:mb-4">Products</span>
            </div>
          }
        />
      </Tabs>
      <Outlet />
    </div>
  );
}
