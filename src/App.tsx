import {
	Billboard,
	Box,
	Html,
	OrbitControls,
	PerspectiveCamera,
	ScreenSizer,
	ScreenSpace,
	Scroll,
	ScrollControls,
	Text,
	useTexture,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Stage from "./Stage";
import { Suspense, useRef } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

import {
	radioList,
	radioApi,
	doujinDanceApi,
	doujinStyleApi,
} from "./radioInterfaces";

const panningMax = (value: number): number => {
	if (value > 30) {
		return Math.floor(value) - 3;
	}
	if (value < -30) {
		return Math.floor(value) + 3;
	}

	return value;
};

interface CurrentlyPlayingProps {
	props: string;
}

export function CurrentlyPlaying({ props }: CurrentlyPlayingProps) {
	return (
		<Text
			anchorX={"center"}
			anchorY={"middle"}
			rotation-y={degToRad(90)}
			position={[0, 63, 0]}
			fontSize={4}>
			{props}
			{/* <meshBasicMaterial attach="material" color="white">
				<RenderTexture attach={"map"}>
					<color attach={"background"} args={["#fff"]} />
					<Stage scale={2} />
				</RenderTexture>
			</meshBasicMaterial> */}
		</Text>
	);
}

function SongPicker() {
	const boxTexture = useTexture("/Textures/boxTexture.jpg");

	return (
		<ScreenSpace depth={20}>
			<ScreenSizer scale={5}>
				<Billboard follow={false} position={[-20, 10, 1]} castShadow={true}>
					<ScrollControls
						pages={1.5}
						damping={0.05}
						maxSpeed={0.05}
						distance={0.01}>
						<Scroll>
							<group>
								{radioList.map((radio, index) => (
									<Box
										rotation-y={degToRad(20)}
										args={[10, 3, 0.5]}
										position={[0, -4 * index, 0]}
										key={index}>
										<Html transform occlude>
											<div
												className="columns-4 flex align-middle justify-around w-96 items-center"
												onPointerDown={(e) => e.stopPropagation()}>
												<div>
													<img
														className=" w-20 h-20 rounded-full"
														src={radio.image}
													/>
												</div>
												<div className=" items-center flex flex-col">
													<h2 className=" text-3xl">{radio.name}</h2>
													<p>Playing: </p>
												</div>
												<div className=" items-center flex">
													<h1>⏯</h1>
												</div>
											</div>
										</Html>
										<meshStandardMaterial
											depthTest={false}
											map={boxTexture}
											emissive={"pink"}
											emissiveIntensity={0.5}
											toneMapped={false}
										/>
									</Box>
								))}
							</group>
						</Scroll>
					</ScrollControls>
				</Billboard>
			</ScreenSizer>
		</ScreenSpace>
	);
}

function App() {
	const controls = useRef<any>();

	return (
		<div className="flex h-lvh w-lvw">
			<Canvas>
				<OrbitControls
					ref={controls}
					onChange={() => {
						controls.current.target.x = panningMax(controls.current.target.x);
						controls.current.target.y = panningMax(controls.current.target.y);
						controls.current.target.z = panningMax(controls.current.target.z);
					}}
					enableZoom={false}
					maxPolarAngle={Math.PI / 2.2}
					minPolarAngle={Math.PI / 4}
					maxAzimuthAngle={Math.PI / 1.5}
					minAzimuthAngle={Math.PI / 3.2}
					panSpeed={0.05}
					rotateSpeed={0.05}
				/>
				<PerspectiveCamera
					position={[25, 10, 0]}
					fov={45}
					makeDefault></PerspectiveCamera>
				<directionalLight position={[0, 30, 0]} intensity={2} />
				<SongPicker />
				<CurrentlyPlaying props="Currently Playing:" />
				<Stage scale={0.1} />
			</Canvas>
		</div>
	);
}

export default App;
