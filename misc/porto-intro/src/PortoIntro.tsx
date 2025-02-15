import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  interpolate,
  Easing,
  Img,
} from "remotion";
import { z } from "zod";

export const portoIntroSchema = z.object({});

export const Cloud: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => (
  <Img
    src={staticFile("cloud.svg")}
    className={className}
    style={style}
    alt="Cloud"
  />
);

export const PortoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trainRideDuration = fps * 1;
  const trainDelay = fps * 0.5;

  // Train movement from right to center with bounce
  const tramSlide =
    interpolate(frame, [0, trainDelay + trainRideDuration], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.inOut(Easing.quad),
    }) * 2200;

  const constantSpeed = (frame / fps) * 500;

  const trainMoving = tramSlide;

  // Train bounce animation
  const tramBounce = Math.sin(frame * 0.2) * 5;

  const housesMove = (trainMoving + constantSpeed) * 0.15;

  const pavementMove = (trainMoving + constantSpeed) * 0.19;

  const cloudMove = (trainMoving + constantSpeed) * 0.01;

  return (
    <AbsoluteFill className="bg-sky-400">
      <div
        className="absolute w-full h-full"
        style={{
          scale: `${
            interpolate(
              frame,
              [
                trainDelay + trainRideDuration - fps * 1,
                trainDelay + trainRideDuration + fps * 0.3,
              ],
              [40, 190],
              {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
                easing: Easing.inOut(Easing.cubic),
              },
            ) *
            interpolate(frame, [0, trainDelay + trainRideDuration], [1, 1.1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            })
          }%`,
          top: `${interpolate(
            frame,
            [
              trainDelay + trainRideDuration - fps * 1,
              trainDelay + trainRideDuration + fps * 0.3,
            ],
            [20, -27],
            {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
              easing: Easing.inOut(Easing.cubic),
            },
          )}%`,
        }}
      >
        <div
          className="absolute w-full h-full overflow-hidden top-[-20%] scale-[300%]"
          style={{
            transform: `translateX(${cloudMove}px)`,
          }}
        >
          <Cloud
            className="absolute w-[15%] opacity-90"
            style={{
              top: "15%",
              left: "20%",
            }}
          />
          <Cloud
            className="absolute w-[20%] opacity-80"
            style={{
              top: "8%",
              left: "50%",
            }}
          />
          <Cloud
            className="absolute w-[12%] opacity-85"
            style={{
              top: "20%",
              left: "75%",
            }}
          />
          <Cloud
            className="absolute w-[18%] opacity-75"
            style={{
              top: "5%",
              left: "35%",
            }}
          />
          <Cloud
            className="absolute w-[14%] opacity-95"
            style={{
              top: "25%",
              left: "60%",
            }}
          />

          <Img
            src={staticFile("Porto.svg")}
            className="absolute w-[14%] opacity-95"
            style={{
              top: "20%",
              left: "40%",
            }}
          />
        </div>
        <div
          className="absolute top-[-70%] w-full"
          style={{
            transform: `translateX(${housesMove}px)`,
          }}
        >
          <div className="flex justify-center ">
            <Img src={staticFile("houses.svg")} className="mr-[-10%]" />
            <Img
              src={staticFile("houses.svg")}
              className="mr-[-10%] mt-[30%]"
            />
            <Img src={staticFile("houses.svg")} className="mr-[-10%] mt-[5%]" />
            <Img
              src={staticFile("houses.svg")}
              className="mr-[-10%] mt-[30%]"
            />
          </div>
        </div>
        <Img
          src={staticFile("tram_with_letters.svg")}
          className="absolute bottom-[20%] w-[30%]"
          style={{
            transform: `translateX(${2860 - tramSlide}px) translateY(${tramBounce}px)`,
            zIndex: 10,
          }}
          alt="Porto tram"
        />
        <div
          className="absolute top-[55%] scale-[200%] w-full"
          style={{
            transform: `translateX(${pavementMove}px)`,
          }}
        >
          <div className="flex justify-center">
            <Img src={staticFile("pavement.svg")} className="mr-[-35%]" />
            <Img src={staticFile("pavement.svg")} className="mr-[-35%]" />
            <Img src={staticFile("pavement.svg")} className="mr-[-35%]" />
            <Img src={staticFile("pavement.svg")} className="mr-[-35%]" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
