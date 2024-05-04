import React from 'react';
import { staticFile, OffthreadVideo } from 'remotion';

export const UserVideo: React.FC<{
	path: string;
}> = ({ path }) => {
	return (
		<OffthreadVideo toneMapped={false} className="w-full rounded" src={staticFile(path)} />
	);
};
