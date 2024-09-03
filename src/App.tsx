import {
	OrbitControls,
	PerformanceMonitor,
	PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Stage from "./Stage";
import { Suspense, useRef, useState } from "react";
import { SongPicker } from "./SongPicker";
import {
	Bloom,
	DepthOfField,
	EffectComposer,
	Scanline,
	Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const panningMax = (value: number): number => {
	if (value > 30) {
		return Math.floor(value) - 3;
	}
	if (value < -30) {
		return Math.floor(value) + 3;
	}

	return value;
};

function App() {
	const controls = useRef<any>();
	const [dpr, setDpr] = useState(1);
	return (
		<div className="flex h-lvh w-lvw">
			<Suspense fallback={"Loading..."}>
				<Canvas dpr={dpr}>
					<PerformanceMonitor
						onIncline={() => setDpr(1.2)}
						onDecline={() => setDpr(0.7)}>
						<OrbitControls
							ref={controls}
							onChange={() => {
								controls.current.target.x = panningMax(
									controls.current.target.x
								);
								controls.current.target.y = panningMax(
									controls.current.target.y
								);
								controls.current.target.z = panningMax(
									controls.current.target.z
								);
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
						<directionalLight position={[0, 30, 0]} intensity={3} />
						<Effects />
						<Stage scale={0.1} />
						<SongPicker />
						{/* <group scale={0.1} position={[10, 1.8, 0]}>
					<Avatar />
				</group> */}
					</PerformanceMonitor>
				</Canvas>
			</Suspense>
		</div>
	);
}

export const Effects = () => {
	return (
		<EffectComposer>
			<Scanline
				blendFunction={BlendFunction.MULTIPLY}
				density={1}
				scrollSpeed={0.01}
				opacity={0.3}
			/>
			<DepthOfField
				focusDistance={0}
				focalLength={0.05}
				bokehScale={2}
				height={300}
			/>
			<Vignette eskil={true} offset={1} darkness={1.1} />
			<Bloom
				intensity={0.4}
				luminanceThreshold={0.3}
				luminanceSmoothing={0.5}
				height={300}
			/>
		</EffectComposer>
	);
};
export default App;
