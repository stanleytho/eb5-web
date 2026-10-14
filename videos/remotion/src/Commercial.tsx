import {
  AbsoluteFill, Easing, Html5Audio, Img, OffthreadVideo, Sequence, getStaticFiles, interpolate,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import credits from "../public/footage/CREDITS.json";
import { DISCLAIMER, DISCLAIMER_VI, SCENES, Scene } from "./scenes";

const { fontFamily: serif } = loadPlayfair("normal", { weights: ["700"], subsets: ["latin", "latin-ext", "vietnamese"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext", "vietnamese"] });
const GOLD = "#c9a84c";
const NAVY = "#0d2545";
const FADE = 12; // frames of cross-fade between scenes

const has = (path: string) => getStaticFiles().some((f) => f.name === path);

export const totalFrames = (fps: number) => Math.round(SCENES.reduce((s, c) => s + c.seconds, 0) * fps);

const Footage: React.FC<{ file: string; index: number }> = ({ file, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.08]); // slow push-in so stills/clips never feel static
  const pan = interpolate(frame, [0, durationInFrames], [0, 40]) * (index % 2 ? -1 : 1); // alternate pan direction scene to scene
  const fill: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom + 0.05}) translateX(${pan}px)` };
  const path = `footage/${file}`;
  if (!has(path)) {
    return (
      <AbsoluteFill style={{ background: `linear-gradient(160deg, ${NAVY}, #1a3a6b)`, alignItems: "center", justifyContent: "center", fontFamily: sans, color: GOLD, fontSize: 40, letterSpacing: 4 }}>
        ADD public/{path}
      </AbsoluteFill>
    );
  }
  return /\.(mp4|mov|webm)$/i.test(file)
    ? <OffthreadVideo src={staticFile(path)} muted style={fill} />
    : <Img src={staticFile(path)} style={fill} />;
};

const SceneView: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - FADE, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const rise = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(frame, [delay, delay + 18], [40, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
  });
  const last = index === SCENES.length - 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut), background: "#000" }}>
      <Footage file={scene.footage} index={index} />
      {/* bottom-up scrim keeps text legible on any footage */}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(5,15,30,0.92) 0%, rgba(5,15,30,0.55) 42%, rgba(5,15,30,0) 70%)" }} />
      <div style={{ position: "absolute", left: 140, right: 140, bottom: 250, fontFamily: sans, color: "#fff" }}>
        {scene.kicker && <p style={{ ...rise(6), margin: 0, fontWeight: 600, fontSize: 28, letterSpacing: 9, textTransform: "uppercase", color: GOLD }}>{scene.kicker}</p>}
        <h1 style={{ ...rise(12), margin: "14px 0 0", fontFamily: serif, fontWeight: 700, fontSize: 92, lineHeight: 1.1, maxWidth: 1500 }}>{scene.head}</h1>
        {scene.chips && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
            {scene.chips.map((c, i) => (
              <span key={c} style={{ ...rise(24 + i * 6), padding: "8px 22px", border: `2px solid ${GOLD}`, color: "#fff", background: "rgba(13,37,69,0.7)", fontSize: 32, fontWeight: 500 }}>{c}</span>
            ))}
          </div>
        )}
        {last && <p style={{ ...rise(40), margin: "28px 0 0", fontSize: 20, lineHeight: 1.45, color: "#c3cbda", fontWeight: 400 }}>{DISCLAIMER}<br />{DISCLAIMER_VI}</p>}
      </div>
      {/* Vietnamese subtitles */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 190, padding: "0 160px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "rgba(5,15,30,0.82)", borderTop: `3px solid ${GOLD}`, fontFamily: sans, fontWeight: 500, fontSize: 40, lineHeight: 1.4, color: "#fff", opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {scene.vi}
      </div>
      <div style={{ position: "absolute", top: 44, right: 80, fontFamily: serif, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: GOLD, textShadow: "0 2px 8px #000" }}>BD VENTURES</div>
      <div style={{ position: "absolute", top: 1080 - 190 - 34, right: 40, fontFamily: sans, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>{(credits as Record<string, string>)[scene.footage.slice(0, 2)]?.split(" — ").slice(1, 3).join(" · ")}</div>
      {scene.illustrative && <div style={{ position: "absolute", top: 50, left: 80, fontFamily: sans, fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.85)", textShadow: "0 2px 8px #000" }}>Illustrative footage</div>}
    </AbsoluteFill>
  );
};

export const Commercial: React.FC = () => {
  const { fps } = useVideoConfig();
  let from = 0;
  const voice = ["voiceover.mp3", "voiceover.m4a", "voiceover.wav"].map((f) => `audio/${f}`).find(has);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SCENES.map((scene, i) => {
        const start = from;
        const len = Math.round(scene.seconds * fps);
        from += len;
        return (
          <Sequence key={scene.footage} from={start} durationInFrames={len} premountFor={fps} name={`${i + 1} ${scene.head}`}>
            <SceneView scene={scene} index={i} />
          </Sequence>
        );
      })}
      {voice && <Html5Audio src={staticFile(voice)} />}
      {has("audio/music.mp3") && <Html5Audio src={staticFile("audio/music.mp3")} volume={0.12} />}
    </AbsoluteFill>
  );
};
