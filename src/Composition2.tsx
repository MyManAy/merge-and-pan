import { getImageDimensions } from "@remotion/media-utils";
import { useCallback, useEffect, useState } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  StaticFile,
  continueRender,
  delayRender,
  getStaticFiles,
  random,
  staticFile,
  useVideoConfig,
} from "remotion";
import { FRAMES_PER_ANIMATION, FRAMES_PER_PHOTO } from "./constants";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

const slideDirections = ["from-left", "from-right", "from-bottom", "from-top"];
const wipeDirections = [
  ...slideDirections,
  "from-bottom-left",
  "from-top-left",
  "from-bottom-right",
  "from-top-right",
];
const flipDirections = [...slideDirections];

const transitions = [
  {
    transition: slide,
    directions: slideDirections,
  },
  { transition: fade },
  { transition: wipe, directions: wipeDirections },
  { transition: flip, directions: flipDirections },
  { transition: clockWipe, requiresDimensions: true },
];

const shuffle = <T,>(array: T[]) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(random(null) * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getRandomTransition = () => {
  const randomTransition =
    transitions[Math.floor(random(null) * transitions.length)];
  const randomDirection =
    randomTransition.directions?.[
      Math.floor(random(null) * randomTransition.directions.length)
    ];
  if (randomDirection)
    return (randomTransition.transition as any)({ direction: randomDirection });
  if (randomTransition.requiresDimensions)
    return (randomTransition.transition as any)({ width: 1920, height: 1080 });
  return (randomTransition.transition as any)();
};

let photos = getStaticFiles();
const shuffledPhotos = shuffle(photos);

const MyComp: React.FC = () => {
  type PhotoWithDimension = StaticFile & { width: number; height: number };

  const [photosWithDimensions, setPhotosWithDimensions] = useState(
    [] as PhotoWithDimension[]
  );
  const [handle] = useState(() => delayRender());

  const fetchDimensions = useCallback(async () => {
    let _photosWithDimensions: PhotoWithDimension[] = [];

    for (const item of shuffledPhotos) {
      const { width, height } = await getImageDimensions(item.src);
      const photoWithDimension = { ...item, width, height };
      _photosWithDimensions.push(photoWithDimension);
    }

    setPhotosWithDimensions(_photosWithDimensions);

    continueRender(handle);
  }, []);

  useEffect(() => {
    fetchDimensions();
  }, []);

  return (
    <TransitionSeries style={{ backgroundColor: "black" }}>
      {photosWithDimensions.map((item, i) => (
        <>
          <TransitionSeries.Sequence durationInFrames={FRAMES_PER_PHOTO}>
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ transform: `scale(${1080 / item.height})` }}>
                <Img src={staticFile(item.name)} />
              </div>
            </AbsoluteFill>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={getRandomTransition()}
            timing={linearTiming({ durationInFrames: FRAMES_PER_ANIMATION })}
          />
        </>
      ))}
    </TransitionSeries>
  );
};

export default MyComp;
