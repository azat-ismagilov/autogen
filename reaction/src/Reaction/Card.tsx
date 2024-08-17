import React from 'react';
import { Img, useVideoConfig, interpolate, useCurrentFrame, Easing } from 'remotion'
import { Lottie } from '@remotion/lottie';
import loader from './data.json';
import { FitText } from './FitText';


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


  const opacityOut = interpolate(frame, [animationStart - 10, animationStart + 5], [1, 0]);

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
    <div className="h-full w-full">
      <div className="bg-gray-800 rounded absolute top-[-48px] p-4" style={{ right: `${placePositionPercent}%` }}>
        <div className="text-[40px] leading-none">
          {place}{getOrdinal(place)}  place
        </div>
      </div>
      <div className="w-full h-full rounded pl-[40px] pr-[40px] overflow-hidden gap-[31px] flex justify-stretch" style={{ background: color }}>
        <Img className="self-center w-auto h-auto max-w-[150px] max-h-[150px]" src={logoPath} />
        <div className="w-full h-full max-h-full py-8 grow grid grid-cols-[550px_max-content] justify-between gap-y-5">
          <div className="place-self-stretch h-full w-full">
            <FitText text={title} />
          </div>
          <div className="place-self-center justify-self-center font-bold leading-none uppercase font-mono text-[170px]">{task}</div>
          <div className="text-[30px] leading-none break-words">
            {subtitle} {hashtag}
          </div>
          <div className="justify-self-center justify-start items-start inline-flex gap-[15px] text-[30px] font-mono leading-none">
            <div className="flex flex-col items-end justify-start">
              <div style={{ opacity: 1 - opacityOut }}>{outcome}</div>
              <div className="mt-[-40px] h=[30px]" style={{ opacity: opacityOut }}>
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


