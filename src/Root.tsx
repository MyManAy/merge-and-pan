import { Composition, getStaticFiles } from "remotion";
import Comp1 from "./Composition2";
import { FRAMES_PER_PHOTO, FRAMES_PER_ANIMATION } from "./constants";

const photos = getStaticFiles();
const TRANSITION_OVERLAP_FRAMES = FRAMES_PER_ANIMATION * (photos.length - 1);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={Comp1}
        durationInFrames={
          photos.length * FRAMES_PER_PHOTO - TRANSITION_OVERLAP_FRAMES
        }
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
