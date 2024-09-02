import {
	useTexture,
	ScreenSpace,
	ScreenSizer,
	Billboard,
	ScrollControls,
	Scroll,
	Box,
	Text,
	Html,
	Image,
} from "@react-three/drei";
import { useState, useEffect, useRef, useMemo } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { audioController } from "./audioController";
import { radioList } from "./radioInterfaces";

import { useQuery } from "react-query";
import axios from "axios";
import {
	radioApi,
	gensokyoApi,
	doujinStyleApi,
	doujinDanceApi,
} from "./radioInterfaces";
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

const fetchRadioData = async (api: string, name: string) => {
	const { data } = await axios.get(api);
	console.log(name);

	switch (name) {
		case "r/a/dio":
			return data as radioApi;
		case "Gensokyo Radio":
			return data as gensokyoApi;
		case "Doujin Style":
		case "Friends Forever":
			return data as doujinStyleApi;
		case "Doujin Dance":
		case "Shadow69fr":
			return data as doujinDanceApi;
		default:
			throw new Error("Unknown radio station");
	}
};

const useRadioData = (name: string, api: string) => {
	return useQuery(["radioData", name], () => fetchRadioData(api, name), {
		enabled: false, // This query will not run automatically
		refetchInterval: 30000, // Refetch every 30 seconds when enabled
	});
};

export function SongPicker() {
	const boxTexture = useTexture("/Textures/boxTexture.jpg");
	const [playingRadio, setPlayingRadio] = useState<string | null>(null);

	const currentRadio = radioList.find((r) => r.name === playingRadio);

	const { data: radioData, refetch: refetchRadioData } = useRadioData(
		currentRadio?.name ?? "",
		currentRadio?.api ?? ""
	);

	useEffect(() => {
		// Load radio streams when the app starts
		radioList.forEach((radio) => {
			audioController.loadRadio(radio.name, radio.stream);
		});
	}, []);

	const handlePlayPause = (radioName: string) => {
		if (playingRadio === radioName) {
			audioController.stopRadio();
			setPlayingRadio(null);
		} else {
			audioController.playRadio(radioName);
			setPlayingRadio(radioName);
		}
	};

	useEffect(() => {
		if (playingRadio) {
			refetchRadioData();
			const interval = setInterval(() => {
				refetchRadioData();
			}, 30000);
			return () => clearInterval(interval);
		}
	}, [playingRadio, refetchRadioData]);

	return (
		<group>
			<ScreenSpace depth={20}>
				<ScreenSizer scale={5}>
					<Billboard follow={false} position={[-20, 10, 1]} castShadow={true}>
						<ScrollControls
							pages={1}
							damping={0.05}
							maxSpeed={0.05}
							distance={0.01}>
							<Scroll>
								<group renderOrder={10}>
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
															className=" w-auto h-24 aspect-square rounded-full"
															src={radio.image}
														/>
													</div>
													<div className=" items-center flex flex-col">
														<h2 className=" text-3xl">{radio.name}</h2>
													</div>
													<div className=" items-center flex">
														<button
															className=" bg-white-200"
															onClick={() => handlePlayPause(radio.name)}>
															{playingRadio === radio.name ? "⏸" : "▶"}
														</button>
													</div>
												</div>
											</Html>
											<meshStandardMaterial
												emissive={playingRadio === radio.name ? "red" : "pink"}
												emissiveIntensity={0.7}
											/>
										</Box>
									))}
								</group>
							</Scroll>
						</ScrollControls>
					</Billboard>
				</ScreenSizer>
			</ScreenSpace>
			<AudioVisualizer analyser={audioController.getAnalyser()} />
			<CurrentlyPlaying props={radioData} />
			<Image
				position={[0, 6.3, 0]}
				url="/fallback/erika.png"
				scale={[10, 5]}
				rotation-y={degToRad(90)}></Image>
		</group>
	);
}

interface CurrentlyPlayingProps {
	props: radioApi | doujinStyleApi | doujinDanceApi | gensokyoApi | undefined;
}

export function CurrentlyPlaying({ props }: CurrentlyPlayingProps) {
	const radioData = props;
	return (
		<Text
			anchorX={"center"}
			anchorY={"middle"}
			rotation-y={degToRad(90)}
			position={[1, 7, 0]}
			maxWidth={12}
			outlineWidth={0.03}
			fontSize={1}>
			{radioData
				? "main" in radioData
					? `${(radioData as radioApi).main.np}`
					: "SONGINFO" in radioData
						? `${(radioData as gensokyoApi).SONGINFO.ARTIST} - ${(radioData as gensokyoApi).SONGINFO.TITLE}`
						: "data" in radioData
							? `${(radioData as doujinStyleApi).data.title}`
							: "now_playing" in radioData
								? `${(radioData as doujinDanceApi).now_playing.song.artist} - ${(radioData as doujinDanceApi).now_playing.song.title}`
								: "Unknown Radio: Unknown track"
				: "Nothing Playing"}
		</Text>
	);
}

interface AudioVisualizerProps {
	analyser: AnalyserNode | null;
}

export function AudioVisualizer({ analyser }: AudioVisualizerProps) {
	const barsRef = useRef<THREE.Mesh[]>([]);

	const bars = useMemo(
		() =>
			Array.from({ length: 32 }, (_, i) => (
				<Box
					key={i}
					ref={(el) => {
						if (el) barsRef.current[i] = el;
					}}
					args={[0.3, 1, 0.3]}
					position={[i * 0.4 - 6, 0, -5]}>
					<meshNormalMaterial wireframe />
				</Box>
			)),
		[]
	);

	useFrame(() => {
		if (analyser) {
			const dataArray = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(dataArray);

			for (let i = 0; i < barsRef.current.length; i++) {
				const bar = barsRef.current[i];
				if (bar) {
					const value = dataArray[i * 2];
					const scale = value / 128 + 0.1;
					bar.scale.y = scale * 1.5;
				}
			}
		}
	});

	return (
		<group>
			<group scale={5} position={[20, 2, -18]} rotation-y={degToRad(90)}>
				{bars}
			</group>
		</group>
	);
}
