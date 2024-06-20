import { Button } from "@nextui-org/react";
import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";

function RelocateButton() {
	const map = useMap();

	return (
		<Control prepend position="topright">
			<Button color="secondary" onPress={() => map.locate()}>
				Relocate
			</Button>
		</Control>
	);
}

export default RelocateButton;
