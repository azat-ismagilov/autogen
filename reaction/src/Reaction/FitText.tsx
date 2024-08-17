import { measureText } from "@remotion/layout-utils";
import React, { useRef, useState, useEffect } from "react";

const fontFamily = "Helvetica";
const fontWeight = 700;

export const FitText: React.FC<{ text: string }> = ({ text }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            setWidth(container.clientWidth);
            setHeight(container.clientHeight);
        }
    }, []);

    console.log(width, height);

    const sampleSize = 10;

    const measure = measureText({
        fontFamily,
        text,
        fontSize: sampleSize,
        fontWeight
    });

    const measureWidth = measure.width * 1.1;
    const measureHeight = measure.height;

    const maxCompressionRatio = 2;

    const fontSize = sampleSize * Math.min(maxCompressionRatio * (width / measureWidth), height / measureHeight);

    const requiredCompressionRation = Math.min(1, width / (measureWidth * fontSize / sampleSize));

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-start">
            <div style={{ transform: `scale(${requiredCompressionRation}, 1)`, transformOrigin: 'left' }}>
                <div className="leading-none text-nowrap w-auto" style={{ fontSize, fontFamily, fontWeight }}>
                    {text}
                </div>
            </div>
        </div>
    );
};