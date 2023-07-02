import React from 'react';

import Confetti, { ConfettiConfig } from 'remotion-confetti'

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

const confettiConfig: ConfettiConfig = {
  particleCount: 200,
  startVelocity: 30,
  spread: 360,
  x: 540,
  y: 960,
  scalar: 3,
  gravity: 0,
};


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
    [21, 70],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp)
    }
  );

  const scale = interpolate(
    frame,
    [animationStart - 10, animationStart + 5],
    [1, 1.04],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp)
    }
  );

  return (
    <AbsoluteFill className="bg-white -z-20">
      <Sequence from={animationStart - 16}>
        <Audio src={staticFile("audio/sound-effect.wav")} />
      </Sequence>
      <Video muted loop className="-rotate-90 scale-[2.1] -z-10" src={staticFile(backgroundVideoPath)} />
      <Sequence className="z-10" from={animationStart - 17} >
        <Confetti {...confettiConfig} />
        {/* <Circles positionX={540} positionY={960} count={15} seed={0} /> */}
      </Sequence>
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[995px] inline-flex flex-col justify-center items-center " style={{ gap }}>
          <UserVideo path={webcamVideoPath} />
          <div className="z-20 w-full" style={{ transform: `scale(${scale})` }}>
            <Card text={titleText} color={color} />
          </div>
          <UserVideo path={screenVideoPath} />
        </div>
      </div>
    </AbsoluteFill >
  );
};
