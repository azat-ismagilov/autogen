import React from 'react';
import useFitText from 'use-fit-text';

export const FullSizeText: React.FC<{
    text: string;
}> = ({ text }) => {
    const { fontSize, ref } = useFitText({ maxFontSize: 100000 })

    return (
        <p ref={ref} className="m-auto w-5/6 max-h-[90%] text-center font-bold" style={{ fontSize }}>{text}</p>
    );
};
