import React, { useEffect, useRef, useState } from 'react';
import { Img, staticFile } from 'remotion';
import useFitText from "use-fit-text";
import "@fontsource/urbanist/700.css";

export const Card: React.FC<{
  title: string;
  subtitle: string;
  hashtag: string;
  logoPath: string;
  task: string;
  color: string;
}> = ({ title, subtitle, hashtag, logoPath, task, color }) => {
  const { fontSize, ref } = useFitText({ maxFontSize: 2000 });
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef?.current?.clientHeight) {
      return;
    }
    setHeight(contentRef?.current?.clientHeight);
  }, [contentRef?.current?.clientHeight]);

  return (
    <div className="w-full rounded pl-[40px] pr-[60px] overflow-hidden justify-start items-start gap-[200px] inline-flex" style={{ background: color }}>
      <div ref={contentRef} className="py-[30px] justify-start items-start gap-[31px] inline-flex">
        <Img className="h-[150px] w-[150px]" src={staticFile(logoPath)} />
        <div className="flex-col justify-start items-start inline-flex gap-[16px]">
          <div className="w-[460px] font-bold text-[63px] leading-[63px] uppercase">{title}</div>
          <div className="justify-start items-start inline-flex gap-[17px] text-[40px]">
            <div>{hashtag}</div>
            <div className="opacity-50">{subtitle}</div>
          </div>
        </div>
      </div>
      <div ref={ref} className="w-auto text-right font-bold uppercase" style={{
        fontSize,
        height
      }}>
        {task}
      </div>
    </div>
  );
};


