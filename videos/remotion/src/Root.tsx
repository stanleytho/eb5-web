import { Composition } from "remotion";
import { Commercial, totalFrames } from "./Commercial";

export const RemotionRoot: React.FC = () => (
  <Composition id="VenetaCommercial" component={Commercial} width={1920} height={1080} fps={30} durationInFrames={totalFrames(30)} />
);
