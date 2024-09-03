import useRandomPanel from "../hooks/useRandomPanel";
import { Image, Html } from "@react-three/drei";
import { useRef } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

function MangaPanel() {
	const { data } = useRandomPanel();

	const imageUrl = data?.randomPanel?.image_url || "/fallback/erika.png";

	const ref = useRef<any>();
	console.log(ref.current);
	return (
		<mesh>
			<Image
				ref={ref}
				position={[0, 6.3, 0]}
				url={imageUrl}
				scale={[10, 5]}
				rotation-y={degToRad(90)}
			/>
		</mesh>
	);
}

export function Loadingimage() {
	const imageUrl = "/fallback/erika.png";

	return (
		<mesh>
			<Image
				position={[0, 6.3, 0]}
				url={imageUrl}
				scale={[10, 5]}
				rotation-y={degToRad(90)}
			/>
		</mesh>
	);
}

export default MangaPanel;
