import { Image, Text } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { radioApi } from "./radioInterfaces";
import { Suspense } from "react";

const CoverArt: React.FC<{ props: radioApi }> = ({ props }) => {
	const imageUrl = `https://r-a-d.io/api/dj-image/${props.main.dj.djimage}`;

	return (
		<Suspense>
			<group position={[0.5, 6, -7.8]} rotation-y={degToRad(90)}>
				<Image scale={3} url={imageUrl} />
				<Text position={[0, -2, 0]} fontSize={0.5}>
					{props.main.dj.djname}
				</Text>
			</group>
		</Suspense>
	);
};

export default CoverArt;
