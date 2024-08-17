import "./style.css";

import { Composition } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";

import { Reaction } from './Reaction';
import { ReactionHorizontal } from './ReactionHorizontal';
import { ReactionCardOnly } from "./ReactionCardOnly";
import { configSchema, reactionCardOnlyScheme } from "./types";
import { videoSrc } from "./helper";
import React from "react";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="ReactionVideo"
				component={Reaction}
				durationInFrames={150}
				fps={FPS}
				width={1080}
				height={1920}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				schema={configSchema}
				defaultProps={{
					title: 'This is unbelivable long name',
					subtitle: 'Subtitle',
					hashtag: '#hashtag',
					logoPath: 'https://icpc.global/static/media/icpc-medium5.5c857487.png',
					webcamVideoPath: "videos/reaction.mp4",
					screenVideoPath: "videos/screen.mp4",
					task: 'A',
					time: 10000000,
					outcome: 'OK',
					success: true,
					contestHeader: 'svg/header_46.svg',
					audioPath: 'audio/success-sound-effect.wav',
					backgroundVideoOrSvg: 'videos/blue_motion.mp4',
					rankBefore: 10,
					rankAfter: 1,
				}}
				calculateMetadata={async ({ props }) => {
					const metadata = await getVideoMetadata(videoSrc(props.webcamVideoPath, props.videoServer));
					return { durationInFrames: Math.floor(metadata.durationInSeconds * FPS) }
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="ReactionHorizontalVideo"
				component={ReactionHorizontal}
				durationInFrames={150}
				fps={FPS}
				width={1920}
				height={1080}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				schema={configSchema}

				defaultProps={{
					title: 'Title',
					subtitle: 'Subtitle',
					hashtag: '#hashtag',
					logoPath: 'https://icpc.global/static/media/icpc-medium5.5c857487.png',
					webcamVideoPath: "videos/reaction.mp4",
					screenVideoPath: "videos/screen.mp4",
					task: 'A',
					time: 10000000,
					outcome: 'OK',
					success: true,
					contestHeader: 'svg/header_46.svg',
					audioPath: 'audio/success-sound-effect.wav',
					backgroundVideoOrSvg: 'videos/blue_motion.mp4',
					rankBefore: 10,
					rankAfter: 1,
				}}
				calculateMetadata={async ({ props }) => {
					const metadata = await getVideoMetadata(videoSrc(props.webcamVideoPath, props.videoServer));
					return { durationInFrames: Math.floor(metadata.durationInSeconds * FPS) }
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="ReactionCardOnly"
				component={ReactionCardOnly}
				durationInFrames={150}
				fps={FPS}
				width={1000}
				height={400}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				schema={reactionCardOnlyScheme}
				defaultProps={{
					title: 'Title',
					subtitle: 'Subtitle',
					hashtag: '#hashtag',
					logoPath: 'https://icpc.global/static/media/icpc-medium5.5c857487.png',
					task: 'A',
					time: 10000000,
					outcome: 'OK',
					success: true,
					rankBefore: 10,
					rankAfter: 1,
				}}
			/>
		</>
	);
};
