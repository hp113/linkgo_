import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { createSupabaseServerClient } from "./supabase.server";
import { NextUIProvider, Progress } from "@nextui-org/react";
import type { LinksFunction } from "@remix-run/node";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { getToast } from "remix-toast";
import { Toaster, toast as notify } from "sonner";
import stylesheet from "~/tailwind.css?url";
import { combineHeaders } from "./utils/server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    BASE_URL: process.env.VERCEL_URL ?? "http://localhost:5173",
  };

  const supabase = createSupabaseServerClient(request);

  const {
    data: { session },
  } = await supabase.supabaseClient.auth.getSession();
  const { toast, headers } = await getToast(request);

  return json(
    {
      env,
      session,
      toast,
    },
    {
      headers: combineHeaders(supabase.headers, headers),
    }
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { state } = useNavigation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className=" font-satoshi">
        <NextUIProvider navigate={navigate}>
          <Progress
            isIndeterminate={state === "loading" || state === "submitting"}
            className={`z-50 fixed top-0 ${
              state === "loading" || state === "submitting"
                ? "opacity-1"
                : "opacity-0"
            }`}
            size="sm"
          />
          {children}
        </NextUIProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: { BASE_URL: data.env.BASE_URL },
            })}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== "INITIAL_SESSION" &&
        session?.access_token !== serverAccessToken
      ) {
        // server and client are out of sync.
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, revalidate]);

  const { toast } = useLoaderData<typeof loader>();
  // Hook to show the toasts
  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.success(toast.message);
    }
  }, [toast]);

  return (
    <>
      <Outlet context={{ supabase }} />
      <Toaster position="bottom-right" richColors />
    </>
  );
}
