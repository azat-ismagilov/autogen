import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { z } from "zod";

export const portoIntroSchema = z.object({});

export const PortoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pavementSlide = spring({
    frame,
    fps,
    config: { mass: 0.5, damping: 20 },
  });

  const housesScale = spring({
    frame: frame - 15,
    fps,
    config: { mass: 0.8, damping: 15 },
  });

  const tramSlide = spring({
    frame: frame - 30,
    fps,
    config: { mass: 0.5, damping: 20 },
  });

  return (
    <AbsoluteFill className="bg-white">
      <img
        src={staticFile("houses.svg")}
        className="absolute top-0 left-0 w-full"
        style={{
          transform: `scale(${housesScale})`,
          transformOrigin: "center bottom",
        }}
        alt="Porto houses"
      />
      <img
        src={staticFile("pavement.svg")}
        className="absolute bottom-0 left-0 w-full"
        style={{
          transform: `translateX(${(1 - pavementSlide) * -100}%)`,
        }}
        alt="Porto pavement"
      />
      <img
        src={staticFile("tram.svg")}
        className="absolute bottom-[20%] w-[30%]"
        style={{
          transform: `translateX(${(1 - tramSlide) * 100}vw)`,
        }}
        alt="Porto tram"
      />
    </AbsoluteFill>
  );
};
