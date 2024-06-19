import { Link, Tab, Tabs } from "@nextui-org/react";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import {
	Outlet,
	Link as RemixLink,
	useLoaderData,
	useLocation,
} from "@remix-run/react";

import { HiOutlineGlobeAlt } from "react-icons/hi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { redirectWithError } from "remix-toast";
import { createSupabaseServerClient } from "~/supabase.server";
import { getUser } from "~/utils/server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const user = await getUser(request);
	if (!("avatar_url" in user)) return user;
	const { supabaseClient } = createSupabaseServerClient(request);
	const { urlId } = params;
	if (!urlId) return redirectWithError("/dashboard", "URL not found");

	const { data, error: urlError } = await supabaseClient
		.from("urls")
		.select()
		.eq("id", urlId)
		.single();
	if (urlError || !data)
		return redirectWithError("/dashboard", "URL not found");
	return json({ url: data });
};

export default function LandingPage() {
	const { url } = useLoaderData<typeof loader>();
	const { pathname } = useLocation();

	return (
		<div className="flex flex-col">
			<p className="sm:text-lg"> Your link.go URL</p>
			<Link isExternal showAnchorIcon href={`/page/${url.url}`}>
				{url.url}.link.ho
			</Link>
			<Tabs
				selectedKey={pathname.split("/").at(-1) ?? "details"}
				aria-label="Options"
				color="default"
				variant="underlined"
				className="px-3 my-2 sm:flex sm:items-center sm:justify-center"
			>
				<Tab
					key="details"
					as={RemixLink}
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
					as={RemixLink}
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
				<Tab
					as={RemixLink}
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
			</Tabs>
			<Outlet />
		</div>
	);
}
