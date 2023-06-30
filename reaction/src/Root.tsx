import { Composition } from 'remotion';
import { Reaction } from './Reaction';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="ReactionVideo"
				component={Reaction}
				durationInFrames={150}
				fps={30}
				width={1080}
				height={1920}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					titleText: 'Seoul National University',
					screenVideoPath: 'videos/screen.mp4',
					webcamVideoPath: 'videos/reaction.mp4',
					backgroundVideoPath: 'videos/motion_icpc.mp4',
				}}
			/>
		</>
	);
};
