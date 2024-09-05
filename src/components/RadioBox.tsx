import { Box, Edges, Html } from "@react-three/drei";
import { useState } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

interface RadioBoxProps {
	radio: {
		name: string;
		image: string;
		url: string;
	};
	index: number;
	playingRadio: string | null;
	handlePlayPause: (name: string) => void;
}

export function RadioBox({
	radio,
	index,
	playingRadio,
	handlePlayPause,
}: RadioBoxProps) {
	const [sizeBox, setSizeBox] = useState<number>(1);
	return (
		<Box
			rotation-y={degToRad(20)}
			args={[10, 3, 0.5]}
			position={[0, -4 * index, 0]}
			scale={sizeBox}
			onPointerEnter={() => setSizeBox(1.05)}
			onPointerLeave={() => setSizeBox(1)}>
			<meshPhongMaterial
				polygonOffset={true}
				transparent
				opacity={0.1}
				polygonOffsetFactor={-4000}
			/>
			<Edges
				polygonOffset={true}
				polygonOffsetFactor={-3000}
				linewidth={playingRadio === radio.name ? 3 : 1.5}
				scale={1}
				color={playingRadio === radio.name ? "pink" : "white"}
			/>

			<Html transform>
				<div className="columns-4 flex align-middle justify-around w-96 items-center">
					<div>
						<img
							className="w-auto h-24 aspect-square rounded-full"
							src={radio.image}
							onClick={() => window.open(radio.url)}
						/>
					</div>
					<div className="items-center flex flex-col">
						<h2 className="text-3xl">{radio.name}</h2>
					</div>
					<div className="items-center flex">
						<button
							className="bg-white-200"
							onClick={() => handlePlayPause(radio.name)}>
							{playingRadio === radio.name ? "⏸" : "▶"}
						</button>
					</div>
				</div>
			</Html>
		</Box>
	);
}
