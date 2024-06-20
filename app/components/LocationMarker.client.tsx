import { LatLng, divIcon } from "leaflet";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FaMapMarkerAlt } from "react-icons/fa";
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
			setPosition(e.latlng);
			map.flyTo(e.latlng, map.getZoom());
		},
	});

	useEffect(() => {
		if (isFixed) return;
		map.locate({ enableHighAccuracy: true, watch: true });
	}, [map, isFixed]);

	const icon = divIcon({
		html: renderToStaticMarkup(
			<FaMapMarkerAlt className="w-8 h-8 shadow-xl" />,
		),
		iconSize: [30, 30],
		className: "bg-transparent grid place-items-center",
	});
	return position === null ? null : (
		<Marker position={position} icon={icon}>
			{!isFixed && <LocationForm position={position} />}
			<Popup>You are here</Popup>
		</Marker>
	);
}
