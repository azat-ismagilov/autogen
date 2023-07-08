import {
	AbsoluteFill,
	Sequence,
	Audio,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import { FullPerson } from './Team/FullPerson';
import { FullTeam } from './Team/FullTeam';
import { TeamInfo } from './Root';

export const Team: React.FC<{
	data: TeamInfo | null;
}> = ({ data }) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	if (data === null) {
		return null;
	}

	const { participants } = data;
	const teamPath = data.team.path;
	const team = data.team.title;
	const tag = data.team.subtitle;
	const teamColor = data.color;

	const timeEachPerson = 98;
	const teamShotStart = timeEachPerson * participants.length - 8;

	return (
		<AbsoluteFill>
			<Audio src={staticFile("audio/sound.wav")} />
			{participants.map((personData, index) => (
				<Sequence key={index} from={index * timeEachPerson} durationInFrames={timeEachPerson}>
					<FullPerson data={personData} backgroundColor={teamColor} />
				</Sequence>
			))};

			<Sequence from={teamShotStart} durationInFrames={durationInFrames - teamShotStart}>
				<FullTeam name={team} subtitle={tag} path={teamPath} backgroundColor={teamColor} />
			</Sequence>
		</AbsoluteFill >
	);
};
