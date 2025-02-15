import "./index.css";
import { Composition } from "remotion";
import { PortoIntro, portoIntroSchema } from "./PortoIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PortoIntro"
        component={PortoIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={portoIntroSchema}
        defaultProps={{}}
      />
    </>
  );
};
