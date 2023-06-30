import React from 'react';
import { Video, staticFile } from 'remotion';
import { BORDER_RADIUS } from './constants';

const video: React.CSSProperties = {
	borderRadius: BORDER_RADIUS,
	width: '100%',
};

export const UserVideo: React.FC<{
	path: string;
}> = ({ path }) => {
	return (
		<Video src={staticFile(path)} style={video} />
	);
};