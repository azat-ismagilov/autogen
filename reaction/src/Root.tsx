import "./style.css";

import { Composition, Video, staticFile } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";

import { Reaction } from './Reaction';
import { ReactionHorizontal } from './ReactionHorizontal';
import { configSchema } from "./types";

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
					configPath: 'config.json',
					contestHeader: 'svg/header_46.svg',
					title: 'Title',
					subtitle: 'Subtitle',
					hashtag: '#hashtag',
					logoPath: 'svg/icpc_logo.svg',
					colorTeam: 'red',
					task: 'A',
					success: true,
					time: "250:47",
                    outcome: "AC",
					audioPath: 'audio/success-sound-effect.wav',
					screenVideoPath: 'videos/screen.mp4',
					webcamVideoPath: 'videos/reaction.mp4',
					backgroundVideoPath: 'videos/yellow_motion.mp4',
				}}
				calculateMetadata={async ({ props }) => {
					const data = await fetch(staticFile(props.configPath));
					const json = await data.json();
					const updatedProps = {
						...props,
						...json,
					};

					const metadata = await getVideoMetadata(staticFile(props.webcamVideoPath));

					return { props: updatedProps, durationInFrames: Math.floor(metadata.durationInSeconds * FPS) }
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
					configPath: 'config47.json',
					contestHeader: 'svg/header_46.svg',
					title: 'Title',
					subtitle: 'Subtitle',
					hashtag: '#hashtag',
					logoPath: 'svg/icpc_logo.svg',
					colorTeam: 'red',
					task: 'A',
					success: true,
					time: "250:47",
                    outcome: "AC",
					audioPath: 'audio/success-sound-effect.wav',
					screenVideoPath: 'videos/screen.mp4',
					webcamVideoPath: 'videos/reaction.mp4',
					backgroundVideoPath: 'videos/yellow_motion.mp4',
				}}
				calculateMetadata={async ({ props }) => {
					const data = await fetch(staticFile(props.configPath));
					const json = await data.json();
					const updatedProps = {
						...props,
						...json,
					};

					const metadata = await getVideoMetadata(staticFile(props.webcamVideoPath));

					return { props: updatedProps, durationInFrames: Math.floor(metadata.durationInSeconds * FPS) }
				}}
			/>
		</>
	);
};
