import {
	ScreenSpace,
	ScreenSizer,
	Billboard,
	ScrollControls,
	Scroll,
	Box,
	Text,
} from "@react-three/drei";
import { useState, useEffect, useRef, useMemo } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { audioController } from "../utils/audioController";
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
import { Avatar } from "./Avatar";
import { RadioBox } from "./RadioBox";

const fetchRadioData = async (api: string, name: string) => {
	const { data } = await axios.get(api);

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
				<ScreenSizer scale={4.8}>
					<Billboard follow={false} position={[-22, 10, 1]} castShadow={true}>
						<ScrollControls
							pages={1}
							damping={0.01}
							maxSpeed={0.05}
							distance={0.01}>
							<Scroll>
								<CurrentlyPlaying props={radioData} />
								{radioList.map((radio, index) => (
									<RadioBox
										key={index}
										radio={radio}
										index={index}
										playingRadio={playingRadio}
										handlePlayPause={handlePlayPause}
									/>
								))}
							</Scroll>
						</ScrollControls>
					</Billboard>
				</ScreenSizer>
			</ScreenSpace>
			{playingRadio !== null && (
				<AudioVisualizer analyser={audioController.getAnalyser()} />
			)}
			<Avatar isPlaying={playingRadio !== null} />
		</group>
	);
}

interface CurrentlyPlayingProps {
	props: radioApi | doujinStyleApi | doujinDanceApi | gensokyoApi | undefined;
}

export function CurrentlyPlaying({ props }: CurrentlyPlayingProps) {
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);

	const handleVolumeClick = (event: THREE.Event) => {
		const clickedPosition = (event as any).uv.x;

		// Calculate the width of "Volume : " text (approximately 8 characters)
		const volumeTextWidth = 6 / 18; // Assuming total width is 18 characters

		// Only process clicks after the "Volume : " text
		if (clickedPosition > volumeTextWidth) {
			const adjustedPosition =
				(clickedPosition - volumeTextWidth) / (1 - volumeTextWidth);
			const newVolume = Math.max(Math.ceil(adjustedPosition * 10) / 10, 0.1);
			setVolume(newVolume);
			audioController.setVolume(newVolume);
			setIsMuted(false);
		} else {
			// Click on "Volume : " text toggles mute
			setIsMuted(!isMuted);
			audioController.setVolume(isMuted ? volume : 0);
		}
	};
	const volumeBar = isMuted
		? "▯  ".repeat(10)
		: "▮".repeat(Math.round(volume * 10)) +
			"▯".repeat(10 - Math.round(volume * 10));

	const radioData = props;
	return (
		<mesh>
			<Text
				anchorX={"center"}
				anchorY={"middle"}
				rotation-y={degToRad(20)}
				position={[0, 2.1, 0]}
				outlineWidth={0.03}
				fontSize={0.5}>
				{radioData
					? "main" in radioData
						? `♫ ${(radioData as radioApi).main.np}`
						: "SONGINFO" in radioData
							? `♫ ${(radioData as gensokyoApi).SONGINFO.ARTIST} - ${(radioData as gensokyoApi).SONGINFO.TITLE}`
							: "data" in radioData
								? `♫ ${(radioData as doujinStyleApi).data.title}`
								: "now_playing" in radioData
									? `♫ ${(radioData as doujinDanceApi).now_playing.song.artist} - ${(radioData as doujinDanceApi).now_playing.song.title}`
									: "Unknown Radio: Unknown track"
					: "Choose a radio!"}
				{"\n"}
			</Text>

			<Text
				anchorX={"center"}
				anchorY={"middle"}
				rotation-y={degToRad(20)}
				position={[0, -22.1, 0]}
				outlineWidth={0.03}
				fontSize={0.5}
				onClick={handleVolumeClick}
				onPointerOver={(e) => (e.eventObject.scale.x = 1.1)}
				onPointerOut={(e) => (e.eventObject.scale.x = 1)}>
				{`Volume : ${volumeBar}`}
			</Text>
		</mesh>
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
