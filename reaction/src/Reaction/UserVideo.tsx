import React from 'react';
import { Video, staticFile, OffthreadVideo } from 'remotion';

export const UserVideo: React.FC<{
	path: string;
}> = ({ path }) => {
	return (
		<Video className="w-full rounded" src={staticFile(path)} />
	);
};
