import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { useEffect, useState } from "react";
import {
  Accent,
  COLORS,
  Flash,
  GridCard,
  Label,
  Photo,
  Story,
} from "./components";
import { fontsLoaded } from "./fonts";

// Script: "ÚT CƯNG & CÔ IU – Birthday Recap 15.10", 30 s, 9:16.
// Music is a 120 BPM bed whose first downbeat lands on 1.5 s, so every cut sits on a 0.5 s grid.

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const BirthdayRecap: React.FC<{ readonly withMusic?: boolean }> = ({
  withMusic = true,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* ===== 0:00–0:01.5 HOOK: the whole group, real sound ===== */}
      <Sequence
        name="Hook – video #20"
        durationInFrames={1.5 * fps}
        premountFor={fps}
      >
        <OffthreadVideo
          src={staticFile("video20.mp4")}
          trimBefore={18 * fps}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: `${interpolate(frame, [1.1 * fps, 1.5 * fps], [1, 1.12], clamp)}`,
          }}
        />
      </Sequence>
      <Flash from={1.4 * fps} durationInFrames={6} />

      {/* ===== 0:01.5–0:03 cake, cake, gift ===== */}
      <Photo
        name="#7 cake 'út cưng'"
        src="img/p07.jpg"
        from={1.5 * fps}
        durationInFrames={0.5 * fps}
        origin="50% 80%"
      />
      <Photo
        name="#6 cake 'Cô Iu'"
        src="img/p06.jpg"
        from={2 * fps}
        durationInFrames={0.5 * fps}
        origin="60% 75%"
      />
      <Photo
        name="#18 gift"
        src="img/p18.jpg"
        from={2.5 * fps}
        durationInFrames={0.5 * fps}
      />
      <Label
        name="Warning"
        from={1.5 * fps}
        durationInFrames={1.5 * fps}
        variant="red"
        top="38%"
        size={64}
        tilt={-3}
      >
        🚨 Cảnh báo: hôm nay có người bị cưng quá liều
      </Label>

      {/* ===== 0:03–0:04.5 main character ===== */}
      <Photo
        name="#9 close-up"
        src="img/p09.jpg"
        from={3 * fps}
        durationInFrames={1.5 * fps}
        zoom={[1.3, 1.42]}
        origin="54% 34%"
      />
      <Label
        name="Main character"
        from={3 * fps}
        durationInFrames={1.5 * fps}
        variant="cream"
        top="58%"
        size={68}
        tilt={0}
        typewriter="Nhân vật chính: Lan Chi ✨"
      />
      <Label
        name="Level up"
        from={3.6 * fps}
        durationInFrames={0.9 * fps}
        variant="red"
        top="67%"
        size={50}
        tilt={2}
      >
        Level mới: đã mở khóa
      </Label>

      {/* ===== 0:04.5–0:06.5 CHAPTER 1 – daytime ===== */}
      <Photo
        name="#1"
        src="img/p01.jpg"
        from={4.5 * fps}
        durationInFrames={0.5 * fps}
        popIn
      />
      <Photo
        name="#3"
        src="img/p03.jpg"
        from={5 * fps}
        durationInFrames={0.5 * fps}
        popIn
      />
      <Photo
        name="#25"
        src="img/p25.jpg"
        from={5.5 * fps}
        durationInFrames={0.5 * fps}
        popIn
      />
      <Photo
        name="#8"
        src="img/p08.jpg"
        blurBg="img/p08_bg.jpg"
        from={6 * fps}
        durationInFrames={0.5 * fps}
        popIn
      />
      <Label
        name="Chapter 1"
        from={4.5 * fps}
        durationInFrames={2 * fps}
        variant="cream"
        top="20%"
        size={64}
      >
        Ban ngày: chế độ <Accent>ÚT CƯNG</Accent> 🍰
      </Label>

      {/* ===== 0:06.5–0:09 time-lapse: friends arrive one by one ===== */}
      <Sequence
        name="Time-lapse – video #20 x4"
        from={6.5 * fps}
        durationInFrames={2.5 * fps}
        premountFor={fps}
      >
        <OffthreadVideo
          src={staticFile("video20.mp4")}
          trimBefore={0}
          playbackRate={4}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
      <Label
        name="1 người"
        from={6.5 * fps}
        durationInFrames={0.8 * fps}
        variant="outline"
        top="16%"
        size={78}
        tilt={-3}
        fadeOutFrames={2}
      >
        1 người…
      </Label>
      <Label
        name="2 người"
        from={7.3 * fps}
        durationInFrames={0.8 * fps}
        variant="outline"
        top="16%"
        size={78}
        tilt={2}
        fadeOutFrames={2}
      >
        2 người…
      </Label>
      <Label
        name="Cả hội"
        from={8.1 * fps}
        durationInFrames={0.9 * fps}
        variant="cream"
        top="16%"
        size={68}
        tilt={-2}
      >
        cả hội kéo tới 😆
      </Label>

      {/* ===== 0:09–0:11 real time, real voices ===== */}
      <Sequence
        name="Real sound – video #20"
        from={9 * fps}
        durationInFrames={2 * fps}
        premountFor={fps}
      >
        <OffthreadVideo
          src={staticFile("video20.mp4")}
          trimBefore={15.5 * fps}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      {/* ===== 0:11–0:12 group photo ===== */}
      <Photo
        name="#19 group"
        src="img/p19.jpg"
        blurBg="img/p19_bg.jpg"
        from={11 * fps}
        durationInFrames={1 * fps}
        zoom={[1.0, 1.08]}
        popIn
      />
      <Label
        name="All here"
        from={11 * fps}
        durationInFrames={1 * fps}
        variant="cream"
        top="22%"
        size={64}
      >
        Cả hội đông đủ ✔️
      </Label>
      <Flash from={11.8 * fps} durationInFrames={6} />

      {/* ===== 0:12–0:12.5 CHAPTER 2 – night ===== */}
      <Photo
        name="#6 'Cô Iu' punch-in"
        src="img/p06.jpg"
        from={12 * fps}
        durationInFrames={0.5 * fps}
        zoom={[1.0, 1.45]}
        origin="72% 78%"
      />
      <Label
        name="Chapter 2"
        from={12 * fps}
        durationInFrames={1.2 * fps}
        variant="red"
        top="20%"
        size={64}
        tilt={2}
      >
        Tối đến: chế độ CÔ IU 💌
      </Label>

      {/* ===== 0:12.5–0:19.5 friends' wishes, one by one ===== */}
      <Story
        name="Story #15"
        src="img/p15.jpg"
        from={12.5 * fps}
        durationInFrames={2 * fps}
      />
      <Story
        name="Story #16"
        src="img/p16.jpg"
        from={14.5 * fps}
        durationInFrames={1.5 * fps}
      />
      <Story
        name="Story #17"
        src="img/p17.jpg"
        from={16 * fps}
        durationInFrames={2 * fps}
      />
      <Story
        name="Story #12"
        src="img/p12.jpg"
        from={18 * fps}
        durationInFrames={1.5 * fps}
      />
      <Label
        name="+1"
        from={13.2 * fps}
        durationInFrames={1.3 * fps}
        variant="red"
        top="7%"
        size={40}
        tilt={-4}
        fadeOutFrames={2}
      >
        💌 +1 lời chúc
      </Label>
      <Label
        name="+2"
        from={14.5 * fps}
        durationInFrames={1.5 * fps}
        variant="red"
        top="7%"
        size={40}
        tilt={3}
        fadeOutFrames={2}
      >
        💌 +2 lời chúc
      </Label>
      <Label
        name="+3"
        from={16 * fps}
        durationInFrames={2 * fps}
        variant="red"
        top="7%"
        size={40}
        tilt={-3}
        fadeOutFrames={2}
      >
        💌 +3 lời chúc
      </Label>
      <Label
        name="+4"
        from={18 * fps}
        durationInFrames={1.5 * fps}
        variant="red"
        top="7%"
        size={40}
        tilt={3}
        fadeOutFrames={2}
      >
        💌 +4 lời chúc
      </Label>

      {/* ===== 0:19.5–0:23.5 inbox overload wall ===== */}
      <Sequence
        name="Wish wall"
        from={19.5 * fps}
        durationInFrames={4 * fps}
        premountFor={fps}
      >
        <AbsoluteFill style={{ backgroundColor: COLORS.pink }} />
        <GridCard
          name="Story #10"
          src="img/p10.jpg"
          from={0}
          durationInFrames={4 * fps}
          left={50}
          top={150}
          tilt={-4}
        />
        <GridCard
          name="Story #13"
          src="img/p13.jpg"
          from={0.5 * fps}
          durationInFrames={3.5 * fps}
          left={560}
          top={180}
          tilt={3}
        />
        <GridCard
          name="Story #14"
          src="img/p14.jpg"
          from={1 * fps}
          durationInFrames={3 * fps}
          left={50}
          top={980}
          tilt={3}
        />
        <GridCard
          name="Story #11"
          src="img/p11.jpg"
          from={1.5 * fps}
          durationInFrames={2.5 * fps}
          left={560}
          top={1010}
          tilt={-3}
        />
        <Label
          name="Inbox overload"
          from={2 * fps}
          durationInFrames={2 * fps}
          variant="red"
          top="46%"
          size={60}
          tilt={-3}
        >
          Hộp thư yêu thương: quá tải 📥
        </Label>
      </Sequence>

      {/* ===== 0:23.5–0:24.5 flowers ===== */}
      <Photo
        name="#21 flowers"
        src="img/p21.jpg"
        from={23.5 * fps}
        durationInFrames={1 * fps}
        zoom={[1.0, 1.1]}
        origin="50% 75%"
      />
      <Label
        name="Flowers"
        from={23.5 * fps}
        durationInFrames={1 * fps}
        variant="cream"
        top="16%"
        size={62}
      >
        Và hoa. Rất nhiều hoa 💐
      </Label>

      {/* ===== 0:24.5–0:30 ending (chill version) ===== */}
      <Photo
        name="#9 pull-back"
        src="img/p09.jpg"
        from={24.5 * fps}
        durationInFrames={5.5 * fps}
        zoom={[1.22, 1.0]}
        origin="54% 40%"
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(30,20,22,0.55) 0%, rgba(30,20,22,0) 45%)",
          opacity: interpolate(frame, [24.5 * fps, 25.5 * fps], [0, 1], clamp),
        }}
      />
      <Label
        name="End line 1"
        from={24.6 * fps}
        durationInFrames={5.4 * fps}
        variant="script"
        top="9%"
        size={92}
        tilt={0}
        fadeOutFrames={1}
      >
        Một ngày bình thường…
      </Label>
      <Label
        name="End line 2"
        from={26.3 * fps}
        durationInFrames={3.7 * fps}
        variant="script"
        top="17%"
        size={72}
        tilt={0}
        fadeOutFrames={1}
      >
        …được thương rất phi thường 🤍
      </Label>
      <Label
        name="End line 3"
        from={28 * fps}
        durationInFrames={2 * fps}
        variant="cream"
        top="27%"
        size={44}
        tilt={-2}
        fadeOutFrames={1}
      >
        15.10 · cảm ơn vì đã thương mình 💗
      </Label>
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity: interpolate(frame, [29.3 * fps, 30 * fps], [0, 1], clamp),
        }}
      />

      {/* ===== AUDIO ===== */}
      {withMusic ? (
        <Audio
          name="Music bed (120 BPM)"
          src={staticFile("audio/music.wav")}
          from={1 * fps}
          volume={(f) =>
            interpolate(
              f + 1 * fps,
              [
                8.8 * fps,
                9.1 * fps,
                10.8 * fps,
                11.1 * fps,
                28 * fps,
                30 * fps,
              ],
              [0.85, 0.18, 0.18, 0.85, 0.85, 0],
              clamp,
            )
          }
        />
      ) : null}
      <Audio
        name="Real sound – hook"
        src={staticFile("audio/video20.wav")}
        trimBefore={18 * fps}
        durationInFrames={1.5 * fps}
        volume={(f) =>
          interpolate(f, [0, 1.3 * fps, 1.5 * fps], [1.6, 1.6, 0.3], clamp)
        }
      />
      <Audio
        name="Real sound – voices"
        src={staticFile("audio/video20.wav")}
        from={9 * fps}
        trimBefore={15.5 * fps}
        durationInFrames={2 * fps}
        volume={(f) =>
          interpolate(f, [0, 3, 1.8 * fps, 2 * fps], [0, 2, 2, 0], clamp)
        }
      />

      {/* Sound effects */}
      <Audio
        name="pop 1"
        src={staticFile("audio/pop.wav")}
        from={1.5 * fps}
        volume={0.45}
      />
      <Audio
        name="pop 2"
        src={staticFile("audio/pop.wav")}
        from={2 * fps}
        volume={0.45}
      />
      <Audio
        name="pop 3"
        src={staticFile("audio/pop.wav")}
        from={2.5 * fps}
        volume={0.45}
      />
      <Audio
        name="ding"
        src={staticFile("audio/ding.wav")}
        from={3 * fps}
        volume={0.35}
      />
      <Audio
        name="shutter"
        src={staticFile("audio/shutter.wav")}
        from={4.5 * fps}
        volume={0.4}
      />
      <Audio
        name="whoosh"
        src={staticFile("audio/whoosh.wav")}
        from={11.7 * fps}
        volume={0.35}
      />
      <Audio
        name="notify 1"
        src={staticFile("audio/notify.wav")}
        from={12.5 * fps}
        volume={0.3}
      />
      <Audio
        name="notify 2"
        src={staticFile("audio/notify.wav")}
        from={14.5 * fps}
        volume={0.3}
      />
      <Audio
        name="notify 3"
        src={staticFile("audio/notify.wav")}
        from={16 * fps}
        volume={0.3}
      />
      <Audio
        name="notify 4"
        src={staticFile("audio/notify.wav")}
        from={18 * fps}
        volume={0.3}
      />
      <Audio
        name="wall pop 1"
        src={staticFile("audio/pop.wav")}
        from={19.5 * fps}
        volume={0.45}
      />
      <Audio
        name="wall pop 2"
        src={staticFile("audio/pop.wav")}
        from={20 * fps}
        volume={0.45}
      />
      <Audio
        name="wall pop 3"
        src={staticFile("audio/pop.wav")}
        from={20.5 * fps}
        volume={0.45}
      />
      <Audio
        name="wall pop 4"
        src={staticFile("audio/pop.wav")}
        from={21 * fps}
        volume={0.45}
      />
    </AbsoluteFill>
  );
};
