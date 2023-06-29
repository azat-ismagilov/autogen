import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_FAMILY } from './constants';

const vcenter: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	width: '100%',
};

const title: React.CSSProperties = {
	fontFamily: FONT_FAMILY,
	fontWeight: 'bold',
	fontSize: 100,
	textAlign: 'center',
};

const word: React.CSSProperties = {
	marginLeft: 10,
	marginRight: 10,
	display: 'inline-block',
};

export const Title: React.FC<{
	titleText: string;
	titleColor: string;
}> = ({ titleText, titleColor }) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const words = titleText.split(' ');

	return (
		<div style={vcenter}>
			<h1 style={title}>
				{words.map((t, i) => {
					const delay = i * 5;

					const scale = spring({
						fps: videoConfig.fps,
						frame: frame - delay,
						config: {
							damping: 200,
						},
					});

					return (
						<span
							key={t}
							style={{
								...word,
								color: titleColor,
								transform: `scale(${scale})`,
							}}
						>
							{t}
						</span>
					);
				})}
			</h1>
		</div>
	);
};
