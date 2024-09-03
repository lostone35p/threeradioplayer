import { loadAnim } from "../utils/vrm";
import type { VRM } from "@pixiv/three-vrm";
import { useState, useEffect } from "react";
import type { AnimationClip } from "three";

const animationMap = {
	idle: "/idle.fbx",
	dance: "/dance1.fbx",
	dance2: "/dance2.fbx",
};

export const useClips = (avatar: VRM): AnimationClip[] => {
	const [clips, setClips] = useState<AnimationClip[]>([]);

	useEffect(() => {
		for (const [name, url] of Object.entries(animationMap)) {
			loadAnim(url, avatar).then((clip) => {
				if (!clip) return;
				clip.name = name;
				setClips((clips) => [...clips, clip]);
			});
		}
	}, [avatar]);

	return clips;
};
