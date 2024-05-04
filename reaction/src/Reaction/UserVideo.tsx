import React from 'react';
import { OffthreadVideo } from 'remotion';
import { videoSrc } from '../helper';

export const UserVideo: React.FC<{
	path: string;
	videoServer?: string;
}> = ({ path, videoServer }) => {
	return (
		<OffthreadVideo toneMapped={false} className="w-full rounded" src={videoSrc(path, videoServer)} />
	);
};
