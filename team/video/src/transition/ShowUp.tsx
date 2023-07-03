import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { TriangleEntrance } from "./TriangleEntrance";

export const ShowUp: React.FC<{
    children: React.ReactNode;
    delay?: number;
    durationInFrames?: number;
}> = ({ children, delay, durationInFrames }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const triangleProgress = spring({
        fps,
        frame,
        delay,
        durationInFrames,
        config: {
            mass: 3,
            damping: 200,
        },
    });

    return (
        <TriangleEntrance type="in" progress={triangleProgress}>
            {children}
        </TriangleEntrance>
    )
};
