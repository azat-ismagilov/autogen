import { Easing, Sequence } from 'remotion'
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { COLOR_GREEN, CIRCLE_DURATION } from './constants';

const Circle: React.FC<{
  diameter: number;
  positionX: number;
  positionY: number;
  opacity: number;
}> = ({ diameter, positionX, positionY, opacity }) => {
  const circle: React.CSSProperties = {
    backgroundColor: COLOR_GREEN,
    borderRadius: "50%",
    display: "inline-block",
    position: "absolute",
    width: diameter,
    height: diameter,
    left: positionX,
    top: positionY,
    opacity,
  }

  return (
    <div style={circle} />
  );
};

const AnimatedCircle: React.FC<{
  diameter: number;
  startX: number;
  startY: number;
  finishX: number;
  finishY: number;
}> = ({ diameter, startX, startY, finishX, finishY }) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();
  const positionX = spring({
    fps: videoConfig.fps,
    frame,
    from: startX,
    to: finishX,
    durationInFrames: CIRCLE_DURATION * 4,
  });
  const positionY = spring({
    fps: videoConfig.fps,
    frame,
    from: startY,
    to: finishY,
    durationInFrames: CIRCLE_DURATION * 4,
  });
  const opacity = interpolate(
    frame,
    [0, CIRCLE_DURATION / 5, CIRCLE_DURATION, CIRCLE_DURATION * 2, CIRCLE_DURATION * 3],
    [0, 0.3, 0.5, 0.5, 0],
    {
      easing: Easing.inOut(Easing.exp),
    }
  )

  return (
    <Circle diameter={diameter} positionX={positionX} positionY={positionY} opacity={opacity} />
  );
};

function randomRange(start: number, finish: number, seed: number): number {
  return start + (finish - start) * random(seed);
}

export const Circles: React.FC<{
  positionX: number;
  positionY: number;
  count: number;
  seed: number;
}> = ({ positionX, positionY, count, seed }) => {
  const MAX_DISTANCE = 350;
  const MAX_SIZE = 150;
  const MIN_SIZE = 50;

  const circlesList = [];

  let iter = seed;
  for (let i = 1; i <= count; i++) {
    const diameter = randomRange(MIN_SIZE, MAX_SIZE, iter++);
    const distanceX = 1.7 * randomRange(-MAX_DISTANCE, MAX_DISTANCE, iter++);
    const distanceY = randomRange(-MAX_DISTANCE, MAX_DISTANCE, iter++);
    circlesList.push(
      <Sequence from={i / 1.2}>
        <AnimatedCircle diameter={diameter} startX={positionX} startY={positionY} finishX={positionX + distanceX} finishY={positionY + distanceY} />
      </Sequence>
    )
  }
  return (
    <div>
      {circlesList}
    </div>
  );
};
