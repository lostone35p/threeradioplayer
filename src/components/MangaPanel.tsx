import useRandomPanel from "../hooks/useRandomPanel";
import { Circle, Text, Image } from "@react-three/drei";
import React, { useMemo } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

const MangaPanel = React.memo(() => {
	const { randomPanel, isLoading, isError, refetch } = useRandomPanel();

	const content = useMemo(() => {
		if (isLoading) return <Text>Loading...</Text>;
		if (isError) return <Text>Error loading manga panel</Text>;

		const imageUrl = randomPanel?.image_url || "/fallback/erika.png";

		return (
			<group>
				<Image
					position={[0, 6, 0]}
					url={imageUrl}
					scale={[12, 6]}
					rotation-y={degToRad(90)}
				/>
				<group position={[0, 2.5, 0]} rotation-y={degToRad(90)}>
					<Text position={[0, -0.5, 0]} fontSize={0.25}>
						Refetch Panel
					</Text>
					<Circle onClick={() => refetch()} scale={0.2}></Circle>
				</group>
			</group>
		);
	}, [randomPanel, isLoading, isError, refetch]);

	return content;
});

export default MangaPanel;
