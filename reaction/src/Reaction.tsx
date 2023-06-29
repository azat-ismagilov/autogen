import React from 'react';

import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { Title } from './Reaction/Title';
import { Screen, Webcam } from './Reaction/Video';

export const Reaction: React.FC<{
  titleText: string;
  titleColor: string;
  screenVideoPath: string;
  webcamVideoPath: string;
}> = ({ titleText, titleColor, screenVideoPath, webcamVideoPath }) => {
  const fadeInDuration = 15;

  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Fade out the animation at the end
  const opacity = interpolate(
    frame,
    [0, fadeInDuration, durationInFrames - fadeInDuration, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <AbsoluteFill style={{ opacity }}>
        <Webcam path={webcamVideoPath} />
        <Sequence from={35}>
          <Title titleText={titleText} titleColor={titleColor} />
        </Sequence>
        <Screen path={screenVideoPath} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
