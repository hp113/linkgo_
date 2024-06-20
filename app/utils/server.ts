import { redirectWithError } from "remix-toast";
import { createSupabaseServerClient } from "../supabase.server";
import type { Database } from "../types/supabase";

export const fetchUrlDetails = async (
	request: Request,
	url?: string,
	url_id?: string,
) => {
	if (!url && !url_id) {
		throw new Error("Either url or url_id must be provided");
	}
	const { supabaseClient } = createSupabaseServerClient(request);

	const query = supabaseClient.from("urls").select("*, url_details(*)");
	let transformedQuery = null;
	if (url_id) {
		transformedQuery = query.eq("id", url_id);
	} else if (url) {
		transformedQuery = query.eq("url", url);
	}
	if (!transformedQuery) {
		throw new Error("Error transforming query");
	}
	const { data, error } = await transformedQuery.single();
	if (error) {
		console.error("Error fetching URL details:", error);
		throw new Error("Error fetching URL details");
	}
	if (!data) {
		return null;
	}

	if (data.url_details) {
		const coverImgPublicUrl = supabaseClient.storage
			.from("services")
			.getPublicUrl(data.url_details.homepage_coverimg);

		const logoPublicUrl = supabaseClient.storage
			.from("services")
			.getPublicUrl(data.url_details.homepage_logo);

		if (!coverImgPublicUrl.data || !logoPublicUrl.data) {
			console.error(
				"Error fetching public URL for",
				data.url_details.homepage_coverimg,
				data.url_details.homepage_logo,
			);
			throw new Error("Error fetching public URL");
		}

		data.url_details.homepage_coverimg = coverImgPublicUrl.data.publicUrl;
		data.url_details.homepage_logo = logoPublicUrl.data.publicUrl;
	}
	// Return the modified data object
	return {
		...data,
	};
};

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
// Function to fetch data from products table
export const fetchProducts = async (
	request: Request,
	urlId: string,
): Promise<ProductRow[]> => {
	const { supabaseClient } = createSupabaseServerClient(request);
	const { data, error } = await supabaseClient
		.from("products")
		.select("*")
		.eq("url_id", urlId);

	if (error) {
		console.error("Error fetching products:", error);
		throw new Error("Error fetching products");
	}

	if (!data) {
		return [];
	}
	const dataWithPublicUrl = data.map((item) => {
		const { data: publicUrlData } = supabaseClient.storage
			.from("services")
			.getPublicUrl(item.service_logo);

		if (!publicUrlData) {
			console.error("Error fetching public URL for", item.service_logo);
			throw new Error("Error fetching public URL");
		}

		return {
			...item,
			service_logo: publicUrlData.publicUrl,
		};
	});

	return dataWithPublicUrl;
};

export async function getUser(request: Request, redirectPath?: string) {
	const { supabaseClient } = createSupabaseServerClient(request);
	const {
		data: { user },
		error: userError,
	} = await supabaseClient.auth.getUser();
	if (userError || !user) {
		console.error("Error fetching user:", userError);
		return redirectWithError(redirectPath ?? "/", "Please log in to continue");
	}
	const { data, error } = await supabaseClient
		.from("profiles")
		.select()
		.eq("id", user.id)
		.single();
	if (error) {
		console.error("Error fetching user profile:", error);
		return redirectWithError(redirectPath ?? "/", "Please log in to continue");
	}
	return data;
}

export function combineHeaders(
	...headers: Array<ResponseInit["headers"] | null | undefined>
) {
	const combined = new Headers();
	for (const header of headers) {
		if (!header) {
			continue;
		}
		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value);
		}
	}
	return combined;
}
