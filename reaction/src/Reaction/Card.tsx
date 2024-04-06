import React, { useEffect, useRef, useState } from 'react';
import { Img, useVideoConfig, interpolate, useCurrentFrame } from 'remotion'
import { format } from 'date-fns';
import '@fontsource/urbanist/700.css';
import { Lottie } from '@remotion/lottie';
import loader from './data.json';

export const Card: React.FC<{
  title: string;
  subtitle: string;
  hashtag: string;
  logoPath: string;
  task: string;
  time: number;
  outcome: string;
  success: boolean;
  color: string;
  animationStart: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ title, subtitle, hashtag, logoPath, task, time, outcome, success, color, animationStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleRef = useRef<HTMLDivElement>(null);

  const opacityOut = interpolate(frame, [animationStart - 10, animationStart + 5], [1, 0]);

  const [titleHeight, setTitleHeight] = useState<number>(0);

  useEffect(() => {
    if (titleRef.current) {
      setTitleHeight(titleRef.current.offsetHeight);
    }
  }, []);

  const bigLetterSize = Math.max(Math.min(1000, titleHeight * 0.8), 100);

  // This should be time at animationStart
  const realtime = time + Math.min(frame - animationStart, 0) / fps * 1000;

  const timer = format(realtime, 'HH:mm:ss');

  return (
    <div className="w-full rounded pl-[40px] pr-[60px] overflow-hidden justify-between items-stretch inline-flex" style={{ background: color }}>
      <div className="py-8 justify-start items-center gap-[31px] inline-flex">
        <Img className="self-center w-auto h-auto max-w-[150px] max-h-[150px]" src={logoPath} />
        <div className="w-[460px] flex-col justify-start items-start inline-flex gap-[16px]">
          <div ref={titleRef} className="font-bold text-[63px] leading-none uppercase">{title}</div>
          <div className="justify-start items-start inline-flex gap-[17px] text-[40px]">
            <div>{subtitle}</div>
            <div>{hashtag}</div>
          </div>
        </div>
      </div>
      <div className="py-8 w-auto flex flex-col items-center justify-around gap-1">
        <div className="text-center font-bold uppercase leading-none" style={{ fontSize: bigLetterSize }}>{task}</div>
        <div className="justify-start items-start inline-flex gap-[15px] text-[40px]">
          <div className="flex flex-col items-end justify-start">
            <div style={{ opacity: 1 - opacityOut }}>{outcome}</div>
            <div className="mt-[-55px] h=[40px]" style={{ opacity: opacityOut }}>
              <Lottie loop animationData={loader} />
            </div></div>
          <div>{timer}</div>
        </div>
      </div>
    </div>
  );
};


