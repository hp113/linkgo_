import { useEffect } from "react";
import { useRemixFormContext } from "remix-hook-form";

function LocationForm({
	position,
}: { position: { lat: number; lng: number } }) {
	const { reset, getValues, formState } = useRemixFormContext();
	console.log(getValues());
	useEffect(() => {
		reset(
			{
				latitude: position.lat,
				longitude: position.lng,
				_action: "locationChange",
			},
			{},
		);
	}, [reset, position]);

	return null;
}

export default LocationForm;
