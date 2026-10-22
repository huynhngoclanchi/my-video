import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT = "Inter, 'Noto Color Emoji', sans-serif";
const PINK = "#ff4f9a";
const DEEP = "#7a1f5c";
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Nền gradient hồng đào
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${160 + frame * 0.15}deg, #ffd6e7 0%, #ffe9d6 45%, #c9f1ff 100%)`,
      }}
    />
  );
};

// Hoa & tim bay lơ lửng xuyên suốt video
const FloatingPetals: React.FC<{ count?: number }> = ({ count = 22 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const icons = ["🌸", "💖", "🌷", "✨", "💐", "🫶"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const speed = 2 + random(`s${i}`) * 3;
        const x = random(`x${i}`) * width + Math.sin((frame + i * 20) / 25) * 30;
        const y =
          ((random(`y${i}`) * (height + 200) - frame * speed) % (height + 200) +
            height +
            200) %
            (height + 200) -
          100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontSize: 40 + random(`f${i}`) * 40,
              opacity: 0.75,
              rotate: `${(frame * (random(`r${i}`) - 0.5) * 4) % 360}deg`,
              fontFamily: FONT,
            }}
          >
            {icons[i % icons.length]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Nhãn chữ kiểu sticker gen Z, bật lên bằng spring
const Sticker: React.FC<{
  children: React.ReactNode;
  delay?: number;
  top: number;
  rotate?: number;
  bg?: string;
  color?: string;
  size?: number;
}> = ({ children, delay = 0, top, rotate = -3, bg = "#ffffff", color = DEEP, size = 64 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 160 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: bg,
          color,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.18,
          padding: "22px 38px",
          borderRadius: 34,
          textAlign: "center",
          maxWidth: 880,
          boxShadow: `10px 10px 0 ${DEEP}`,
          border: `5px solid ${DEEP}`,
          scale: String(pop),
          rotate: `${rotate}deg`,
          opacity: interpolate(frame - delay, [0, 4], [0, 1], clamp),
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Khung ảnh polaroid có hiệu ứng Ken Burns
const Polaroid: React.FC<{
  src: string;
  top: number;
  rotate: number;
  caption: string;
  zoomFrom?: number;
  zoomTo?: number;
}> = ({ src, top, rotate, caption, zoomFrom = 1.0, zoomTo = 1.12 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 13 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        width: 980,
        background: "white",
        padding: "24px 24px 100px",
        borderRadius: 12,
        boxShadow: "0 30px 60px rgba(122,31,92,0.35)",
        rotate: `${interpolate(enter, [0, 1], [rotate * 4, rotate])}deg`,
        translate: `0px ${interpolate(enter, [0, 1], [900, 0])}px`,
      }}
    >
      <div style={{ width: 932, height: 699, overflow: "hidden", borderRadius: 6 }}>
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: String(interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], clamp)),
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Comic Sans MS', 'Segoe Print', " + FONT,
          fontWeight: 700,
          fontSize: 46,
          color: DEEP,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

// Chớp trắng chuyển cảnh
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ background: "white", opacity: interpolate(frame, [0, 2, 8], [0, 0.9, 0], clamp) }}
    />
  );
};

// Cảnh 1: Mở đầu
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const big = spring({ frame: frame - 18, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Sticker top={330} rotate={-4} bg={PINK} color="white" size={60}>
        POV: hôm nay 11A2 <br />được “tôn vinh” 👑
      </Sticker>
      <div
        style={{
          position: "absolute",
          top: 720,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 300,
          color: "white",
          WebkitTextStroke: `10px ${DEEP}`,
          textShadow: `14px 14px 0 ${PINK}`,
          scale: String(big),
          rotate: `${interpolate(big, [0, 1], [-20, 0])}deg`,
        }}
      >
        20/10
      </div>
      <div
        style={{
          position: "absolute",
          top: 1080,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 58,
          color: DEEP,
          letterSpacing: 6,
          opacity: interpolate(frame, [30, 42], [0, 1], clamp),
        }}
      >
        ✿ 2026 ✿
      </div>
      <Sticker top={1260} delay={40} rotate={3} size={52}>
        Lên đồ… à nhầm, <br />lên huy chương 🏅
      </Sticker>
    </AbsoluteFill>
  );
};

// Cảnh 5: Phóng to “huy chương độc quyền”
const MedalZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = interpolate(frame, [0, 1.6 * fps], [1, 3.2], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const shake = frame > 1.6 * fps && frame < 1.9 * fps ? Math.sin(frame * 3) * 8 : 0;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 40,
          width: 1000,
          height: 1000,
          borderRadius: 500,
          overflow: "hidden",
          border: `14px solid white`,
          boxShadow: `0 0 0 10px ${PINK}, 0 30px 80px rgba(122,31,92,0.4)`,
          translate: `${shake}px 0px`,
        }}
      >
        <Img
          src={staticFile("anh2.jpg")}
          style={{
            position: "absolute",
            width: 1800,
            height: 1350,
            left: -679,
            top: -341,
            transformOrigin: "65.5% 62.3%",
            scale: String(z),
          }}
        />
      </div>
      <Sticker top={110} rotate={-3} bg="#fff3a8" size={56}>
        Zoom cận huy chương 🔍
      </Sticker>
      <Sticker top={1340} delay={1.7 * fps} rotate={2} bg={PINK} color="white" size={62}>
        “BẠN LÀ BÔNG HOA <br />ĐẸP NHẤT” 🌸
      </Sticker>
      <Sticker top={1650} delay={2.4 * fps} rotate={-2} size={44}>
        Hàng độc quyền, không bán, chỉ tặng 💅
      </Sticker>
    </AbsoluteFill>
  );
};

// Cảnh 6: Ghép 3 ảnh
const Collage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pics = [
    { src: "anh3.jpg", top: 140, rot: -5 },
    { src: "anh1.jpg", top: 640, rot: 4 },
    { src: "anh2.jpg", top: 1140, rot: -3 },
  ];
  return (
    <AbsoluteFill>
      {pics.map((p, i) => {
        const s = spring({ frame: frame - i * 8, fps, config: { damping: 12 } });
        return (
          <div
            key={p.src}
            style={{
              position: "absolute",
              top: p.top,
              left: i === 1 ? 170 : 70,
              width: 840,
              height: 630,
              background: "white",
              padding: 16,
              borderRadius: 10,
              boxShadow: "0 20px 50px rgba(122,31,92,0.35)",
              rotate: `${p.rot}deg`,
              scale: String(s),
            }}
          >
            <Img
              src={staticFile(p.src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                scale: String(interpolate(frame, [0, 5 * fps], [1, 1.1], clamp)),
              }}
            />
          </div>
        );
      })}
      <Sticker top={1600} delay={30} rotate={-2} bg={PINK} color="white" size={50}>
        Thanh xuân có 11A2: <br />đủ xinh, đủ vui, đủ thương 🌷
      </Sticker>
    </AbsoluteFill>
  );
};

// Cảnh 7: Kết
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const heart = spring({ frame, fps, config: { damping: 7 } });
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], clamp),
      }}
    >
      <AbsoluteFill>
        <Img
          src={staticFile("anh1.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(18px) brightness(0.75)",
            scale: "1.15",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(255,79,154,0.25)" }} />
      <div
        style={{
          position: "absolute",
          top: 330,
          width: "100%",
          textAlign: "center",
          fontSize: 230,
          scale: String(heart * (1 + Math.sin(frame / 6) * 0.05)),
          fontFamily: FONT,
        }}
      >
        💐
      </div>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.2,
          color: "white",
          textShadow: `6px 6px 0 ${DEEP}`,
          opacity: interpolate(frame, [10, 25], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [10, 25], [40, 0], clamp)}px`,
        }}
      >
        Chúc mừng Ngày <br />Phụ nữ Việt Nam
        <br />
        <span style={{ fontSize: 150, color: "#fff3a8" }}>20.10.2026</span>
      </div>
      <Sticker top={1200} delay={45} rotate={-2} bg="white" size={58}>
        11A2 – mãi là những <br />bông hoa đẹp nhất 🌸
      </Sticker>
      <div
        style={{
          position: "absolute",
          bottom: 150,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 36,
          color: "white",
          opacity: interpolate(frame, [70, 85], [0, 0.95], clamp),
        }}
      >
        Trường PTDTNT THCS & THPT An Giang 1
      </div>
    </AbsoluteFill>
  );
};

export const KyNiem2010: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <FloatingPetals />

      {/* Cảnh 1 (0–2.5s): Mở đầu */}
      <Sequence name="1. Mở đầu" durationInFrames={2.5 * fps} premountFor={fps}>
        <Intro />
      </Sequence>

      {/* Cảnh 2 (2.5–5.5s): Ảnh check-in */}
      <Sequence name="2. Check-in" from={2.5 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <Sticker top={150} rotate={-3} bg="#fff3a8" size={58}>
          Điểm danh hội chị em 11A2 ✌️
        </Sticker>
        <Polaroid src={staticFile("anh3.jpg")} top={480} rotate={-3} caption="đủ quân số, đủ visual ✨" />
        <Sticker top={1540} delay={20} rotate={2} size={46}>
          Visual: 10/10 · Độ lầy: 100/10 🤪
        </Sticker>
      </Sequence>

      {/* Cảnh 3 (5.5–8.5s): Bắn tim */}
      <Sequence name="3. Bắn tim" from={5.5 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <Sticker top={150} rotate={3} bg={PINK} color="white" size={58}>
          Bắn tim tới tấp 🫰🫰🫰
        </Sticker>
        <Polaroid src={staticFile("anh1.jpg")} top={480} rotate={3} caption="tim này là tim thật 💘" zoomFrom={1.12} zoomTo={1} />
        <Sticker top={1540} delay={20} rotate={-2} size={46}>
          Cô ở giữa = “trùm cuối” dễ thương 😎
        </Sticker>
      </Sequence>

      {/* Cảnh 4 (8.5–11s): Thả tim khổng lồ, chuyển nhạc */}
      <Sequence name="4. Tim khổng lồ" from={8.5 * fps} durationInFrames={2.5 * fps} premountFor={fps}>
        <Sticker top={150} rotate={-2} bg="#fff3a8" size={58}>
          Combo thả tim x1000 💗
        </Sticker>
        <Polaroid src={staticFile("anh2.jpg")} top={480} rotate={-2} caption="tình chị em là có thật 🫶" />
      </Sequence>

      {/* Cảnh 5 (11–15s): Huy chương */}
      <Sequence name="5. Huy chương" from={11 * fps} durationInFrames={4 * fps} premountFor={fps}>
        <MedalZoom />
      </Sequence>

      {/* Cảnh 6 (15–20s): Ghép ảnh */}
      <Sequence name="6. Ghép ảnh" from={15 * fps} durationInFrames={5 * fps} premountFor={fps}>
        <Collage />
      </Sequence>

      {/* Cảnh 7 (20–25.3s): Kết */}
      <Sequence name="7. Kết" from={20 * fps} premountFor={fps}>
        <Outro />
      </Sequence>

      {/* Chớp chuyển cảnh */}
      <Sequence from={2.5 * fps} durationInFrames={10}><Flash /></Sequence>
      <Sequence from={5.5 * fps} durationInFrames={10}><Flash /></Sequence>
      <Sequence from={8.5 * fps} durationInFrames={10}><Flash /></Sequence>
      <Sequence from={11 * fps} durationInFrames={10}><Flash /></Sequence>
      <Sequence from={15 * fps} durationInFrames={10}><Flash /></Sequence>
      <Sequence from={20 * fps} durationInFrames={10}><Flash /></Sequence>

      {/* Nhạc: bài 1 (0–11s) nối bài 2 (10–25.3s) */}
      <Audio src={staticFile("nhac.mp3")} />
    </AbsoluteFill>
  );
};
