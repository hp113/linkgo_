import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardBody,
	Divider,
	Image,
	Input,
	Spacer,
	Textarea,
} from "@nextui-org/react";
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
	redirect,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
	Form,
	isRouteErrorResponse,
	useLoaderData,
	useNavigation,
	useRouteError,
} from "@remix-run/react";
import { Controller } from "react-hook-form";
import { useRemixForm, validateFormData } from "remix-hook-form";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { ClientOnly } from "remix-utils/client-only";
import { toast } from "sonner";
import zod from "zod";
import LocationSelector from "~/components/LocationSelector.client";
import { createSupabaseServerClient } from "~/supabase.server";
import { fetchUrlDetails, getUser } from "~/utils/server";

export const addLocationSchema = zod.object({
	latitude: zod.coerce.number(),
	longitude: zod.coerce.number(),
	_action: zod.string(),
});

const schema = zod.object({
	username: zod.string().min(3),
	storeName: zod.string().min(3),
	bio: zod.string().min(3),
	phone_no: zod.string().min(10),
	homepage_coverimg: zod.any(),
	homepage_logo: zod.any(),
	_action: zod.string(),
});

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const user = await getUser(request);
	if (!("avatar_url" in user)) return user;

	const { urlId } = params;
	const storeDetails = await fetchUrlDetails(request, undefined, urlId);

	return json({ store: storeDetails });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const user = await getUser(request);
	if (!("avatar_url" in user)) return user;
	const { urlId } = params;
	if (!urlId) {
		return jsonWithError({ error: "Invalid URL ID" }, "Invalid URL ID", {
			status: 400,
		});
	}
	const { supabaseClient } = createSupabaseServerClient(request);
	const { count } = await supabaseClient
		.from("urls")
		.select("url_id")
		.eq("url_id", urlId)
		.single();
	if (count === 0) {
		return jsonWithError({ error: "Invalid URL ID" }, "Invalid URL ID", {
			status: 400,
		});
	}
	// Parse the incoming form data
	const formData = await unstable_parseMultipartFormData(
		request,
		unstable_createMemoryUploadHandler(),
	);

	const action = formData.get("_action");
	if (action === '"save"') {
		const { errors, data } = await validateFormData<zod.infer<typeof schema>>(
			formData,
			zodResolver(schema),
		);
		if (errors) {
			return json({ errors }, { status: 422 });
		}
		const {
			username,
			storeName,
			bio,
			phone_no,
			homepage_coverimg,
			homepage_logo,
		} = data;
		// Ensure homepage_coverimg and homepage_logo are File objects
		if (
			!(homepage_coverimg instanceof File) ||
			!(homepage_logo instanceof File)
		) {
			return jsonWithError(
				{ error: "Invalid file upload" },
				"Invalid file upload",
				{ status: 400 },
			);
		}
		const [coverImgResult, logoResult] = await Promise.all([
			supabaseClient.storage
				.from("services")
				.upload(`${urlId}/coverimg_${Date.now()}`, homepage_coverimg),
			supabaseClient.storage
				.from("services")
				.upload(`${urlId}/logo_${Date.now()}`, homepage_logo),
		]);

		if (coverImgResult.error || logoResult.error) {
			console.error(
				"Error uploading file",
				coverImgResult.error,
				logoResult.error,
			);
			return jsonWithError(
				{ error: "Cannot upload file" },
				"Invalid file upload",
				{ status: 500 },
			);
		}

		// Upsert data into Supabase table
		const response = await supabaseClient.from("url_details").upsert(
			{
				username: username.replace(/"/g, "").trim(),
				store_name: storeName.replace(/"/g, "").trim(),
				description: bio.replace(/"/g, "").trim() || "",
				phone_no: phone_no.replace(/"/g, "").trim(),
				url_id: urlId.replace(/"/g, "").trim(),
				homepage_coverimg: coverImgResult.data.path,
				homepage_logo: logoResult.data.path,
			},
			{ onConflict: "url_id" },
		);

		if (response.error) {
			return jsonWithError(
				{ error: response.error.message },
				response.error.message,
				{ status: 500 },
			);
		}

		return jsonWithSuccess(
			{ message: "Details added successfully" },
			"Details added successfully",
		);
	}

	if (action === '"locationChange"') {
		const { errors, data } = await validateFormData<
			zod.infer<typeof addLocationSchema>
		>(formData, zodResolver(addLocationSchema));
		if (errors) {
			return json({ errors }, { status: 422 });
		}
		const { latitude, longitude } = data;
		const location = `POINT(${longitude} ${latitude})`;
		const response = await supabaseClient
			.from("url_details")
			.update({ location })
			.eq("url_id", urlId);
		if (response.error) {
			return jsonWithError(
				{ error: response.error.message },
				response.error.message,
				{ status: 500 },
			);
		}
		return jsonWithSuccess(
			{ message: "Location added successfully" },
			"Location added successfully",
		);
	}

	return jsonWithError({ error: "Invalid action" }, "Invalid action", {
		status: 400,
	});
};

export default function Details() {
	const { store } = useLoaderData<typeof loader>();
	const storeDetails = store?.url_details;
	const { state } = useNavigation();

	const { formState, watch, handleSubmit, register, control } = useRemixForm<
		zod.infer<typeof schema>
	>({
		resolver: zodResolver(schema),
		submitConfig: { encType: "multipart/form-data" },
		defaultValues: {
			_action: "save",
			username: storeDetails?.username ?? "",
			storeName: storeDetails?.store_name ?? "",
			phone_no: storeDetails?.phone_no ?? "",
			bio: storeDetails?.description ?? "",
		},
	});
	const { errors } = formState;

	return (
		<div className="flex flex-col bg-gray-100 w-full min-h-screen items-center py-6 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
				<h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
					Basic Details
				</h1>
				<Form
					method="post"
					action="/landing.details"
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<CardBody className="space-y-6">
						<Input
							type="text"
							label="Username"
							placeholder="Enter your Username"
							className="w-full"
							{...register("username")}
							isInvalid={!!errors.username}
							errorMessage={errors.username?.message?.toString() || ""}
						/>
						<Input
							type="text"
							label="Store Name"
							placeholder="Enter Store Name"
							className="w-full"
							{...register("storeName")}
							isInvalid={!!errors.storeName}
							errorMessage={errors.storeName?.message || ""}
						/>
						<Input
							type="text"
							label="Phone Number"
							placeholder="Enter Phone Number"
							className="w-full"
							{...register("phone_no")}
							isInvalid={!!errors.phone_no}
							errorMessage={errors.phone_no?.message || ""}
						/>
						<Textarea
							label="Bio"
							placeholder="Enter your description"
							className="w-full"
							{...register("bio")}
							isInvalid={!!errors.bio}
							errorMessage={errors.bio?.message || ""}
						/>
						<div>
							<label
								htmlFor="home_coverimg"
								className="block text-sm font-medium text-gray-700"
							>
								Cover image
							</label>
							<Spacer y={0.5} />
							<Controller
								control={control}
								name={"homepage_coverimg"}
								rules={{ required: "Service image is required" }}
								render={({ field: { value, onChange, ...field } }) => {
									return (
										<input
											{...field}
											value={value?.fileName}
											accept="image/*"
											onChange={(event) => {
												onChange(event.target.files?.[0]);
											}}
											type="file"
											id="home_coverimg"
										/>
									);
								}}
							/>
							{/* {errors.homepage_coverimg?.message && <span className="text-red-500 text-sm">{String(errors.homepage_coverimg.message)}</span>} */}
							<Spacer y={1} />
							<div className="mt-4">
								<p className="text-sm  mb-2">Image Preview:</p>
								<div className=" bg-gray-300  w-[300px] h-[200px] rounded-2xl">
									<Image
										width={300}
										height={100}
										alt="HomePage cover Preview"
										src={
											watch("homepage_coverimg") &&
											URL.createObjectURL(watch("homepage_coverimg"))
										}
										className="border border-gray-300 rounded-2xl overflow-hidden w-[300px] h-[200px] object-cover"
									/>
								</div>
							</div>
						</div>
						<div>
							<label
								htmlFor="home_logo"
								className="block text-sm font-medium text-gray-700"
							>
								Company logo
							</label>
							<Spacer y={0.5} />
							<Controller
								control={control}
								name={"homepage_logo"}
								rules={{ required: "Service image is required" }}
								render={({ field: { value, onChange, ...field } }) => {
									return (
										<input
											{...field}
											value={value?.fileName}
											accept="image/*"
											onChange={(event) => {
												onChange(event.target.files?.[0]);
											}}
											type="file"
											id="home_logo"
										/>
									);
								}}
							/>
							{/* {errors.homepage_logo?.message && <span className="text-red-500 text-sm">{String(errors.homepage_logo.message)}</span>} */}
							<Spacer y={1} />
							<div className="mt-4">
								<p className="text-sm  mb-2">Image Preview:</p>
								<div className=" bg-gray-300 w-20 h-20 rounded-full">
									<Image
										// width={100}
										// height={100}
										alt="Service Preview"
										src={
											watch("homepage_logo") &&
											URL.createObjectURL(watch("homepage_logo"))
										}
										className="border border-gray-300 rounded-full overflow-hidden w-20 h-20 object-cover"
									/>
								</div>
							</div>
						</div>
						<div className="flex justify-end">
							<Button
								type="submit"
								color="primary"
								className="w-auto px-6"
								isLoading={state === "submitting"}
								isDisabled={!(state === "idle")}
							>
								Save
							</Button>
						</div>
					</CardBody>
				</Form>
				<Divider />
				<ClientOnly>{() => <LocationSelector />}</ClientOnly>
			</Card>
		</div>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		toast.error(error.data);
		return redirect("/landing");
	}
	return redirect("/landing");
}
