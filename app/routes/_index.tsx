import { Button, Image, User } from "@nextui-org/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { clsx } from "clsx";
import { FormEvent, useState } from "react";
import { FaArrowUp, FaSpinner, FaX } from "react-icons/fa6";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { createSupabaseServerClient } from "~/supabase.server";
import { Database } from "~/types/supabase";

enum AvailableStatus {
  IDLE,
  AVAILABLE,
  NOT_AVAILABLE,
}

const SUBDOMAIN_REGEX = /[^a-zA-Z0-9-]/g;
export const meta: MetaFunction = () => {
  return [
    { title: "LinkGo" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const userId = (await supabaseClient.auth.getUser()).data.user?.id ?? "";
  const { data: user } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  let status = AvailableStatus.IDLE;
  const query = new URL(request.url).searchParams.get("store_name") ?? "";
  if (!query.match(/^[a-zA-Z][a-zA-Z0-9-]*$/)) return { status, user };
  if (query.trim().length < 4) return { status, user };
  const { count } = await supabaseClient
    .from("urls")
    .select("*", { count: "exact" })
    .eq("url", query);
  if (count !== 0) {
    status = AvailableStatus.NOT_AVAILABLE;
  } else {
    status = AvailableStatus.AVAILABLE;
  }
  return { status, user };
};

export default function Index() {
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(
    searchParams.get("store_name")?.replace(SUBDOMAIN_REGEX, "") ?? ""
  );
  const { state } = useNavigation();
  const navigate = useNavigate();
  const debounced = useDebouncedCallback(
    // function
    (value: string) => {
      // replace space, special characters and
      setSearchParams({
        store_name: value.replace(SUBDOMAIN_REGEX, ""),
      });
    },
    // delay in ms
    500
  );
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const storeName = (searchParams.get("store_name") ?? "").replace(
      SUBDOMAIN_REGEX,
      ""
    );
    if (storeName.trim() === "") return;
    if (!user) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${
            process.env.VERCEL_URL ?? "http://localhost:5173"
          }/auth/callback?redirect=${encodeURI(
            "/create?store_name=" + storeName
          )}`,
        },
      });
      if (error) {
        toast.error("Error signing in: " + error.message);
        console.error(error);
      }
    } else {
      return navigate("/create?store_name=" + storeName);
    }
  };

  const { status, user } = useLoaderData<typeof loader>();
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

        {!user ? (
          <Form method="post" action="/sign-in">
            <Button
              type="submit"
              className="p-3 sm:px-6 px-3 bg-gray-200 flex items-center gap-2 rounded-3xl cursor-pointer hover:scale-105 hover:bg-gray-100 active:scale-90"
            >
              Login
            </Button>
          </Form>
        ) : (
          <div className="flex gap-5">
            <User
              className="text-white"
              name={user.full_name}
              avatarProps={{
                src: user.avatar_url ?? undefined,
              }}
            />
            <Button
              as={Link}
              to="/dashboard"
              className="p-3 sm:px-6 px-3 bg-gray-200 flex items-center gap-2 rounded-3xl cursor-pointer hover:scale-105 hover:bg-gray-100 active:scale-90"
            >
              Dashboard
            </Button>
          </div>
        )}
      </div>
      <div className="w-fit h-fit z-10" id="container">
        <form
          className="flex items-center justify-center flex-col"
          onSubmit={handleSubmit}
          id="inner"
        >
          <div className="text-[2.15rem] sm:text-[3rem] md:text-[4rem] font-bold text-white z-10 mb-4 max-w-[70vw] text-center">
            The Only Link You&apos;ll Ever Need
          </div>
          <div className="max-w-[60vw] text-center font-semibold text-sm sm:text-lg opacity-80 z-10 text-white mb-8">
            connect your audience to all of your content with one link
          </div>
          <div
            className={`flex items-stretch gap-2 relative filter `}
            id="input"
          >
            <div
              className={`flex items-center rounded-l-xl bg-white px-6 text-sm md:text-2xl sm:text-md transition-all ${clsx(
                {
                  "border-green-500 border-[2px]":
                    status == AvailableStatus.AVAILABLE,
                  "border-red-500 border-[2px]":
                    status == AvailableStatus.NOT_AVAILABLE,
                  "border-gray-500 border-[2px]":
                    status == AvailableStatus.IDLE,
                }
              )}`}
            >
              <input
                type="text"
                className="bg-transparent peer py-5 px-2 outline-none border-none md:w-auto w-[8rem]"
                placeholder=""
                value={query.replace(SUBDOMAIN_REGEX, "")}
                onChange={(e) => {
                  const value = e.target.value.replace(SUBDOMAIN_REGEX, "");
                  setQuery(value);
                  debounced(value);
                }}
                required
                name="store_name"
                pattern="[a-zA-Z0-9][a-zA-Z0-9-_]*"
              />
              <span className="opacity-40 font-semibold">.link.go</span>
            </div>
            <button
              className={`px-4 grid place-items-center  transition-all ${clsx({
                "bg-green-500": status == AvailableStatus.AVAILABLE,
                "bg-red-500 ": status == AvailableStatus.NOT_AVAILABLE,
                "bg-gray-500": status == AvailableStatus.IDLE,
              })} disabled:opacity-50 rounded-r-xl font-semibold cursor-pointer enabled:hover:scale-110 active:scale-95 active:opacity-80 uppercase text-sm md:text-lg sm:text-md`}
              disabled={
                status == AvailableStatus.NOT_AVAILABLE ||
                state == "loading" ||
                state == "submitting"
              }
            >
              <span className="nopointer text-white">
                {state == "loading" ? (
                  <FaSpinner className="animate-spin" />
                ) : status == AvailableStatus.NOT_AVAILABLE ? (
                  <FaX />
                ) : (
                  <FaArrowUp />
                )}
              </span>
            </button>
          </div>
          {status !== AvailableStatus.IDLE && (
            <p
              className={`mt-2 text-sm md:text-lg sm:text-md ${clsx({
                "text-green-500": status === AvailableStatus.AVAILABLE,
                "text-red-500": status === AvailableStatus.NOT_AVAILABLE,
              })}`}
            >
              {status === AvailableStatus.NOT_AVAILABLE
                ? "This URL is already taken"
                : "This URL is available"}
            </p>
          )}
          {/* {hasError === 1 && <div className="p-4 max-w-[70vw] text-center text-red-500 filter drop-shadow-md shadow-white text-sm">{errorMessage}</div>} */}
        </form>
      </div>
    </main>
  );
}
