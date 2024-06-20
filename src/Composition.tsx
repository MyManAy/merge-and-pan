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
} from "remotion";
import { FRAMES_PER_PHOTO } from "./constants";

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

  return photosWithDimensions.map((item, i) => (
    <Sequence durationInFrames={FRAMES_PER_PHOTO} from={i * FRAMES_PER_PHOTO}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <div style={{ transform: `scale(${1080 / item.height})` }}>
          <Img src={staticFile(item.name)} />
        </div>
      </AbsoluteFill>
    </Sequence>
  ));
};

export default MyComp;
