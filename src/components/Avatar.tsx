import { degToRad } from "three/src/math/MathUtils.js";
import { useVRMloader } from "../hooks/useVRMLoader";
import { useAnimations } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useClips } from "../hooks/useClips";

interface AvatarProps {
	isPlaying: boolean;
}

export const Avatar = (isPlaying: AvatarProps) => {
	const vrm = useVRMloader("/miku.vrm");

	const [isDancing, setIsDancing] = useState(false);

	const ref = useRef<any>();
	const isReversedRef = useRef(false);

	const clips = useClips(vrm);
	const { mixer, actions } = useAnimations(clips, vrm.scene);
	useEffect(() => {
		if (!actions.idle || !actions.dance || !actions.dance2) {
			console.error("Required animations not found");
			return;
		}
		actions.idle.setEffectiveTimeScale(0.5);
		actions.idle.play();
		actions.dance2.setEffectiveTimeScale(0.5);

		return () => {
			actions.idle?.stop();
			actions.dance2?.stop();
		};
	}, [actions]);

	useEffect(() => {
		if (!actions.idle || !actions.dance || !actions.dance2) return;

		const fadeTime = 2; // Adjust this value for faster or slower transitions

		if (isPlaying.isPlaying && !isDancing) {
			actions.idle.fadeOut(fadeTime);
			ref.current.position.y = 0;
			ref.current.position.x = 10;
			actions.dance2.fadeIn(fadeTime).play();

			setIsDancing(true);
		} else if (!isPlaying.isPlaying && isDancing) {
			ref.current.position.y = 2;
			ref.current.position.x = 11;
			actions.dance2.fadeOut(fadeTime).stop();
			actions.idle.reset().fadeIn(fadeTime).play();
			setIsDancing(false);
		}
	}, [isPlaying, actions]);

	useFrame(() => {
		if (actions.dance2 && actions.dance2.isRunning()) {
			const clip = actions.dance2.getClip();

			// Check if the animation has reached its end or start
			if (
				(actions.dance2.time >= clip.duration - 0.1 &&
					!isReversedRef.current) ||
				(actions.dance2.time <= 0 && isReversedRef.current)
			) {
				// Reverse the animation
				actions.dance2.setEffectiveTimeScale(actions.dance2.timeScale * -1);
				isReversedRef.current = !isReversedRef.current;
			}
		}
	});

	useFrame((_, delta) => {
		if (actions.dance2 && actions.dance2.isRunning()) {
			const clip = actions.dance2.getClip();

			if (
				(actions.dance2.time >= clip.duration - 0.1 &&
					!isReversedRef.current) ||
				(actions.dance2.time <= 0.1 && isReversedRef.current)
			) {
				actions.dance2.setEffectiveTimeScale(actions.dance2.timeScale * -1);
				isReversedRef.current = !isReversedRef.current;
			}
		}

		vrm.update(delta);
		mixer.update(delta);
	});
	return (
		<>
			<group
				position={[11, 2, 0]}
				scale={2}
				rotation-y={degToRad(90)}
				ref={ref}>
				<primitive object={vrm.scene} />
			</group>
		</>
	);
};
