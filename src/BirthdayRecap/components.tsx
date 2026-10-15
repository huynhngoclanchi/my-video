import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EMOJI, SCRIPT_FONT, TITLE_FONT } from "./fonts";

export const COLORS = {
  pink: "#F7A8B8",
  cherry: "#D62839",
  cream: "#FFF4E6",
  ink: "#1E1416",
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type Timed = {
  readonly from: number;
  readonly durationInFrames: number;
  readonly name?: string;
};

/* ---------- Photos ---------- */

type PhotoProps = Timed & {
  readonly src: string;
  /** Landscape photo: show it whole over a blurred copy (CapCut "Canvas → Blur"). */
  readonly blurBg?: string;
  readonly zoom?: [number, number];
  readonly origin?: string;
  readonly popIn?: boolean;
};

const PhotoInner: React.FC<Omit<PhotoProps, keyof Timed> & { dur: number }> = ({
  src,
  blurBg,
  zoom = [1.05, 1.15],
  origin = "50% 50%",
  popIn,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = popIn
    ? spring({ frame, fps, config: { damping: 14, stiffness: 220 } })
    : 1;
  const z = interpolate(frame, [0, dur], zoom, {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });

  if (blurBg) {
    return (
      <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
        <Img
          src={staticFile(blurBg)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: "1.15",
            filter: "brightness(0.75)",
          }}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              objectFit: "contain",
              scale: `${z * (0.85 + 0.15 * pop)}`,
              transformOrigin: origin,
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.ink }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: `${z * (0.9 + 0.1 * pop)}`,
          transformOrigin: origin,
        }}
      />
    </AbsoluteFill>
  );
};

export const Photo: React.FC<PhotoProps> = ({
  from,
  durationInFrames,
  name,
  ...rest
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={name ?? rest.src}
      from={from}
      durationInFrames={durationInFrames}
      premountFor={fps}
    >
      <PhotoInner {...rest} dur={durationInFrames} />
    </Sequence>
  );
};

/* ---------- Friends' story screenshots ---------- */

const StoryInner: React.FC<{ readonly src: string; readonly dur: number }> = ({
  src,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(40px) brightness(0.55)",
          scale: "1.2",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: 900,
            borderRadius: 36,
            boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
            scale: `${interpolate(pop, [0, 1], [0.8, 1]) * interpolate(frame, [0, dur], [1, 1.04], clamp)}`,
            rotate: `${interpolate(pop, [0, 1], [-4, 0])}deg`,
            opacity: interpolate(frame, [0, 4], [0, 1], clamp),
            translate: "0px -40px",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Story: React.FC<Timed & { readonly src: string }> = ({
  from,
  durationInFrames,
  name,
  src,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={name ?? src}
      from={from}
      durationInFrames={durationInFrames}
      premountFor={fps}
    >
      <StoryInner src={src} dur={durationInFrames} />
    </Sequence>
  );
};

/* ---------- Grid card for the "inbox overload" wall ---------- */

export const GridCard: React.FC<
  Timed & {
    readonly src: string;
    readonly left: number;
    readonly top: number;
    readonly tilt: number;
  }
> = ({ from, durationInFrames, name, src, left, top, tilt }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={name ?? src}
      from={from}
      durationInFrames={durationInFrames}
      premountFor={fps}
    >
      <GridCardInner src={src} left={left} top={top} tilt={tilt} />
    </Sequence>
  );
};

const GridCardInner: React.FC<{
  readonly src: string;
  readonly left: number;
  readonly top: number;
  readonly tilt: number;
}> = ({ src, left, top, tilt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 200 } });
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left,
        top,
        width: 470,
        height: 760,
        objectFit: "cover",
        objectPosition: "50% 0%",
        borderRadius: 22,
        border: "8px solid white",
        boxShadow: "0 24px 60px rgba(30,20,22,0.35)",
        scale: `${pop}`,
        rotate: `${tilt * pop}deg`,
      }}
    />
  );
};

/* ---------- Video clip ---------- */

export { OffthreadVideo } from "remotion";

/* ---------- On-screen text ---------- */

type LabelVariant = "cream" | "red" | "outline" | "script";

type LabelProps = Timed & {
  readonly children?: React.ReactNode;
  readonly variant?: LabelVariant;
  readonly top?: string;
  readonly size?: number;
  readonly tilt?: number;
  /** Reveal characters one by one (CapCut "Typewriter"). */
  readonly typewriter?: string;
  readonly fadeOutFrames?: number;
};

const variantStyle = (v: LabelVariant, size: number): React.CSSProperties => {
  switch (v) {
    case "red":
      return {
        backgroundColor: COLORS.cherry,
        color: "white",
        padding: "18px 34px",
        borderRadius: 26,
        fontWeight: 900,
        fontSize: size,
        boxShadow: "0 14px 0 rgba(30,20,22,0.35)",
      };
    case "cream":
      return {
        backgroundColor: COLORS.cream,
        color: COLORS.ink,
        padding: "18px 34px",
        borderRadius: 26,
        fontWeight: 800,
        fontSize: size,
        boxShadow: "0 14px 0 rgba(30,20,22,0.30)",
      };
    case "script":
      return {
        fontFamily: `${SCRIPT_FONT}, ${EMOJI}`,
        color: "white",
        fontWeight: 700,
        fontSize: size,
        textShadow: "0 4px 18px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.6)",
      };
    case "outline":
    default:
      return {
        color: "white",
        fontWeight: 900,
        fontSize: size,
        WebkitTextStroke: "10px " + COLORS.ink,
        paintOrder: "stroke fill",
        textShadow: "0 8px 24px rgba(0,0,0,0.45)",
      };
  }
};

const LabelInner: React.FC<
  Omit<LabelProps, keyof Timed> & { readonly dur: number }
> = ({
  children,
  variant = "cream",
  top = "42%",
  size = 66,
  tilt = -2,
  typewriter,
  fadeOutFrames = 5,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 240 } });
  const soft = variant === "script";
  const content = typewriter
    ? [...typewriter]
        .slice(
          0,
          Math.ceil(
            interpolate(
              frame,
              [0, 0.45 * fps],
              [0, [...typewriter].length],
              clamp,
            ),
          ),
        )
        .join("")
    : children;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top,
          maxWidth: 900,
          textAlign: "center",
          lineHeight: 1.25,
          fontFamily: `${TITLE_FONT}, ${EMOJI}`,
          ...variantStyle(variant, size),
          scale:
            soft || typewriter ? "1" : `${interpolate(pop, [0, 1], [0.6, 1])}`,
          rotate: `${tilt}deg`,
          translate: soft
            ? `0px ${interpolate(frame, [0, 12], [24, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px`
            : "0px 0px",
          opacity:
            interpolate(frame, [0, soft ? 12 : 3], [0, 1], clamp) *
            interpolate(frame, [dur - fadeOutFrames, dur], [1, 0], clamp),
        }}
      >
        {content}
      </div>
    </AbsoluteFill>
  );
};

export const Label: React.FC<LabelProps> = ({
  from,
  durationInFrames,
  name,
  ...rest
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={name ?? "Text"}
      from={from}
      durationInFrames={durationInFrames}
      premountFor={fps}
    >
      <LabelInner {...rest} dur={durationInFrames} />
    </Sequence>
  );
};

export const Accent: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <span style={{ color: COLORS.cherry, whiteSpace: "nowrap" }}>{children}</span>
);

/* ---------- Flash transition ---------- */

export const Flash: React.FC<Timed & { readonly color?: string }> = ({
  from,
  durationInFrames,
  name,
  color = "white",
}) => (
  <Sequence
    name={name ?? "Flash"}
    from={from}
    durationInFrames={durationInFrames}
  >
    <FlashInner color={color} dur={durationInFrames} />
  </Sequence>
);

const FlashInner: React.FC<{
  readonly color: string;
  readonly dur: number;
}> = ({ color, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity: interpolate(frame, [0, dur / 2, dur], [0, 0.85, 0], clamp),
      }}
    />
  );
};
