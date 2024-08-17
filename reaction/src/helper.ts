
import { staticFile } from "remotion";

export const videoSrc = (path: string, videoServer?: string) => {
    return videoServer ? `${videoServer}/${path}` : staticFile(path);
};


export function sequenceGenerator(firstValue: number, distance: number, delay: number, count: number): number[] {
    let term = firstValue;
    const sequence: number[] = [];
    for (let i = 1; i <= count; i++) {
        sequence.push(term);
        term += distance;
        sequence.push(term);
        term += delay;
    }
    return sequence;
};

export function repeatArray<T>(array: T[], times: number): T[] {
    const repeatedArray: T[] = [];

    for (let i = 0; i < times; i++) {
        repeatedArray.push(...array);
    }

    return repeatedArray;
}