
import { staticFile } from "remotion";

export const videoSrc = (path: string, videoServer?: string) => {
    return videoServer ? `${videoServer}/${path}` : staticFile(path);
};