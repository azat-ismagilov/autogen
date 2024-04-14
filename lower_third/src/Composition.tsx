import { AbsoluteFill } from 'remotion';
import { Logo } from './Logo';
import { Subtitle } from './Subtitle';
import { Title } from './Title';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

export const myCompSchema = z.object({
	titleText: z.string(),
	titleColor: zColor(),
	logoColor: zColor(),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	titleText,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	titleColor,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	logoColor,
}) => {
	return (
		<AbsoluteFill className="items-center justify-center">
			<div className="bg-black w-11 h-11" />
		</AbsoluteFill>
	);
};
