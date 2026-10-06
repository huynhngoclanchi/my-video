import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS, sans, script, serif } from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Hiện dần + trượt nhẹ lên.
const Reveal: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 28], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * 24}px)`,
        filter: `blur(${(1 - t) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Ornament: React.FC<{ width?: number }> = ({ width = 420 }) => (
  <svg width={width} height={24} viewBox="0 0 420 24">
    <line x1="0" y1="12" x2="180" y2="12" stroke={COLORS.gold} strokeWidth="1.5" />
    <line x1="240" y1="12" x2="420" y2="12" stroke={COLORS.gold} strokeWidth="1.5" />
    <path
      d="M210 2 L220 12 L210 22 L200 12 Z"
      fill="none"
      stroke={COLORS.gold}
      strokeWidth="1.5"
    />
    <circle cx="190" cy="12" r="2.5" fill={COLORS.gold} />
    <circle cx="230" cy="12" r="2.5" fill={COLORS.gold} />
  </svg>
);

export const Heart: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: "middle" }}>
    <path
      d="M12 21s-7.5-4.6-10-9.3C.3 8.2 2.3 4 6.2 4c2.3 0 4 1.3 5.8 3.4C13.8 5.3 15.5 4 17.8 4c3.9 0 5.9 4.2 4.2 7.7C19.5 16.4 12 21 12 21z"
      fill="#e0475b"
    />
  </svg>
);

const WarmBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, 600], [40, 60]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% ${shift}%, #4a2a22 0%, ${COLORS.wine} 45%, ${COLORS.night} 100%)`,
      }}
    />
  );
};

// Dòng chữ trên nền đen / nền ấm.
export const LinesScene: React.FC<{ lines: string[]; dark: boolean }> = ({
  lines,
  dark,
}) => (
  <AbsoluteFill>
    {dark ? <AbsoluteFill style={{ background: "#000" }} /> : <WarmBackground />}
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 18 }}
    >
      {lines.map((l, i) => (
        <Reveal key={i} delay={14 + i * 40}>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 76,
              color: COLORS.cream,
              textAlign: "center",
              textShadow: "0 0 30px rgba(233,199,123,0.35)",
            }}
          >
            {l}
          </div>
        </Reveal>
      ))}
    </AbsoluteFill>
  </AbsoluteFill>
);

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 330], [1, 1.06]);
  return (
    <AbsoluteFill>
      <WarmBackground />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${glow})`,
        }}
      >
        <Reveal delay={8}>
          <div
            style={{
              fontFamily: script,
              fontSize: 64,
              color: COLORS.gold,
              marginBottom: 10,
            }}
          >
            Một chặng đường – Một đời tận tâm
          </div>
        </Reveal>
        <Reveal delay={30}>
          <Ornament />
        </Reveal>
        <Reveal delay={45}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 700,
              fontSize: 150,
              letterSpacing: 14,
              background: `linear-gradient(180deg, #fff3cf 0%, ${COLORS.gold} 50%, ${COLORS.goldDeep} 100%)`,
              WebkitBackgroundClip: "text",
              color: "transparent",
              lineHeight: 1.3,
              paddingTop: 30,
              marginTop: -14,
            }}
          >
            LỄ CHIA TAY
          </div>
        </Reveal>
        <Reveal delay={75}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 50,
              color: COLORS.cream,
              letterSpacing: 2,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            KỶ NIỆM NGÀY CÔ{" "}
            <span style={{ color: COLORS.gold }}>TRẦN THỤY THU DIỄM</span> NGHỈ
            HƯU
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ marginTop: 26 }}>
            <Ornament width={300} />
          </div>
        </Reveal>
        <Reveal delay={115}>
          <div
            style={{
              fontFamily: sans,
              fontWeight: 300,
              fontSize: 36,
              color: COLORS.cream,
              letterSpacing: 4,
              marginTop: 16,
              opacity: 0.9,
            }}
          >
            Trường PT DTNT THCS&amp;THPT An Giang 1
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ChapterScene: React.FC<{ text: string; sub?: string }> = ({
  text,
  sub,
}) => (
  <AbsoluteFill>
    <WarmBackground />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Reveal delay={10}>
        <Ornament width={360} />
      </Reveal>
      <Reveal delay={20}>
        <div
          style={{
            fontFamily: script,
            fontWeight: 700,
            fontSize: 120,
            color: COLORS.gold,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            margin: "20px 0 10px",
          }}
        >
          {text}
        </div>
      </Reveal>
      {sub ? (
        <Reveal delay={50}>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 56,
              color: COLORS.cream,
              marginBottom: 20,
            }}
          >
            {sub}
          </div>
        </Reveal>
      ) : null}
      <Reveal delay={30}>
        <Ornament width={360} />
      </Reveal>
    </AbsoluteFill>
  </AbsoluteFill>
);

// Ảnh: nền mờ cùng ảnh + khung ảnh trắng, chuyển động Ken Burns.
const FramedPhoto: React.FC<{
  src: string;
  frames: number;
  index: number;
  maxH: number;
  maxW: number;
  top?: number;
}> = ({ src, frames, index, maxH, maxW, top }) => {
  const frame = useCurrentFrame();
  const dir = index % 2 === 0 ? 1 : -1;
  const progress = interpolate(frame, [0, frames], [0, 1], clamp);
  const scale = interpolate(progress, [0, 1], [1, 1.07]);
  const x = dir * interpolate(progress, [0, 1], [-14, 14]);
  const rot = ((index * 37) % 5) - 2; // -2..2 độ
  const enter = interpolate(frame, [0, 26], [0.94, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: -80,
          width: "calc(100% + 160px)",
          height: "calc(100% + 160px)",
          objectFit: "cover",
          filter: "blur(38px) brightness(0.45) saturate(1.2)",
          transform: `scale(${1.1 + progress * 0.08})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(10,5,3,0.65) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: top === undefined ? "center" : "flex-start",
          alignItems: "center",
          paddingTop: top,
        }}
      >
        <div
          style={{
            padding: 14,
            background: "#fffaf0",
            borderRadius: 6,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            transform: `translateX(${x}px) rotate(${rot * 0.6}deg) scale(${enter * scale})`,
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              display: "block",
              maxHeight: maxH,
              maxWidth: maxW,
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PhotoScene: React.FC<{
  src: string;
  frames: number;
  index: number;
  caption?: string;
}> = ({ src, frames, index, caption }) => (
  <AbsoluteFill>
    <FramedPhoto
      src={src}
      frames={frames}
      index={index}
      maxH={caption ? 820 : 900}
      maxW={1500}
      top={caption ? 50 : undefined}
    />
    {caption ? (
      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 40 }}
      >
        <Reveal delay={22}>
          <div
            style={{
              fontFamily: script,
              fontWeight: 700,
              fontSize: 84,
              color: COLORS.gold,
              textShadow: "0 3px 18px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)",
            }}
          >
            {caption}
          </div>
        </Reveal>
      </AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);

export const QuoteScene: React.FC<{
  src: string;
  lines: string[];
  frames: number;
  index: number;
}> = ({ src, lines, frames, index }) => (
  <AbsoluteFill>
    <FramedPhoto
      src={src}
      frames={frames}
      index={index}
      maxH={lines.length > 1 ? 640 : 720}
      maxW={1300}
      top={50}
    />
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: lines.length > 1 ? 48 : 70,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(15,8,5,0.75) 100%)",
      }}
    >
      {lines.map((l, i) => (
        <Reveal key={i} delay={20 + i * 45}>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 62,
              lineHeight: 1.35,
              color: COLORS.cream,
              textAlign: "center",
              textShadow: "0 3px 16px rgba(0,0,0,0.95)",
            }}
          >
            {l}
          </div>
        </Reveal>
      ))}
    </AbsoluteFill>
  </AbsoluteFill>
);

export const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = 1 + 0.08 * Math.max(0, Math.sin((frame - 60) / 7));
  return (
    <AbsoluteFill>
      <WarmBackground />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Reveal delay={12}>
          <div
            style={{
              fontFamily: script,
              fontWeight: 700,
              fontSize: 120,
              color: COLORS.gold,
              textAlign: "center",
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            Mái trường sẽ luôn nhớ về Cô.
          </div>
        </Reveal>
        <Reveal delay={50}>
          <div style={{ marginTop: 30, transform: `scale(${beat})` }}>
            <Heart size={110} />
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FinalScene: React.FC<{ src: string; frames: number; index: number }> = ({
  src,
  frames,
  index,
}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [frames - 75, frames - 5], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <FramedPhoto src={src} frames={frames} index={index} maxH={900} maxW={1600} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
