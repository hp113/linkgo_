import { LoaderFunctionArgs } from "@remix-run/node";
import { getUser } from "~/utils/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getUser(request);
  return null;
};

export default function Analytics() {
  return (
    <div>
      <h1 className="font-bold text-xl text-center">Coming soon!!!</h1>
    </div>
  );
}
