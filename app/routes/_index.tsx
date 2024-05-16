import { Image } from "@nextui-org/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import LandingForm from "~/components/LandingForm";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = () => {
  console.log("hello");
  return {};
};

export default function Index() {
  return (
    <main className="bg-dark h-screen w-screen flex items-center justify-center flex-col bg-black">
      <div className="w-[96%] justify-between flex items-center rounded-[3rem] py-3 absolute sm:top-4 top-2 z-[9999999999] mdpx-12 sm:px-6 px-3 mx-auto bg-white bg-opacity-[0.1] border backdrop-blur-xl hover:glow-white">
        <Link to={"/"}>
          <Image
            src={"https://linktree.sirv.com/Images/logo-icon.svg"}
            alt="logo"
            height={25}
            width={25}
            className="filter invert"
          />
        </Link>

        <Link
          to={"/sign-in"}
          className="p-3 sm:px-6 px-3 bg-themeGreen flex items-center gap-2 rounded-3xl cursor-pointer hover:scale-105 hover:bg-gray-100 active:scale-90"
        >
          Login
        </Link>
      </div>
      <LandingForm />
    </main>
  );
}
