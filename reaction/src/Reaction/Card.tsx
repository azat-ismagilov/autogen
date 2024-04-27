import React, { useEffect, useRef, useState } from 'react';
import { Img, useVideoConfig, interpolate, useCurrentFrame, Easing, staticFile } from 'remotion'
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
  rankBefore: number;
  rankAfter: number;
  color: string;
  animationStart: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ title, subtitle, hashtag, logoPath, task, time, outcome, rankBefore, rankAfter, success, color, animationStart }) => {
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

  const bigLetterSize = Math.max(Math.min(1000, titleHeight * 0.99), 100);

  // This should be time at animationStart
  // Realtime is the duration in milliseconds since the start of the video
  const realtime = time + Math.min(frame - animationStart, 0) / fps * 1000;

  // Don't write this by hand!!! This is auto-generated.
  const hours = Math.floor(realtime / (60 * 60 * 1000));
  const minutes = Math.floor((realtime % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((realtime % (60 * 1000)) / 1000);
  const timer = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  function getOrdinal(n: number) {
    let ord = 'th';

    if (n % 10 === 1 && n % 100 !== 11) {
      ord = 'st';
    }
    else if (n % 10 === 2 && n % 100 !== 12) {
      ord = 'nd';
    }
    else if (n % 10 === 3 && n % 100 !== 13) {
      ord = 'rd';
    }

    return ord;
  }

  const placePositionPercent = success
    ? interpolate(frame, [animationStart - 20, animationStart], [0, 75], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad)
    })
    :
    interpolate(frame, [animationStart - 30, animationStart - 10, animationStart - 4], [0, 30, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.sin)
    });

  const place = Math.round(
    success
      ? interpolate(frame, [animationStart - 20, animationStart], [rankBefore, rankAfter], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }) : interpolate(frame, [animationStart - 30, animationStart - 10, animationStart - 4], [rankBefore, 1, rankBefore], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
  );

  return (
    <div>
      <div className="bg-gray-800 rounded absolute top-[-48px] p-4" style={{ right: `${placePositionPercent}%` }}>
        <div className="text-[40px] leading-none">
          {place}{getOrdinal(place)}  place
        </div>
      </div>
      <div className="w-full rounded pl-[40px] pr-[60px] overflow-hidden gap-[31px] items-stretch flex" style={{ background: color }}>
        <Img className="self-center w-auto h-auto max-w-[150px] max-h-[150px]" src={logoPath} />
        <div className="py-8 grow grid grid-cols-[430px_max-content] justify-between gap-y-5">
          <div className="place-self-stretch">
            <div ref={titleRef} className="font-bold text-[63px] leading-none uppercase break-words">{title}</div>
          </div>
          <div className="place-self-center justify-self-center font-bold leading-none uppercase font-mono" style={{ fontSize: bigLetterSize }}>{task}</div>
          <div className="text-[40px] leading-none break-words">
            {subtitle} {hashtag}
          </div>
          <div className="justify-self-center justify-start items-start inline-flex gap-[15px] text-[40px] font-mono leading-none">
            <div className="flex flex-col items-end justify-start">
              <div style={{ opacity: 1 - opacityOut }}>{outcome}</div>
              <div className="mt-[-45px] h=[40px]" style={{ opacity: opacityOut }}>
                <Lottie loop animationData={loader} />
              </div>
            </div>
            <div>{timer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};


