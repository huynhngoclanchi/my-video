import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import "@fontsource/dancing-script/700.css";
import { Audio, Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
const f = (name: string) => staticFile(`sinhnhat/${name}`);

// Nhạc nền duy nhất: "Tình bạn diệu kỳ" (remix), 135 BPM.
// Đoạn nhạc chuyển mạnh ở giây 15.306 của bài rơi đúng DROP ("…nhạc nổi lên!").
const MUSIC_FILE = "tinhban.mp3";
const MUSIC_SECTION = 15.306;

const BEAT = 0.4444;
const DROP = 16.0;
const B = (k: number) => DROP + k * BEAT;
const MUSIC_START = DROP - MUSIC_SECTION;

export const TOTAL_SEC = B(36) + 0.5;
export const DURATION = s(TOTAL_SEC);

const SANS = "'Be Vietnam Pro', sans-serif";
const HAND = "'Dancing Script', cursive";
const GOLD = "#FFD36E";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type KenBurns = { from: number; to: number; origin?: string };

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.35 }}>
      <svg width="100%" height="100%">
        <filter id={`g${frame % 6}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={frame % 6}
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${frame % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

const BlurBg: React.FC<{ src: string; old?: boolean }> = ({ src, old }) => (
  <AbsoluteFill>
    <Img
      src={src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: `blur(40px) brightness(0.7) ${old ? "sepia(0.5)" : "saturate(1.1)"}`,
        transform: "scale(1.2)",
      }}
    />
  </AbsoluteFill>
);

const Photo: React.FC<{
  src: string;
  dur: number;
  kb: KenBurns;
  old?: boolean;
  polaroid?: boolean;
  tilt?: number;
  fadeIn?: number;
  fullCover?: boolean;
}> = ({ src, dur, kb, old, polaroid, tilt = 0, fadeIn = 0, fullCover }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [kb.from, kb.to], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const opacity = fadeIn
    ? interpolate(frame, [0, fadeIn], [0, 1], clamp)
    : 1;
  const tone = old
    ? "sepia(0.45) contrast(1.05) saturate(0.85) brightness(1.02)"
    : "saturate(1.08) contrast(1.03) brightness(1.02)";

  if (fullCover) {
    return (
      <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: tone,
            transform: `scale(${scale})`,
            transformOrigin: kb.origin ?? "50% 50%",
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <BlurBg src={src} old={old} />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {polaroid ? (
          <div
            style={{
              background: "#fbf8f1",
              padding: "26px 26px 110px 26px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              transform: `rotate(${tilt}deg) scale(${scale})`,
              marginTop: -40,
            }}
          >
            <Img
              src={src}
              style={{
                display: "block",
                maxWidth: 900,
                maxHeight: 1080,
                filter: tone,
              }}
            />
          </div>
        ) : (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: tone,
              transform: `scale(${scale})`,
              transformOrigin: kb.origin ?? "50% 50%",
            }}
          />
        )}
      </AbsoluteFill>
      {old ? <Grain /> : null}
      <Vignette strength={old ? 0.6 : 0.35} />
    </AbsoluteFill>
  );
};

const Clip: React.FC<{
  src: string;
  trim: number;
  zoom?: number;
  origin?: string;
}> = ({ src, trim, zoom = 1, origin = "50% 50%" }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
    <Video
      src={src}
      trimBefore={s(trim)}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${zoom})`,
        transformOrigin: origin,
        filter: "saturate(1.08) brightness(1.03)",
      }}
    />
    <Vignette strength={0.3} />
  </AbsoluteFill>
);

type CapProps = {
  children: React.ReactNode;
  y: number;
  size?: number;
  font?: string;
  anim?: "fade" | "pop" | "rise";
  dur: number;
  color?: string;
  weight?: number;
};

const Caption: React.FC<CapProps> = ({
  children,
  y,
  size = 64,
  font = SANS,
  anim = "rise",
  dur,
  color = "white",
  weight = 800,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, anim === "pop" ? 7 : 9], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(anim === "pop" ? 2.2 : 1)),
  });
  const out = interpolate(frame, [dur - 5, dur], [1, 0], clamp);
  const ty = anim === "rise" ? (1 - inP) * 30 : 0;
  const sc = anim === "pop" ? 0.6 + 0.4 * inP : 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.25,
          color,
          opacity: Math.min(inP * 1.4, 1) * out,
          transform: `translateY(${ty}px) scale(${sc})`,
          textShadow:
            "0 3px 14px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)",
          letterSpacing: font === SANS ? -0.5 : 0,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Typewriter: React.FC<{
  text: string;
  y: number;
  size?: number;
  cps?: number;
  dur: number;
}> = ({ text, y, size = 58, cps = 32, dur }) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text.normalize("NFC"));
  const shown = Math.floor((frame / FPS) * cps);
  const out = interpolate(frame, [dur - 5, dur], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: y,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.3,
          color: "white",
          opacity: out,
          textShadow: "0 3px 14px rgba(0,0,0,0.8)",
        }}
      >
        {chars.slice(0, shown).join("")}
      </div>
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ dur: number; peak?: number }> = ({
  dur,
  peak = 1,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, dur], [0, peak, 0], clamp);
  return <AbsoluteFill style={{ backgroundColor: "white", opacity: o }} />;
};

const YearCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const years = [2014, 2017, 2020, 2023, 2026];
  const idx = Math.min(years.length - 1, Math.floor(frame / 2.5));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 190,
          color: "white",
          letterSpacing: -4,
          textShadow: "0 6px 30px rgba(0,0,0,0.8)",
        }}
      >
        {years[idx]}
      </div>
    </AbsoluteFill>
  );
};

const Sparkles: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = Array.from({ length: 26 }, (_, i) => {
    const x = (i * 397) % 1080;
    const speed = 2 + ((i * 7) % 5);
    const y = 1920 - ((frame * speed + i * 173) % 2100);
    const r = 4 + ((i * 13) % 7);
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 6 + i));
    const c = i % 3 === 0 ? GOLD : i % 3 === 1 ? "#ffffff" : "#FF9EC7";
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          background: c,
          opacity: tw * 0.85,
          boxShadow: `0 0 ${r * 3}px ${c}`,
        }}
      />
    );
  });
  return <AbsoluteFill>{dots}</AbsoluteFill>;
};

const FinalCard: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bgIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const out = interpolate(frame, [dur - 12, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ opacity: bgIn }}>
        <Img
          src={f("P30.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(18px) brightness(0.55) saturate(1.2)",
            transform: "scale(1.15)",
          }}
        />
      </AbsoluteFill>
      <Sparkles />
      <Sequence from={4} layout="none">
        <Caption y={640} size={130} font={HAND} weight={700} anim="pop" dur={dur - 4} color={GOLD}>
          Chúc mừng
          <br />
          sinh nhật em!
        </Caption>
      </Sequence>
      <Sequence from={16} layout="none">
        <Caption y={1060} size={58} dur={dur - 16}>
          Tuổi mới chèo khỏe nha! 🎂
        </Caption>
      </Sequence>
    </AbsoluteFill>
  );
};

type Scene = {
  start: number;
  end: number;
  el: React.ReactNode;
  fadeIn?: number;
};

export const SinhNhat: React.FC = () => {
  const scenes: Scene[] = [
    // 1. Hook — lịch lật P38
    {
      start: 0,
      end: 1.5,
      el: (
        <Photo
          src={f("P38.jpg")}
          dur={s(1.5)}
          kb={{ from: 2.1, to: 1.05, origin: "30% 84%" }}
          fullCover
        />
      ),
    },
    // 2–5. Ngày xưa
    {
      start: 1.5,
      end: 3.8,
      el: (
        <Photo src={f("P22.jpg")} dur={s(2.3)} kb={{ from: 1, to: 1.06 }} old polaroid tilt={-2} />
      ),
    },
    {
      start: 3.8,
      end: 5.6,
      fadeIn: 6,
      el: (
        <Photo src={f("P01.jpg")} dur={s(1.8)} kb={{ from: 1, to: 1.06 }} old polaroid tilt={2} fadeIn={6} />
      ),
    },
    {
      start: 5.6,
      end: 7.4,
      fadeIn: 6,
      el: (
        <Photo src={f("P03.jpg")} dur={s(1.8)} kb={{ from: 1.04, to: 1 }} old polaroid tilt={-1.5} fadeIn={6} />
      ),
    },
    {
      start: 7.4,
      end: 9.5,
      fadeIn: 6,
      el: (
        <Photo src={f("P10.jpg")} dur={s(2.1)} kb={{ from: 1, to: 1.08 }} old polaroid tilt={1.5} fadeIn={6} />
      ),
    },
    // 6–7. Hiện tại: đồng nghiệp
    {
      start: 9.5,
      end: 12.0,
      el: (
        <Photo src={f("P02.jpg")} dur={s(2.5)} kb={{ from: 1.35, to: 1.0, origin: "50% 30%" }} />
      ),
    },
    {
      start: 12.0,
      end: 14.0,
      el: <Photo src={f("P32.jpg")} dur={s(2)} kb={{ from: 1, to: 1.07, origin: "55% 35%" }} />,
    },
    // 8–9. Họp tổ / Tan họp
    { start: 14.0, end: DROP, el: <Clip src={f("V04.mp4")} trim={0} /> },
    { start: DROP, end: B(5), el: <Clip src={f("V03.mp4")} trim={8} /> },
    // 10–16. Dựng nhanh theo nhịp
    { start: B(5), end: B(7), el: <Photo src={f("P17.jpg")} dur={s(2 * BEAT)} kb={{ from: 1.08, to: 1 }} /> },
    { start: B(7), end: B(9), el: <Photo src={f("P26.jpg")} dur={s(2 * BEAT)} kb={{ from: 1.08, to: 1 }} /> },
    { start: B(9), end: B(11), el: <Photo src={f("P11.jpg")} dur={s(2 * BEAT)} kb={{ from: 1, to: 1.08 }} /> },
    { start: B(11), end: B(13), el: <Photo src={f("P08.jpg")} dur={s(2 * BEAT)} kb={{ from: 1.08, to: 1 }} /> },
    {
      start: B(13),
      end: B(16),
      el: <Clip src={f("V01.mp4")} trim={4} zoom={1.3} origin="50% 52%" />,
    },
    {
      start: B(16),
      end: B(21),
      el: <Photo src={f("P06.jpg")} dur={s(5 * BEAT)} kb={{ from: 1, to: 1.08, origin: "50% 40%" }} />,
    },
    // 17–18. Kết
    {
      start: B(21),
      end: B(26),
      fadeIn: 9,
      el: (
        <Photo src={f("P40.jpg")} dur={s(5 * BEAT)} kb={{ from: 1, to: 1.07, origin: "50% 40%" }} fadeIn={9} />
      ),
    },
    {
      start: B(26),
      end: B(32),
      el: <Photo src={f("P30.jpg")} dur={s(6 * BEAT)} kb={{ from: 1.06, to: 1, origin: "50% 45%" }} />,
    },
    {
      start: B(32),
      end: TOTAL_SEC,
      fadeIn: 8,
      el: <FinalCard dur={s(TOTAL_SEC - B(32)) + 8} />,
    },
  ];

  const caps: { at: number; until: number; el: (d: number) => React.ReactNode }[] = [
    {
      at: 0.35,
      until: 1.5,
      el: (d) => (
        <Caption y={180} size={150} anim="pop" dur={d}>
          12 NĂM
        </Caption>
      ),
    },
    {
      at: 1.65,
      until: 3.8,
      el: (d) => (
        <Typewriter y={1590} dur={d} text="12 năm trước, mọi chuyện bắt đầu bằng hai chữ…" />
      ),
    },
    {
      at: 2.75,
      until: 3.8,
      el: (d) => (
        <Caption y={110} size={120} font={HAND} weight={700} anim="pop" dur={d} color={GOLD}>
          “Thưa cô”
        </Caption>
      ),
    },
    {
      at: 3.95,
      until: 5.6,
      el: (d) => (
        <Caption y={1600} size={62} dur={d}>
          Ngày ấy, cô cầm lái…
        </Caption>
      ),
    },
    {
      at: 5.75,
      until: 7.4,
      el: (d) => (
        <Caption y={1600} size={62} dur={d}>
          …còn em là <span style={{ color: GOLD }}>khách qua sông.</span>
        </Caption>
      ),
    },
    {
      at: 8.9,
      until: 9.5,
      el: () => <YearCounter />,
    },
    {
      at: 9.75,
      until: 12.0,
      el: (d) => (
        <Caption y={1520} size={60} dur={d}>
          Rồi một ngày, khách qua sông…
          <br />
          <span style={{ color: GOLD }}>cầm luôn mái chèo.</span>
        </Caption>
      ),
    },
    {
      at: 12.25,
      until: 14.0,
      el: (d) => (
        <Caption y={110} size={60} anim="pop" dur={d}>
          Giờ thì mặc chung
          <br />
          <span style={{ color: GOLD }}>“đồng phục”</span> luôn rồi 😌
        </Caption>
      ),
    },
    {
      at: 14.15,
      until: DROP,
      el: (d) => (
        <Caption y={170} size={78} anim="pop" dur={d}>
          Ngồi cà phê thì
          <br />
          nghiêm túc lắm…
        </Caption>
      ),
    },
    {
      at: DROP,
      until: B(5),
      el: (d) => (
        <Caption y={150} size={100} anim="pop" dur={d} color={GOLD}>
          …cho tới khi
          <br />
          nhạc nổi lên! 💃
        </Caption>
      ),
    },
    {
      at: B(5),
      until: B(7),
      el: (d) => (
        <Caption y={1640} size={66} anim="pop" dur={d}>
          đi chơi chung,
        </Caption>
      ),
    },
    {
      at: B(7),
      until: B(11),
      el: (d) => (
        <Caption y={1640} size={66} anim="pop" dur={d}>
          chụp ảnh Tết chung,
        </Caption>
      ),
    },
    {
      at: B(11),
      until: B(13),
      el: (d) => (
        <Caption y={1640} size={66} anim="pop" dur={d}>
          quậy chung…
        </Caption>
      ),
    },
    {
      at: B(13),
      until: B(16),
      el: (d) => (
        <Caption y={1640} size={66} anim="pop" dur={d}>
          nhảy cũng chung luôn!
        </Caption>
      ),
    },
    {
      at: B(16) + 0.1,
      until: B(21),
      el: (d) => (
        <Caption y={1600} size={70} anim="fade" dur={d}>
          …và <span style={{ color: GOLD }}>cùng chèo tiếp.</span>
        </Caption>
      ),
    },
    {
      at: B(21) + 0.2,
      until: B(23.5),
      el: (d) => (
        <Caption y={90} size={58} anim="fade" dur={d}>
          12 năm rồi.
          <br />
          Học trò thành đồng nghiệp,
        </Caption>
      ),
    },
    {
      at: B(23.5),
      until: B(26),
      el: (d) => (
        <Caption y={90} size={58} anim="fade" dur={d}>
          khách qua sông thành
          <br />
          <span style={{ color: GOLD }}>người chèo chung.</span>
        </Caption>
      ),
    },
    {
      at: B(26) + 0.15,
      until: B(32),
      el: (d) => (
        <Caption y={110} size={54} anim="rise" dur={d}>
          Chỉ có một thứ không đổi:
        </Caption>
      ),
    },
    {
      at: B(27) + 0.2,
      until: B(32),
      el: (d) => (
        <Caption y={1560} size={66} anim="pop" dur={d}>
          đi đâu cô cũng bắt em
          <br />
          <span style={{ color: GOLD }}>chụp hình cho</span> 📸
        </Caption>
      ),
    },
  ];

  const flashes: { at: number; dur: number; peak?: number }[] = [
    { at: 1.45, dur: 7 },
    { at: 9.45, dur: 10 },
    { at: DROP - 0.03, dur: 6, peak: 0.6 },
    { at: B(5), dur: 4, peak: 0.35 },
    { at: B(9), dur: 4, peak: 0.35 },
    { at: B(13), dur: 4, peak: 0.35 },
    { at: B(26) - 0.03, dur: 8, peak: 0.95 },
  ];

  const musicVol = (fr: number) =>
    interpolate(
      fr / FPS + MUSIC_START,
      [0, 0.1, TOTAL_SEC - 1.5, TOTAL_SEC],
      [0, 0.9, 0.9, 0],
      clamp,
    );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {scenes.map((sc, i) => {
        const pre = sc.fadeIn ?? 0;
        return (
          <Sequence
            key={`scene-${i}`}
            from={s(sc.start) - pre}
            durationInFrames={s(sc.end) - s(sc.start) + pre}
            premountFor={FPS}
          >
            {sc.el}
          </Sequence>
        );
      })}
      {caps.map((c, i) => {
        const d = s(c.until) - s(c.at);
        return (
          <Sequence key={`cap-${i}`} from={s(c.at)} durationInFrames={d} layout="none">
            {c.el(d)}
          </Sequence>
        );
      })}
      {flashes.map((fl, i) => (
        <Sequence key={`fl-${i}`} from={s(fl.at)} durationInFrames={fl.dur}>
          <Flash dur={fl.dur} peak={fl.peak} />
        </Sequence>
      ))}

      <Sequence from={s(MUSIC_START)}>
        <Audio src={f(MUSIC_FILE)} volume={musicVol} />
      </Sequence>
      {[0.12, 0.55, 1.0].map((t) => (
        <Sequence key={`tick-${t}`} from={s(t)}>
          <Audio src={f("sfx/tick.wav")} volume={0.7} />
        </Sequence>
      ))}
      <Sequence from={s(9.0)}>
        <Audio src={f("sfx/scratch.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={s(12.25)}>
        <Audio src={f("sfx/ding.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={s(B(26) - 0.05)}>
        <Audio src={f("sfx/shutter.wav")} volume={0.9} />
      </Sequence>
    </AbsoluteFill>
  );
};
