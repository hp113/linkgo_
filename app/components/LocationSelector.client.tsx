import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker.client";

export default function LocationSelector() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Button color="primary" onPress={onOpen}>
				Action
			</Button>
			<Modal size="full" isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Select a location
							</ModalHeader>
							<ModalBody>
								<MapContainer
									center={{ lat: 51.505, lng: -0.09 }}
									zoom={13}
									scrollWheelZoom={false}
									className="h-full w-full relative"
								>
									<TileLayer
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>
									<LocationMarker />
								</MapContainer>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
