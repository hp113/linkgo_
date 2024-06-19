import {
	Avatar,
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await getUser(request);
	if ("avatar_url" in user) {
		return json({ user: user });
	}
	// This means the session does not exist now and we should redirect to the login page
	console.log("User not found");
	return user;
};

const Dashboard = () => {
	const { user } = useLoaderData<typeof loader>();

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
						<form method="post" action="/sign-out">
							<Button type="submit">Sign Out</Button>
						</form>
					</NavbarItem>
					<NavbarItem>
						<Avatar
							src={user.avatar_url ?? undefined}
							name={user.full_name ?? undefined}
							size="lg"
						/>
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			<div className="w-full px-6 sm:w-3/4">
				<h1 className="font-bold mt-4 sm:text-xl">Hi {user.full_name}!!!</h1>

				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;
