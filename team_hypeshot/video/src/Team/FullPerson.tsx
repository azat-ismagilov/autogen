import {
    AbsoluteFill,
    Sequence,
    useVideoConfig,
} from 'remotion';

import { BigTextIntro } from './BigTextIntro';
import { BigPerson } from './BigPerson';
import { ScreenInfo } from '../Root';


export const FullPerson: React.FC<{
    data: ScreenInfo;
    backgroundColor: string;
}> = ({ data, backgroundColor }) => {
    const { title, subtitle, path } = data;
    const { durationInFrames } = useVideoConfig();
    const startSecondPart = durationInFrames / 2;

    return (
        <AbsoluteFill style={{ backgroundColor }}>
            <Sequence durationInFrames={startSecondPart + 10}>
                <BigTextIntro text={title} path={path} />
            </Sequence>
            <Sequence from={startSecondPart}>
                <BigPerson name={title} subtitle={subtitle} path={path} backgroundColor={backgroundColor} />
            </Sequence>
        </AbsoluteFill >
    );
};
