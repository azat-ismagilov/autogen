import React from 'react';
import { Video, staticFile } from 'remotion';

const screen: React.CSSProperties = {
	position: 'absolute',
	bottom: '0%',
	width: '100%',
};

export const Screen: React.FC<{
	path: string;
}> = ({ path }) => {
	return (
		<Video src={staticFile(path)} style={screen} />
	);
};

const webcam: React.CSSProperties = {
	position: 'absolute',
	top: '0%',
	width: '100%',
};

export const Webcam: React.FC<{
	path: string;
}> = ({ path }) => {
	return (
		<Video src={staticFile(path)} style={webcam} />
	);
};

