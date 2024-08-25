


import React from 'react';
import { reactionCardOnlyScheme } from './types';
import { z } from 'zod';
import { interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { Card } from './Reaction/Card';
import { repeatArray, sequenceGenerator } from './helper';
import { COLOR_YELLOW, COLOR_GREEN, COLOR_RED } from './Reaction/constants';



export const ReactionCardOnly: React.FC<z.infer<typeof reactionCardOnlyScheme>> = ({
    title,
    subtitle,
    hashtag,
    logoPath,
    task,
    time,
    outcome,
    success,
    rankBefore,
    rankAfter,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    durationInSeconds,
}) => {
    const frame = useCurrentFrame();

    const { durationInFrames, fps } = useVideoConfig();

    // Animation starts 30 seconds before the end
    const animationStart = durationInFrames - 30 * fps;
    const blinkDuration = 2;
    const distanceBlinks = 7;
    const blinkCount = 4;
    const lastBlink = animationStart - 4;

    const color = interpolateColors(
        frame,
        sequenceGenerator(lastBlink - blinkCount * (blinkDuration + distanceBlinks), blinkDuration, distanceBlinks, blinkCount),
        repeatArray([COLOR_YELLOW, COLOR_GREEN], blinkCount - 1).concat([COLOR_YELLOW, success ? COLOR_GREEN : COLOR_RED])
    );

    return (
        <div className="w-full h-full fixed top-12">
            <div className="w-full h-[288px] ">
                <Card title={title} subtitle={subtitle} hashtag={hashtag} logoPath={logoPath} task={task} color={color}
                    time={time} outcome={outcome} success={success} rankBefore={rankBefore} rankAfter={rankAfter} animationStart={animationStart} />
            </div>
        </div>
    );
};
