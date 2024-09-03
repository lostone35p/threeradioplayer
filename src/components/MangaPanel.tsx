import useRandomPanel from "../hooks/useRandomPanel";
import { Circle, Text, Image } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

function MangaPanel() {
	const { data, isLoading, isError, refetch } = useRandomPanel();

	const imageUrl = data?.randomPanel?.image_url || "/fallback/erika.png";

	if (isLoading) return <Text>Loading...</Text>;
	if (isError) return <Text>Error loading manga panel</Text>;
	return (
		<mesh>
			<Image
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
