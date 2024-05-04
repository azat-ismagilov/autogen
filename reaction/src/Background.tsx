import React, { useEffect, useState } from "react";
import { getVideoMetadata } from "@remotion/media-utils";
import {
    cancelRender,
    continueRender,
    delayRender,
    Loop,
    OffthreadVideo,
    staticFile,
    useVideoConfig
} from "remotion";


export const Background: React.FC<{
    backgroundVideoPath: string
}> = ({ backgroundVideoPath }) => {
    const [duration, setDuration] = useState<null | number>(null);
    const [handle] = useState(() => delayRender());
    const { fps } = useVideoConfig();
    const src = staticFile(backgroundVideoPath);

    useEffect(() => {
        getVideoMetadata(src)
            .then(({ durationInSeconds }) => {
                setDuration(durationInSeconds);
                continueRender(handle);
            })
            .catch((err) => {
                cancelRender(handle);
                console.log(err);
            });
    }, [handle, src]);

    if (duration === null) {
        return null;
    }

    return (
        <Loop durationInFrames={Math.floor(fps * duration)}>
            <OffthreadVideo src={src} className="-rotate-90 scale-[3] -z-10" />
        </Loop>
    );
};