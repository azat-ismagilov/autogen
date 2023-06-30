import React from 'react';

import {
  AbsoluteFill,
  interpolate,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolateColors,
  staticFile,
  Audio,
  Easing,
  Sequence
} from 'remotion';

import { Card } from './Reaction/Card';
import { UserVideo } from './Reaction/UserVideo';
import { Circles } from './Reaction/Circle';
import { COLOR_GREEN, COLOR_TEAM } from './Reaction/constants';

const grid: React.CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '995px',
  gap: '21px',
}

const center: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}

const videoBackground: React.CSSProperties = {
  width: 2444.65,
  height: 1375.11,
  left: -148,
  top: 2303.65,
  position: 'absolute',
  transform: 'rotate(-90deg)',
  transformOrigin: '0 0',
  zIndex: '-1',
}

function sequenceGenerator(firstValue: number, distance: number, delay: number, count: number): number[] {
  let term = firstValue;
  const sequence: number[] = [];
  for (let i = 1; i <= count; i++) {
    sequence.push(term);
    term += distance;
    sequence.push(term);
    term += delay;
  }
  return sequence;
};

function repeatArray<T>(array: T[], times: number): T[] {
  const repeatedArray: T[] = [];

  for (let i = 0; i < times; i++) {
    repeatedArray.push(...array);
  }

  return repeatedArray;
}

export const Reaction: React.FC<{
  titleText: string;
  screenVideoPath: string;
  webcamVideoPath: string;
  backgroundVideoPath: string;
}> = ({ titleText, screenVideoPath, webcamVideoPath, backgroundVideoPath }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const animationStart = durationInFrames / 2;
  const blinkDuration = 2;
  const distanceBlinks = 7;
  const blinkCount = 4;
  const lastBlink = animationStart - 4;

  const color = interpolateColors(
    frame,
    sequenceGenerator(lastBlink - blinkCount * (blinkDuration + distanceBlinks), blinkDuration, distanceBlinks, blinkCount),
    repeatArray([COLOR_TEAM, COLOR_GREEN], blinkCount)
  );

  const gap = interpolate(
    frame,
    [animationStart - 10, animationStart + 5],
    [21, 100],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.exp)
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'white', zIndex: -2 }}>
      <Sequence from={animationStart - 16}>
        <Audio src={staticFile("audio/sound-effect.wav")} />
      </Sequence>
      <Video muted loop src={staticFile(backgroundVideoPath)} style={videoBackground} />
      <Sequence from={animationStart - 17} style={{ zIndex: 1 }}>
        <Circles positionX={540} positionY={960} count={15} seed={0} />
      </Sequence>
      <div style={center}>
        <div style={{ ...grid, gap }}>
          <UserVideo path={webcamVideoPath} />
          <div style={{ zIndex: 2, width: "100%" }}>
            <Card text={titleText} color={color} />
          </div>
          <UserVideo path={screenVideoPath} />
        </div>
      </div>
    </AbsoluteFill >
  );
};
