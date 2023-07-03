import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    staticFile,
    Img,
    interpolate,
    useCurrentFrame,
    Easing,
} from 'remotion';

import { FullSizeText } from './FullSizeText';
import { ShowUp } from '../transition/ShowUp';

export const BigTextIntro: React.FC<{
    text: string;
    path: string;
}> = ({ text, path }) => {
    const frame = useCurrentFrame();

    const scale = interpolate(
        frame,
        [0, 5],
        [10, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.exp)
        },
    ) * interpolate(
        frame,
        [0, 100],
        [1.1, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    const scalePerson = interpolate(
        frame,
        [0, 100],
        [1.26, 1.24],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    return (
        <div className="w-full h-full" style={{ transform: `scale(${scale})` }}>
            <div className="w-full h-full flex items-center justify-center uppercase">
                <FullSizeText text={text} />
            </div>
            <Sequence from={13}>
                <ShowUp>
                    <Img
                        className="person-mask absolute left-[700px] -top-[500px] grayscale"
                        style={{ transform: `scale(${scalePerson})` }}
                        src={staticFile(path)} />
                </ShowUp>
            </Sequence>
        </div>
    );
};
