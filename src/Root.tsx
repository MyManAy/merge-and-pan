import { Composition, getStaticFiles } from "remotion";
import Comp1 from "./Composition2";
import { FRAMES_PER_PHOTO, FRAMES_PER_SECOND } from "./constants";

const photos = getStaticFiles();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={Comp1}
        durationInFrames={
          photos.length * FRAMES_PER_PHOTO - FRAMES_PER_SECOND * 2
        }
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
