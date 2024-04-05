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
import { z } from 'zod';
import Confetti, { ConfettiConfig } from '@ismagilov/remotion-confetti';

import { Card } from './Reaction/Card';
import { UserVideo } from './Reaction/UserVideo';
import { Circles } from './Reaction/Circle';
import { COLOR_YELLOW, COLOR_GREEN, COLOR_RED } from './Reaction/constants';
import { configSchema } from './types';

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


export const Reaction: React.FC<z.infer<typeof configSchema>> = ({
  contestHeader,
  title,
  subtitle,
  hashtag,
  logoPath,
  colorTeam,
  task,
  time,
  outcome,
  success,
  audioPath,
  webcamVideoPath,
  screenVideoPath,
  backgroundVideoPath,
}) => {
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
    repeatArray([COLOR_YELLOW, COLOR_GREEN], blinkCount - 1).concat([COLOR_YELLOW, success ? COLOR_GREEN : COLOR_RED])
  );

  const gap = interpolate(
    frame,
    [animationStart - 10, animationStart + 5],
    [50, success ? 70 : 50],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp)
    }
  );

  const scale = interpolate(
    frame,
    [animationStart - 10, animationStart + 5],
    [1, success ? 1.04 : 0.95],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp)
    }
  );

  return (
    <div>
       <AbsoluteFill>
          <Video muted loop className="-rotate-90 scale-[3] -z-10" src={staticFile(backgroundVideoPath)} />
       </AbsoluteFill>
       <AbsoluteFill>
          {/* Show confetti only if success */}
          {success
          ? <Sequence className="z-10" from={animationStart - 17} >
          <Confetti {...confettiConfig} />
          <Audio src={staticFile(audioPath)} />
          {/*
          <Circles positionX={540} positionY={960} count={15} seed={0} />
          */}
          </Sequence>
          : <Sequence className="z-10" from={animationStart - 17} >
          <Audio src={staticFile(audioPath)} />
          </Sequence>}
          <div className="w-full h-full flex justify-center ite ms-center">
             <div className="w-[1000px] inline-flex flex-col justify-center items-center " style={{ gap }}>
                <img src={staticFile(contestHeader)} />
                <UserVideo path={webcamVideoPath} />
                <div className="z-20 w-full" style={{ transform: `scale(${scale})` }}>
                <Card title={title} subtitle={subtitle} hashtag={hashtag} logoPath={logoPath} task={task} color={color}
                   time ={time} outcome={outcome} success={success} />
             </div>
             <UserVideo path={screenVideoPath} />
          </div>
    </div>
    </AbsoluteFill>
    </div>
  );
};
