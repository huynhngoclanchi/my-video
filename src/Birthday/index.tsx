import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, FONT_DISPLAY } from "./fonts";

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

const ACCENT = "#FF5C7A";
const WARM = "#FFB547";

// ---------- Visual building blocks ----------

const Photo: React.FC<{
  src: string;
  fit?: "cover" | "contain";
  zoom?: [number, number];
  pos?: string;
  dim?: number;
}> = ({ src, fit = "cover", zoom = [1, 1.08], pos = "50% 50%", dim = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], zoom);
  const file = staticFile(`media/${src}`);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1110", overflow: "hidden" }}>
      {fit === "contain" ? (
        <Img
          src={file}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(40px) brightness(0.75) saturate(1.2)",
            transform: "scale(1.2)",
          }}
        />
      ) : null}
      <Img
        src={file}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: fit,
          objectPosition: pos,
          transform: `scale(${scale})`,
          filter: "saturate(1.06) contrast(1.03)",
        }}
      />
      {dim > 0 ? (
        <AbsoluteFill style={{ backgroundColor: `rgba(20,10,10,${dim})` }} />
      ) : null}
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ src: string; from: number }> = ({ src, from }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <OffthreadVideo
      src={staticFile(`media/${src}`)}
      startFrom={s(from)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

// Soft gradient so captions stay readable on any photo
const Shade: React.FC<{ side: "top" | "bottom" }> = ({ side }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(${side === "top" ? "180deg" : "0deg"}, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 38%)`,
    }}
  />
);

const Caption: React.FC<{
  small?: string;
  big: string;
  side?: "top" | "bottom";
  color?: string;
  tilt?: number;
  bigDelay?: number;
}> = ({ small, big, side = "top", color = ACCENT, tilt = -2, bigDelay = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const b = spring({
    frame: frame - bigDelay,
    fps,
    config: { damping: 11, stiffness: 180 },
  });
  return (
    <>
      <Shade side={side} />
      <AbsoluteFill
        style={{
          justifyContent: side === "top" ? "flex-start" : "flex-end",
          alignItems: "center",
          padding: side === "top" ? "190px 70px 0" : "0 70px 260px",
          fontFamily: FONT,
          textAlign: "center",
        }}
      >
        {small ? (
          <div
            style={{
              color: "white",
              fontSize: 58,
              fontWeight: 700,
              textShadow: "0 4px 18px rgba(0,0,0,0.55)",
              opacity: a,
              transform: `translateY(${(1 - a) * 30}px)`,
              marginBottom: 18,
            }}
          >
            {small}
          </div>
        ) : null}
        <div
          style={{
            backgroundColor: color,
            color: "white",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: "pre-line",
            padding: "14px 34px 18px",
            borderRadius: 28,
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
            transform: `scale(${0.6 + 0.4 * b}) rotate(${tilt}deg)`,
            opacity: Math.min(1, b * 1.5),
          }}
        >
          {big}
        </div>
      </AbsoluteFill>
    </>
  );
};

// White flash used on strong beats
const Flash: React.FC<{ len?: number; peak?: number }> = ({
  len = 8,
  peak = 0.85,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, len], [peak, 0], {
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: "white", opacity: o }} />;
};

// ---------- Scenes ----------

const MONTAGE = [
  "p00.jpg",
  "p01.jpg",
  "p03.jpg",
  "p04.jpg",
  "p08.jpg",
  "p09.jpg",
  "p11.jpg",
  "p12.jpg",
  "p15.jpg",
  "p16.jpg",
  "p22.jpg",
  "p24.jpg",
];
const LANDSCAPE = new Set(["p03.jpg", "p12.jpg", "p27.jpg"]);

const CounterIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.min(11, Math.floor(frame / s(0.25)));
  const local = frame - step * s(0.25);
  const pop = spring({
    frame: local,
    fps,
    config: { damping: 9, stiffness: 260 },
  });
  return (
    <AbsoluteFill>
      {MONTAGE.map((src, i) => (
        <Sequence
          key={src}
          from={i * s(0.25)}
          durationInFrames={i === 11 ? s(0.5) : s(0.25)}
          layout="none"
        >
          <Photo
            src={src}
            fit={LANDSCAPE.has(src) ? "contain" : "cover"}
            zoom={[1.12, 1.0]}
            dim={0.35}
          />
        </Sequence>
      ))}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONT_DISPLAY,
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 380,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -10,
            textShadow: "0 10px 50px rgba(0,0,0,0.5)",
            transform: `scale(${0.8 + 0.2 * pop})`,
            color: step === 11 ? WARM : "white",
          }}
        >
          {String(step + 1).padStart(2, "0")}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: 18,
            textTransform: "uppercase",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          năm
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const QuickCuts: React.FC<{ items: string[]; each: number }> = ({
  items,
  each,
}) => (
  <>
    {items.map((src, i) => (
      <Sequence
        key={src}
        from={i * s(each)}
        durationInFrames={s(each)}
        layout="none"
      >
        <Photo
          src={src}
          fit={LANDSCAPE.has(src) ? "contain" : "cover"}
          zoom={i % 2 ? [1.0, 1.1] : [1.1, 1.0]}
        />
        <Flash len={4} peak={0.35} />
      </Sequence>
    ))}
  </>
);

const BirthdayTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 8, stiffness: 200 } });
  const b = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  return (
    <>
      <Shade side="top" />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 150,
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 230,
            lineHeight: 1,
            color: WARM,
            textShadow: "0 10px 40px rgba(0,0,0,0.45)",
            transform: `scale(${a})`,
          }}
        >
          19.10
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 84,
            letterSpacing: 6,
            marginTop: 10,
            textShadow: "0 6px 24px rgba(0,0,0,0.5)",
            opacity: b,
            transform: `translateY(${(1 - b) * 40}px)`,
          }}
        >
          HAPPY BIRTHDAY 🎂
        </div>
      </AbsoluteFill>
    </>
  );
};

const CONFETTI_COLORS = [ACCENT, WARM, "#7FD1FF", "#FFFFFF", "#B98CFF"];
const Confetti: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(46).fill(0).map((_, i) => {
        // deterministic pseudo-random per piece
        const r = (k: number) => {
          const x = Math.sin(i * 97.3 + k * 13.7) * 43758.5453;
          return x - Math.floor(x);
        };
        const x = r(1) * 1080;
        const speed = 7 + r(2) * 9;
        const y = -60 - r(3) * 500 + frame * speed;
        const rot = frame * (4 + r(4) * 8) + r(5) * 360;
        const sway = Math.sin(frame / 9 + i) * 24;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: 16 + r(6) * 12,
              height: 9 + r(7) * 8,
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              borderRadius: 3,
              transform: `rotate(${rot}deg)`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const FinalWish: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = ["lớp ngoan", "lương tăng", "ít họp 😆"];
  const sign = spring({
    frame: frame - s(1.4),
    fps,
    config: { damping: 14 },
  });
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 36%, rgba(0,0,0,0.5) 48%, rgba(0,0,0,0.5) 58%, rgba(0,0,0,0) 66%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 770,
          fontFamily: FONT,
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            textShadow: "0 4px 18px rgba(0,0,0,0.5)",
            marginBottom: 22,
          }}
        >
          Chúc em tuổi mới:
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {lines.map((l, i) => {
            const p = spring({
              frame: frame - 6 - i * s(0.25),
              fps,
              config: { damping: 10, stiffness: 200 },
            });
            return (
              <div
                key={l}
                style={{
                  backgroundColor: [ACCENT, WARM, "#5BB8F0"][i],
                  borderRadius: 24,
                  padding: "10px 26px 14px",
                  fontSize: 54,
                  fontWeight: 700,
                  transform: `scale(${p}) rotate(${[-3, 2, -2][i]}deg)`,
                }}
              >
                {l}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 54,
            fontWeight: 600,
            opacity: sign,
            transform: `translateY(${(1 - sign) * 20}px)`,
            textShadow: "0 4px 18px rgba(0,0,0,0.6)",
            lineHeight: 1.35,
          }}
        >
          Chèo tiếp năm thứ 13 nha! 🚣‍♀️
          <br />
          <span style={{ fontSize: 48, color: WARM }}>— Cô Chi 💛</span>
        </div>
      </AbsoluteFill>
    </>
  );
};

const FadeOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames - 1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ backgroundColor: "#140c0a", opacity: o }} />;
};

// ---------- Timeline (seconds; music is 120 BPM, a beat every 0.5 s) ----------

export const DURATION = s(30);

export const Birthday: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("media/music.m4a")} />

      {/* 0–3 s: 12 photos, counter 01 → 12 */}
      <Sequence durationInFrames={s(3)}>
        <CounterIntro />
      </Sequence>

      {/* 3–5 s: hook line */}
      <Sequence from={s(3)} durationInFrames={s(2)}>
        <Photo src="p28.jpg" zoom={[1.0, 1.1]} />
        <Caption small="12 năm quen nhau," big="vẫn chưa chán nhau 😄" bigDelay={s(0.5)} />
        <Flash />
      </Sequence>

      {/* 5–10.5 s: the café clip, cô giảng – em "phản biện" */}
      <Sequence from={s(5)} durationInFrames={s(5.5)}>
        <Clip src="v07.mp4" from={1.2} />
      </Sequence>
      <Sequence from={s(5)} durationInFrames={s(3.5)}>
        <Caption small="Ngày xưa:" big="cô giảng, em nghe 📚" />
      </Sequence>
      <Sequence from={s(8.5)} durationInFrames={s(2)}>
        <Caption small="Còn bây giờ…" big={"em được quyền\n“phản biện” 🙋‍♀️"} color="#5BB8F0" tilt={2} />
      </Sequence>

      {/* 10.5–16.5 s: student → colleague */}
      <Sequence from={s(10.5)} durationInFrames={s(2)}>
        <Photo src="p20.jpg" fit="contain" zoom={[1.0, 1.08]} />
        <Caption small="Rồi một ngày," big="cô học trò ấy…" side="bottom" />
        <Flash />
      </Sequence>
      <Sequence from={s(12.5)} durationInFrames={s(2)}>
        <Photo src="p17.jpg" zoom={[1.08, 1.0]} pos="50% 35%" />
        <Caption small="…trở thành" big="đồng nghiệp của cô ✨" side="bottom" color={WARM} tilt={2} />
      </Sequence>
      <Sequence from={s(14.5)} durationInFrames={s(2)}>
        <Photo src="p14.jpg" zoom={[1.0, 1.1]} pos="40% 50%" />
        <Caption small="Giờ thì" big={"chung thuyền,\nchung mái chèo 🚣‍♀️"} side="bottom" />
      </Sequence>

      {/* 16.5–21 s: the fun side */}
      <Sequence from={s(16.5)} durationInFrames={s(2.5)}>
        <Clip src="v13.mp4" from={4.5} />
        <Caption small="Ngoài giờ lên lớp:" big="chung team TikTok 💃" bigDelay={s(0.5)} />
        <Flash len={6} peak={0.6} />
      </Sequence>
      <Sequence from={s(19)} durationInFrames={s(2)}>
        <Clip src="v23.mp4" from={2} />
        <Caption small="Càng đông" big="càng “quẩy” 🕶️" side="bottom" color="#B98CFF" tilt={2} bigDelay={2} />
      </Sequence>

      {/* 21–23.5 s: rapid memories on every beat */}
      <Sequence from={s(21)} durationInFrames={s(2.5)}>
        <QuickCuts
          items={["p27.jpg", "p19.jpg", "p26.jpg", "p02.jpg", "p05.jpg"]}
          each={0.5}
        />
      </Sequence>

      {/* 23.5–25 s: music break – the comic pause */}
      <Sequence from={s(23.5)} durationInFrames={s(1.5)}>
        <Photo src="p25.jpg" zoom={[1.0, 1.15]} pos="50% 60%" dim={0.15} />
        <Caption small="Khoan đã…" big="hôm nay ngày gì nhỉ? 🤔" bigDelay={s(0.5)} />
      </Sequence>

      {/* 25–27 s: the drop – birthday reveal */}
      <Sequence from={s(25)} durationInFrames={s(2)}>
        <Photo src="p06.jpg" fit="contain" zoom={[1.05, 1.15]} pos="50% 60%" />
        <BirthdayTitle />
        <Flash len={10} peak={1} />
      </Sequence>

      {/* 27–30 s: wish + final frame */}
      <Sequence from={s(27)} durationInFrames={s(3)}>
        <Photo src="p10.jpg" zoom={[1.0, 1.07]} pos="50% 40%" />
        <Confetti />
        <FinalWish />
        <Flash len={6} peak={0.5} />
        <FadeOut />
      </Sequence>
    </AbsoluteFill>
  );
};
