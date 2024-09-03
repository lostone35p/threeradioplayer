import useRandomPanel from "../hooks/useRandomPanel";
import { Circle, Text, Image } from "@react-three/drei";
import { useRef } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

function MangaPanel() {
	const { data, refetch } = useRandomPanel();

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
			<group position={[0, 8.5, -5.4]} rotation-y={degToRad(90)}>
				<Circle onClick={() => refetch()} scale={0.2}></Circle>
				<Text position={[0.5, -1, 0]} fontSize={0.3}>
					{" "}
					^ {"\n"} Refetch {"\n"} Panel
				</Text>
			</group>
		</mesh>
	);
}

export default MangaPanel;
