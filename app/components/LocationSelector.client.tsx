import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import type { z } from "zod";
import {
	addLocationSchema,
	type action,
	type loader,
} from "~/routes/dashboard.$urlId.details";
import LocationMarker from "./LocationMarker.client";
import RelocateButton from "./RelocateButton.client";

export interface Geometry {
	crs: Crs;
	type: string;
	coordinates: number[];
}
export interface Crs {
	type: string;
	properties: Properties;
}
export interface Properties {
	name: string;
}

type FormData = z.infer<typeof addLocationSchema>;

export default function LocationSelector() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { store } = useLoaderData<typeof loader>();
	const storeDetails = store?.url_details;
	const resolver = zodResolver(addLocationSchema);

	const location = storeDetails?.location as Geometry | null;
	const methods = useRemixForm<FormData>({
		mode: "onSubmit",
		resolver,
		defaultValues: {
			_action: "locationChange",
			latitude: location?.coordinates[1] ?? 0,
			longitude: location?.coordinates[0] ?? 0,
		},
		submitConfig: {
			encType: "multipart/form-data",
		},
	});
	const {
		handleSubmit,
		formState: { errors },
		reset,
	} = methods;

	const actionData = useActionData<typeof action>();
	useEffect(() => {
		if (actionData) {
			if ("message" in actionData) {
				reset();
				onClose();
			}
		}
	}, [actionData, onClose, reset]);
	const { state } = useNavigation();
	return (
		<div className="flex items-center flex-row-reverse pt-5 justify-evenly">
			<Button color="primary" onPress={onOpen}>
				{storeDetails?.location ? "Change location" : "Add location"}
			</Button>
			{!!location && (
				<MapContainer
					key={location.coordinates.join("")}
					center={{
						lat: location.coordinates[1],
						lng: location.coordinates[0],
					}}
					bounds={[[location.coordinates[1], location.coordinates[0]]]}
					scrollWheelZoom={false}
					className="h-[250px] w-[250px] relative rounded-md shadow-md z-0"
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					<LocationMarker
						lat={location.coordinates[1]}
						lng={location.coordinates[0]}
						isFixed
					/>
				</MapContainer>
			)}
			<RemixFormProvider {...methods}>
				<Modal size="full" isOpen={isOpen} onClose={onClose}>
					<ModalContent as={Form} method="post" onSubmit={handleSubmit}>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">
									Select a location
								</ModalHeader>
								<ModalBody>
									{errors && (
										<span className="text-sm text-danger">
											{errors.latitude &&
												`Longitude: ${errors.latitude?.message}`}
											<br />
											{errors.longitude &&
												`Longitude: ${errors.longitude?.message}`}{" "}
										</span>
									)}
									<MapContainer
										center={{
											lat: location?.coordinates[1] ?? 10.1632,
											lng: location?.coordinates[0] ?? 76.6413,
										}}
										bounds={[
											[
												location?.coordinates[1] ?? 10.1632,
												location?.coordinates[0] ?? 76.6413,
											],
										]}
										scrollWheelZoom={false}
										className="h-full w-[full] relative rounded-md shadow-md"
									>
										<TileLayer
											attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
											url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										/>

										<LocationMarker
											lat={location?.coordinates[1] ?? 10.1632}
											lng={location?.coordinates[0] ?? 76.6413}
										/>
										<RelocateButton />
									</MapContainer>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Close
									</Button>

									<Button
										color="primary"
										type="submit"
										isLoading={state === "submitting"}
										isDisabled={state === "submitting"}
									>
										Save
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</RemixFormProvider>
		</div>
	);
}
