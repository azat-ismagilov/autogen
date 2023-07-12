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

export const BigPerson: React.FC<{
    name: string;
    subtitle: string;
    path: string;
    backgroundColor: string;
}> = ({ name, subtitle, path, backgroundColor }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const startDistance = 0.7;
    const finishDistance = 1;

    const personDistance = interpolate(
        frame,
        [0, durationInFrames],
        [startDistance, finishDistance],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic)
        },
    );
    const personScaling = finishDistance / personDistance;

    const backgroundOffset = 3;
    const backgroundScaling = (finishDistance + backgroundOffset) / (personDistance + backgroundOffset);

    const textOffset = -0.4;
    const textScaling = (finishDistance + textOffset) / (personDistance + textOffset);

    return (
        <ShowUp durationInFrames={30}>
            <AbsoluteFill className="brightness-150 saturate-[0.55]" style={{ backgroundColor }} />
            <div className="h-full w-2/3 absolute top-1/4 bg-white opacity-25 blur-3xl rounded-full " style={{ transform: `scale(${backgroundScaling})` }} />
            <AbsoluteFill style={{ transform: `scale(${personScaling})` }}>
                <Img className="person-mask w-full absolute -top-[1380px] grayscale scale-[0.5]" src={staticFile(path)} />
            </AbsoluteFill>
            <AbsoluteFill className="flex items-center justify-center" style={{ transform: `scale(${textScaling})` }}>
                <div className="w-full h-64 absolute top-[570px] drop-shadow-2xl">
                    <FullSizeText text={name} />
                </div>
                <div className="w-full h-40 absolute top-[780px] opacity-[0.9] drop-shadow-2xl" style={{color: backgroundColor}}>
                    <FullSizeText text={subtitle} />
                </div>
            </AbsoluteFill>
        </ShowUp>
    );
};
