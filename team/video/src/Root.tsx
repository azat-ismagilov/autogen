import "./style.css";
import { Composition, staticFile } from 'remotion';
import { Team } from './Team';
import { FullPerson } from './Team/FullPerson';
import { FullTeam } from './Team/FullTeam';

export type ScreenInfo = {
	title: string;
	subtitle: string;
	path: string;
};

export type TeamInfo = {
	participants: Array<ScreenInfo>;
	team: ScreenInfo;
	color: string;
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="Team"
				component={Team}
				durationInFrames={390}
				fps={30}
				width={1920}
				height={1080}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					data: null,
				}}
				calculateMetadata={async ({ props }) => {
					const data = await fetch(staticFile('team.json'));
					const json = await data.json();

					return {
						props: {
							...props,
							data: json,
						},
					};
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="FullPerson"
				component={FullPerson}
				durationInFrames={98}
				fps={30}
				width={1920}
				height={1080}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					data: {
						title: "Konstantin Makhnev",
						subtitle: "jerry",
						path: "photos/1.png",
					},
					backgroundColor: "#1A63D8"
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="FullTeam"
				component={FullTeam}
				durationInFrames={98}
				fps={30}
				width={1920}
				height={1080}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					name: "University of Cambridge",
					subtitle: "#icpcwfdhaka",
					path: "photos/0.png",
					backgroundColor: "#1A63D8"
				}}
			/>
		</>
	);
};
