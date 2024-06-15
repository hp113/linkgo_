import { LoaderFunctionArgs } from "@remix-run/node";
import { getUser } from "~/utils/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getUser(request);
  return null;
};

export default function Analytics() {
  return <div>Hello from Analytics</div>;
}
