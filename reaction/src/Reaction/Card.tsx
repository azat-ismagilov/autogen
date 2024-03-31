import React, { useEffect, useRef, useState } from 'react';
import { Img, staticFile, Sequence, useVideoConfig, interpolate, useCurrentFrame } from 'remotion';
import useFitText from "use-fit-text";
import "@fontsource/urbanist/700.css";
import { Lottie } from "@remotion/lottie";
import loader from './data.json';

export const Card: React.FC<{
  title: string;
  subtitle: string;
  hashtag: string;
  logoPath: string;
  task: string;
  time: string;
  outcome: string;
  color: string;
}> = ({ title, subtitle, hashtag, logoPath, task, time, outcome, success, color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const animationStart = durationInFrames / 2;

  const { fontSize, ref } = useFitText({ maxFontSize: 2000 });
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const opacityOut = interpolate(frame, [animationStart - 10, animationStart + 5], [1, 0]);

  useEffect(() => {
    if (!contentRef?.current?.clientHeight) {
      return;
    }
    setHeight(contentRef?.current?.clientHeight);
  }, [contentRef?.current?.clientHeight]);

  return (
    <div className="w-full rounded pl-[40px] pr-[60px] overflow-hidden justify-start items-start gap-[200px] inline-flex" style={{ background: color }}>
      <div ref={contentRef} className="py-[30px] justify-start items-start gap-[31px] inline-flex">
        <Img style={{ alignSelf: 'center', width: "100%", height: "100%", maxWidth: "150px", maxHeight: "150px"}} src={logoPath} />
        <div className="flex-col justify-start items-start inline-flex gap-[16px]">
          <div className="w-[460px] font-bold text-[63px] leading-[63px] uppercase">{title}</div>
          <div className="justify-start items-start inline-flex gap-[17px] text-[40px]">
            <div>{subtitle}</div>
            <div>{hashtag}</div>
          </div>
        </div>
      </div>
      <div ref={ref} className="w-auto flex justify-center items-center" style={{ height }}>
        <div>
          <div className="text-center font-bold uppercase text-[140px]"> {task}</div>
          <div className="justify-start items-start inline-flex gap-[15px] text-[40px]">
            <div style={{ width: 50, opacity: opacityOut}}>
              <Lottie loop animationData={loader} play />
            </div>
            <div>{time}</div>
           </div>
        </div>
      </div>
    </div>
  );
};


