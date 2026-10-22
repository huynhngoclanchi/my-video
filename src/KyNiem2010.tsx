import { Audio, Video } from "@remotion/media";
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

// Một đoạn cắt từ video lớp, đặt trong khung "story" kèm sticker chú thích
const Clip: React.FC<{
  start: number; // giây bắt đầu trong video gốc
  top: React.ReactNode;
  bottom?: React.ReactNode;
  volume?: number;
  tilt?: number;
  zoom?: { from?: number; to: number; origin: string; badge?: boolean }; // zoom cận cảnh
  nameTag?: React.ReactNode; // bảng tên người nói
}> = ({ start, top, bottom, volume = 0.35, tilt = 0, zoom, nameTag }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 160,
          width: 760,
          height: 1351,
          borderRadius: 40,
          overflow: "hidden",
          border: "12px solid white",
          boxShadow: `0 0 0 8px ${PINK}, 0 30px 80px rgba(122,31,92,0.4)`,
          rotate: `${tilt}deg`,
          scale: String(interpolate(enter, [0, 1], [0.9, 1])),
        }}
      >
        <Video
          src={staticFile("lop.mp4")}
          trimBefore={Math.round(start * fps)}
          volume={volume}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(1.15) contrast(1.05)",
            transformOrigin: zoom?.origin,
            scale: zoom
              ? String(
                  interpolate(frame, [0, durationInFrames * 0.6], [zoom.from ?? 1, zoom.to], {
                    ...clamp,
                    easing: Easing.bezier(0.33, 1, 0.68, 1),
                  }),
                )
              : undefined,
          }}
        />
        {zoom && zoom.badge !== false ? (
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "rgba(0,0,0,0.55)",
              color: "white",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 34,
              padding: "8px 18px",
              borderRadius: 14,
            }}
          >
            🔍 x{zoom.to}
          </div>
        ) : null}
        {nameTag ? (
          <div
            style={{
              position: "absolute",
              left: 24,
              bottom: 40,
              background: "white",
              color: DEEP,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 40,
              padding: "14px 26px",
              borderRadius: 18,
              borderLeft: `14px solid ${PINK}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              translate: `${interpolate(spring({ frame: frame - 8, fps, config: { damping: 14 } }), [0, 1], [-700, 0])}px 0px`,
            }}
          >
            {nameTag}
          </div>
        ) : null}
      </div>
      <Sticker top={110} rotate={-3} bg="#fff3a8" size={50}>
        {top}
      </Sticker>
      {bottom ? (
        <Sticker top={1630} delay={12} rotate={2} bg={PINK} color="white" size={46}>
          {bottom}
        </Sticker>
      ) : null}
    </AbsoluteFill>
  );
};

// Mốc thời gian (giây) của các cảnh
const CUTS = [
  0, 2.5, 6, 9.6, 11.7, 13.2, 14.6, 16, 19.5, 22.5, 28, 31.5, 35, 38.5, 42, 45.5, 49, 52.5, 56, 59.5, 63, 66, 69, 73, 77.5,
];
// Đoạn lời chúc: nhạc nền nhỏ lại để nghe rõ tiếng các bạn
const WISH_START = 22.5;
const WISH_END = 63;

export const KyNiem2010: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <FloatingPetals />

      {/* PHẦN 1 – Nhạc 1 (vui nhộn) */}
      {/* Cảnh 1 (0–2.5s): Mở đầu */}
      <Sequence name="1. Mở đầu" durationInFrames={2.5 * fps} premountFor={fps}>
        <Intro />
      </Sequence>

      {/* Cảnh 2 (2.5–6s): Hậu trường */}
      <Sequence name="2. Hậu trường" from={2.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={0.5} top={<>Hậu trường: hội con trai <br />đang chuẩn bị “âm mưu” 🤫</>} bottom="Huy chương đã sẵn sàng 🏅" />
      </Sequence>

      {/* Cảnh 3 (6–9.6s): Bất ngờ */}
      <Sequence name="3. Bất ngờ" from={6 * fps} durationInFrames={3.6 * fps} premountFor={fps}>
        <Clip start={4} volume={0.6} tilt={1} top="Bất ngờ chưa các bà! 😱" bottom="Hội chị em: ủa gì dị? 🙈" />
      </Sequence>

      {/* Cảnh 4 (9.6–16s): Cận cảnh đeo huy chương – 4 lát zoom */}
      <Sequence name="4a. Zoom đeo huy chương" from={9.6 * fps} durationInFrames={2.1 * fps} premountFor={fps}>
        <Clip start={7.4} zoom={{ to: 2, origin: "28% 55%" }} top={<>Zoom cận cảnh: <br />“cúi đầu xuống nè” 🏅</>} bottom="Ngại đỏ mặt luôn 🙈" />
      </Sequence>
      <Sequence name="4b. Zoom đeo huy chương" from={11.7 * fps} durationInFrames={1.5 * fps} premountFor={fps}>
        <Clip start={9.8} tilt={-1} zoom={{ to: 1.7, origin: "62% 45%" }} top={<>Đeo tận cổ, <br />không cần tự lấy 😎</>} bottom="Chuẩn quý ông 11A2 🤵" />
      </Sequence>
      <Sequence name="4c. Zoom đeo huy chương" from={13.2 * fps} durationInFrames={1.4 * fps} premountFor={fps}>
        <Clip start={11.8} tilt={1} zoom={{ to: 1.7, origin: "35% 60%" }} top={<>Tới lượt bạn này, <br />ai cũng có phần 💝</>} bottom="Giao huy chương tận bàn 🛵" />
      </Sequence>
      <Sequence name="4d. Zoom đeo huy chương" from={14.6 * fps} durationInFrames={1.4 * fps} premountFor={fps}>
        <Clip start={22.6} tilt={-1} zoom={{ to: 1.7, origin: "50% 65%" }} top={<>Bạn nào cũng <br />được “đeo tận cổ” 🥰</>} bottom="Ai cũng có phần nha 💝" />
      </Sequence>

      {/* Cảnh 5 (16–19.5s): Phản ứng */}
      <Sequence name="5. Phản ứng" from={16 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={41} volume={0.6} top={<>Khi được gọi là <br />“bông hoa đẹp nhất” 🥹</>} bottom="Cười không thấy tổ quốc 😆" />
      </Sequence>

      {/* Cảnh 6 (19.5–22.5s): Cả lớp */}
      <Sequence name="6. Cả lớp" from={19.5 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <Clip start={50} tilt={1} top="Full lớp, full huy chương ✨" bottom="Và giờ là… lời chúc 💌" />
      </Sequence>

      {/* Cảnh 7 (22.5–63s): 11 “anh tài” lần lượt lên sóng – giữ tiếng gốc */}
      <Sequence name="7.1 Lời chúc – Nguyễn Lộc" from={22.5 * fps} durationInFrames={5.5 * fps} premountFor={fps}>
        <Clip start={66.6} volume={1} top={<>Mở màn lời chúc: <br />lớp trưởng lên sóng 🎤</>} nameTag={<>Nguyễn Lộc <br /><span style={{ fontSize: 30, color: PINK }}>Lớp trưởng 11A2 👑</span></>} bottom="🎤 1/11" />
      </Sequence>
      <Sequence name="7.2 Lời chúc – anh tài 2" from={28 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={110.8} volume={1} tilt={-1} top=<>Anh tài số 2 <br />cầm giấy, soạn kỹ lắm nha 📝</> bottom="🎤 2/11" />
      </Sequence>
      <Sequence name="7.3 Lời chúc – anh tài 3" from={31.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={144.4} volume={1} tilt={1} top=<>Anh tài số 3: <br />nụ cười tỏa nắng ☀️</> bottom="🎤 3/11" />
      </Sequence>
      <Sequence name="7.4 Lời chúc – anh tài 4" from={35 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={166.3} volume={1} tilt={-1} top=<>Anh tài số 4: <br />phong thái cực tự tin 😎</> bottom="🎤 4/11" />
      </Sequence>
      <Sequence name="7.5 Lời chúc – anh tài 5" from={38.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={188.5} volume={1} tilt={1} zoom={{ from: 1.7, to: 1.9, origin: "54% 47%", badge: false }} top=<>Anh tài số 5 <br />tiếp sóng liền tay 📡</> bottom="🎤 5/11" />
      </Sequence>
      <Sequence name="7.6 Lời chúc – anh tài 6" from={42 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={206.2} volume={1} tilt={-1} zoom={{ from: 1.7, to: 1.9, origin: "47% 47%", badge: false }} top=<>Anh tài số 6: <br />đứng thẳng, chúc thật lòng 💌</> bottom="🎤 6/11" />
      </Sequence>
      <Sequence name="7.7 Lời chúc – anh tài 7" from={45.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={223.5} volume={1} tilt={1} zoom={{ from: 1.7, to: 1.9, origin: "48% 47%", badge: false }} top=<>Anh tài số 7: <br />run nhẹ nhưng vẫn chúc 🫣</> bottom="🎤 7/11" />
      </Sequence>
      <Sequence name="7.8 Lời chúc – anh tài 8" from={49 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={242.8} volume={1} tilt={-1} zoom={{ from: 1.7, to: 1.9, origin: "53% 47%", badge: false }} top=<>Anh tài số 8: <br />lời chúc ngọt hơn trà sữa 🧋</> bottom="🎤 8/11" />
      </Sequence>
      <Sequence name="7.9 Lời chúc – anh tài 9" from={52.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={266.0} volume={1} tilt={1} zoom={{ from: 1.7, to: 1.9, origin: "52% 47%", badge: false }} top=<>Anh tài số 9: <br />hội chị em nghe mà tan chảy 🫠</> bottom="🎤 9/11" />
      </Sequence>
      <Sequence name="7.10 Lời chúc – anh tài 10" from={56 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={281.5} volume={1} tilt={-1} zoom={{ from: 1.7, to: 1.9, origin: "56% 47%", badge: false }} top=<>Anh tài số 10: <br />chúc gì dễ thương dữ vậy 🥹</> bottom="🎤 10/11" />
      </Sequence>
      <Sequence name="7.11 Lời chúc – anh tài 11" from={59.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <Clip start={301.9} volume={1} tilt={1} zoom={{ from: 1.7, to: 1.9, origin: "54% 47%", badge: false }} top=<>Chốt hạ: anh tài số 11 <br />về đích rực rỡ 👑</> bottom="🎤 11/11" />
      </Sequence>

      {/* PHẦN 2 – Nhạc 2 (sâu lắng) */}
      {/* Cảnh 9 (63–66s): Ảnh check-in */}
      <Sequence name="9. Check-in" from={63 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <Sticker top={150} rotate={-3} bg="#fff3a8" size={58}>
          Chốt đơn tấm hình kỷ niệm 📸
        </Sticker>
        <Polaroid src={staticFile("anh3.jpg")} top={480} rotate={-3} caption="đủ quân số, đủ visual ✨" />
        <Sticker top={1540} delay={20} rotate={2} size={46}>
          Visual: 10/10 · Độ lầy: 100/10 🤪
        </Sticker>
      </Sequence>

      {/* Cảnh 10 (66–69s): Bắn tim */}
      <Sequence name="10. Bắn tim" from={66 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <Sticker top={150} rotate={3} bg={PINK} color="white" size={58}>
          Bắn tim tới tấp 🫰🫰🫰
        </Sticker>
        <Polaroid src={staticFile("anh1.jpg")} top={480} rotate={3} caption="tim này là tim thật 💘" zoomFrom={1.12} zoomTo={1} />
        <Sticker top={1540} delay={20} rotate={-2} size={46}>
          Ở giữa là cô – người “tưới hoa” <br />cho cả vườn hoa 11A2 🌷
        </Sticker>
      </Sequence>

      {/* Cảnh 11 (69–73s): Huy chương */}
      <Sequence name="11. Huy chương" from={69 * fps} durationInFrames={4 * fps} premountFor={fps}>
        <MedalZoom />
      </Sequence>

      {/* Cảnh 12 (73–77.5s): Ghép ảnh */}
      <Sequence name="12. Ghép ảnh" from={73 * fps} durationInFrames={4.5 * fps} premountFor={fps}>
        <Collage />
      </Sequence>

      {/* Cảnh 13 (77.5–82.5s): Kết */}
      <Sequence name="13. Kết" from={77.5 * fps} premountFor={fps}>
        <Outro />
      </Sequence>

      {/* Chớp chuyển cảnh */}
      {CUTS.slice(1).map((t) => (
        <Sequence key={t} from={Math.round(t * fps)} durationInFrames={10}>
          <Flash />
        </Sequence>
      ))}

      {/* Nhạc: bài 1 (0–22s) nối bài 2 lặp đến hết; nhỏ lại khi các bạn đọc lời chúc */}
      <Audio
        src={staticFile("nhac.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [WISH_START * fps - 15, WISH_START * fps, WISH_END * fps, WISH_END * fps + 15],
            [0.85, 0.1, 0.1, 0.85],
            clamp,
          )
        }
      />
    </AbsoluteFill>
  );
};
