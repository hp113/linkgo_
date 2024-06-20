import { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import LocationForm from "./LocationForm.client";
export default function LocationMarker({
	lat,
	lng,
	isFixed = false,
}: { lat: number; lng: number; isFixed?: boolean }) {
	const [position, setPosition] = useState<LatLng>(new LatLng(lat, lng));
	const map = useMapEvents({
		click(e) {
			if (isFixed) return;
			setPosition(e.latlng);
		},
		locationfound(e) {
			if (isFixed) return;
			console.log("Location found", e.latlng);
			setPosition(e.latlng);
			map.flyTo(e.latlng, map.getZoom());
		},
	});

	useEffect(() => {
		if (isFixed) return;
		map.locate({ enableHighAccuracy: true, watch: true });
	}, [map, isFixed]);

	return position === null ? null : (
		<Marker position={position}>
			{!isFixed && <LocationForm position={position} />}
			<Popup>You are here</Popup>
		</Marker>
	);
}
