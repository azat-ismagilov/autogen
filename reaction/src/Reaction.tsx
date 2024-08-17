import React from 'react';

import {
  AbsoluteFill,
  interpolate,
  Img,
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
import { COLOR_YELLOW, COLOR_GREEN, COLOR_RED } from './Reaction/constants';
import { configSchema } from './types';
import { Background } from './Background';
import { repeatArray, sequenceGenerator } from './helper';

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
  task,
  time,
  outcome,
  success,
  rankBefore,
  rankAfter,
  audioPath,
  webcamVideoPath,
  screenVideoPath,
  backgroundVideoOrSvg,
  videoServer,
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
        {backgroundVideoOrSvg.endsWith('.svg') ?
          <Img src={staticFile(backgroundVideoOrSvg)} /> :
          <Background backgroundVideoPath={backgroundVideoOrSvg} />}
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
          <div className="w-[1000px] inline-flex flex-col justify-center items-center" style={{ gap }}>
            <Img src={staticFile(contestHeader)} />
            <UserVideo path={webcamVideoPath} videoServer={videoServer} />
            <div className="z-20 w-full h-72" style={{ transform: `scale(${scale})` }}>
              <Card title={title} subtitle={subtitle} hashtag={hashtag} logoPath={logoPath} task={task} color={color}
                time={time} outcome={outcome} success={success} rankBefore={rankBefore} rankAfter={rankAfter} animationStart={animationStart} />
            </div>
            <UserVideo path={screenVideoPath} videoServer={videoServer} />
          </div>
        </div>
      </AbsoluteFill>
    </div>
  );
};
