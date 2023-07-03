import React from 'react';
import {
    interpolate,
    staticFile,
    Img,
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    Easing
} from 'remotion';

import { FullSizeText } from './FullSizeText';
import { ShowUp } from '../transition/ShowUp';

export const FullTeam: React.FC<{
    name: string;
    subtitle: string;
    path: string;
    backgroundColor: string;
}> = ({ name, subtitle, path, backgroundColor }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();


    const textScaling = interpolate(
        frame,
        [0, durationInFrames],
        [1.3, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad)
        },
    );

    const personScaling = interpolate(
        frame,
        [0, durationInFrames],
        [1.2, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad)
        },
    );

    return (
        <ShowUp durationInFrames={30}>
            <AbsoluteFill style={{ backgroundColor }} />
            <AbsoluteFill className="bg-white opacity-60" />
            <AbsoluteFill style={{ transform: `scale(${personScaling})` }}>
                <Img className="w-full absolute scale-100" src={staticFile(path)} />
            </AbsoluteFill>
            <AbsoluteFill className="flex items-center justify-center" style={{ transform: `scale(${textScaling})` }}>
                <div className="w-10/12 h-60 absolute top-[570px] drop-shadow-2xl">
                    <FullSizeText text={name} />
                </div>
                <div className="w-10/12 h-40 absolute top-[780px] opacity-75 drop-shadow-2xl" style={{ color: backgroundColor }}>
                    <FullSizeText text={subtitle} />
                </div>
            </AbsoluteFill>
        </ShowUp>
    );
};
