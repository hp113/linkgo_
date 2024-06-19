import type { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
export default function LocationMarker() {
	const [position, setPosition] = useState<LatLng>();
	const map = useMapEvents({
		load() {
			map.locate();
		},
		click() {
			map.locate();
		},
		locationfound(e) {
			console.log("Location found", e.latlng);
			setPosition(e.latlng);
			map.flyTo(e.latlng, map.getZoom());
		},
	});

	useEffect(() => {
		map.locate({ enableHighAccuracy: true, watch: true });
	}, [map]);

	return position === null ? null : (
		<Marker position={position ?? [0, 0]}>
			<Popup>You are here</Popup>
		</Marker>
	);
}
