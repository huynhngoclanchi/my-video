import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ChapterScene,
  EndingScene,
  FinalScene,
  LinesScene,
  PhotoScene,
  QuoteScene,
  TitleScene,
} from "./Scenes";
import { FPS, OVERLAP, PlacedClip, placeClips } from "./timeline";

const { placed, sectionStart, total } = placeClips();
export const FAREWELL_DURATION = total;

// Nhạc: "Người gieo mầm xanh" (song0) mở đầu và kết thúc,
// đoạn kỷ niệm vui dùng "Yêu sao nghề giáo viên" (song1).
const SONG0_LENGTH = 264.2 * FPS;
const SONG1_OFFSET = 70 * FPS;
const XFADE = 3 * FPS;
const MEMORIES = sectionStart["ky-niem"];
const THANKS = sectionStart["tri-an"];
// Nối lại song0 sao cho bài hát kết thúc đúng lúc video kết thúc.
const SONG0_RESUME = Math.max(MEMORIES, SONG0_LENGTH - (total - THANKS) - FPS);

const ramp = (f: number, len: number, fadeIn: number, fadeOut: number) =>
  Math.min(
    interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(f, [len - fadeOut, len], [1, 0], { extrapolateLeft: "clamp" }),
  );

const Music: React.FC = () => {
  const firstLen = MEMORIES + XFADE;
  const secondLen = THANKS - MEMORIES + XFADE;
  const thirdLen = total - THANKS;
  return (
    <>
      <Sequence durationInFrames={firstLen} name="Nhạc 1 – Người gieo mầm xanh">
        <Html5Audio
          src={staticFile("song0.mp3")}
          volume={(f) => 0.9 * ramp(f, firstLen, 15, XFADE)}
        />
      </Sequence>
      <Sequence
        from={MEMORIES}
        durationInFrames={secondLen}
        name="Nhạc 2 – Yêu sao nghề giáo viên"
      >
        <Html5Audio
          src={staticFile("song1.mp3")}
          trimBefore={SONG1_OFFSET}
          volume={(f) => 0.8 * ramp(f, secondLen, XFADE, XFADE)}
        />
      </Sequence>
      <Sequence from={THANKS} durationInFrames={thirdLen} name="Nhạc 3 – Người gieo mầm xanh">
        <Html5Audio
          src={staticFile("song0.mp3")}
          trimBefore={SONG0_RESUME}
          volume={(f) => 0.9 * ramp(f, thirdLen, XFADE, 4 * FPS)}
        />
      </Sequence>
    </>
  );
};

// Những đốm sáng lấp lánh bay nhẹ phía trên khung hình.
const Bokeh: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const fadeEnd = interpolate(
    frame,
    [durationInFrames - 90, durationInFrames - 20],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeEnd, mixBlendMode: "screen" }}>
      {new Array(26).fill(0).map((_, i) => {
        const size = 8 + random(`s${i}`) * 26;
        const speed = 0.25 + random(`v${i}`) * 0.6;
        const x = random(`x${i}`) * width + Math.sin((frame + i * 40) / 90) * 40;
        const y =
          height + 60 - ((random(`y${i}`) * height * 1.3 + frame * speed) % (height + 120));
        const twinkle = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin((frame + i * 23) / 25));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,226,160,0.9) 0%, rgba(255,210,130,0) 70%)",
              opacity: twinkle,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const ClipView: React.FC<{ clip: PlacedClip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const opacity =
    clip.index === 0
      ? interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" })
      : interpolate(frame, [0, OVERLAP], [0, 1], { extrapolateRight: "clamp" });
  let content: React.ReactNode = null;
  switch (clip.kind) {
    case "lines":
      content = <LinesScene lines={clip.lines} dark={clip.from < sectionStart["nhin-lai"]} />;
      break;
    case "title":
      content = <TitleScene />;
      break;
    case "chapter":
      content = <ChapterScene text={clip.text} sub={clip.sub} />;
      break;
    case "photo":
      content = (
        <PhotoScene src={clip.src} frames={clip.frames} index={clip.index} caption={clip.caption} />
      );
      break;
    case "quote":
      content = (
        <QuoteScene src={clip.src} lines={clip.lines} frames={clip.frames} index={clip.index} />
      );
      break;
    case "ending":
      content = <EndingScene />;
      break;
    case "final":
      content = <FinalScene src={clip.src} frames={clip.frames} index={clip.index} />;
      break;
  }
  return <AbsoluteFill style={{ opacity }}>{content}</AbsoluteFill>;
};

export const Farewell: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {placed.map((clip) => (
      <Sequence
        key={clip.index}
        from={clip.from}
        durationInFrames={clip.frames}
        premountFor={30}
        name={`${clip.index + 1}. ${clip.kind}`}
      >
        <ClipView clip={clip} />
      </Sequence>
    ))}
    <Bokeh />
    <Music />
  </AbsoluteFill>
);
