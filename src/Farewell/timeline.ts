// Kịch bản video chia tay cô Trần Thụy Thu Diễm – mỗi phần tử là một cảnh.
export const FPS = 30;
// Số frame chồng lên nhau giữa hai cảnh (hiệu ứng hoà tan).
export const OVERLAP = 20;

export type Clip =
  | { kind: "lines"; lines: string[]; sec: number }
  | { kind: "title"; sec: number }
  | { kind: "chapter"; text: string; sub?: string; sec: number }
  | {
      kind: "photo";
      src: string;
      sec: number;
      caption?: string;
    }
  | { kind: "quote"; src: string; lines: string[]; sec: number }
  | { kind: "ending"; sec: number }
  | { kind: "final"; src: string; sec: number };

export type Section = { id: string; clips: Clip[] };

const p = (n: number) => `photos/p${String(n).padStart(2, "0")}.jpg`;

export const SECTIONS: Section[] = [
  {
    id: "mo-dau",
    clips: [
      {
        kind: "lines",
        lines: ["Có những cuộc gặp gỡ", "làm nên một hành trình…"],
        sec: 6.5,
      },
      {
        kind: "lines",
        lines: [
          "Có những người đồng hành",
          "để lại trong ta thật nhiều thương nhớ…",
        ],
        sec: 7,
      },
      { kind: "title", sec: 11 },
      { kind: "photo", src: p(20), sec: 5.5 },
      { kind: "photo", src: p(5), sec: 5.5 },
      { kind: "photo", src: p(19), sec: 5.5 },
    ],
  },
  {
    id: "nhin-lai",
    clips: [
      { kind: "chapter", text: "Những ngày đầu…", sub: "Nhìn lại một chặng đường", sec: 5 },
      { kind: "photo", src: p(3), sec: 5.5 },
      { kind: "photo", src: p(15), sec: 5.5 },
      { kind: "photo", src: p(18), sec: 5.5 },
      { kind: "photo", src: p(2), sec: 5.5 },
      { kind: "photo", src: p(25), sec: 5.5 },
      { kind: "photo", src: p(26), sec: 5.5 },
      { kind: "photo", src: p(27), sec: 5.5 },
      { kind: "chapter", text: "Những năm tháng tận tụy…", sec: 5 },
      { kind: "photo", src: p(7), sec: 5.5, caption: "Tận tâm với nghề" },
      { kind: "photo", src: p(1), sec: 5.5 },
      { kind: "photo", src: p(23), sec: 5.5, caption: "Hết lòng vì học sinh" },
      { kind: "photo", src: p(6), sec: 5.5 },
      { kind: "photo", src: p(9), sec: 5.5 },
      { kind: "photo", src: p(10), sec: 5.5 },
      { kind: "photo", src: p(11), sec: 5.5 },
      {
        kind: "photo",
        src: p(21),
        sec: 6,
        caption: "Âm thầm cống hiến qua năm tháng",
      },
      { kind: "chapter", text: "Và những người đồng hành…", sec: 5 },
      { kind: "photo", src: p(14), sec: 5.5 },
      { kind: "photo", src: p(30), sec: 6, caption: "Gần gũi với đồng nghiệp" },
      { kind: "photo", src: p(28), sec: 5.5 },
      { kind: "photo", src: p(29), sec: 5.5 },
    ],
  },
  {
    id: "ky-niem",
    clips: [
      {
        kind: "chapter",
        text: "Ngoài công việc,",
        sub: "chúng ta còn có những kỷ niệm…",
        sec: 5.5,
      },
      { kind: "photo", src: p(17), sec: 7 },
      { kind: "photo", src: p(13), sec: 7 },
      { kind: "photo", src: p(4), sec: 7 },
      {
        kind: "lines",
        lines: ["Có những khoảnh khắc", "không nằm trong hồ sơ công tác…"],
        sec: 6,
      },
      { kind: "photo", src: p(8), sec: 7 },
      { kind: "photo", src: p(16), sec: 7 },
      { kind: "photo", src: p(22), sec: 7 },
      {
        kind: "lines",
        lines: ["…nhưng lại nằm mãi", "trong ký ức của chúng ta."],
        sec: 6,
      },
      { kind: "photo", src: p(12), sec: 7 },
    ],
  },
  {
    id: "tri-an",
    clips: [
      { kind: "quote", src: p(5), lines: ["Một hành trình dài khép lại…"], sec: 8 },
      {
        kind: "quote",
        src: p(19),
        lines: ["Nhưng những điều tốt đẹp được trao đi…"],
        sec: 8,
      },
      { kind: "quote", src: p(0), lines: ["…sẽ vẫn còn ở lại."], sec: 8 },
      {
        kind: "quote",
        src: p(20),
        lines: ["Xin cảm ơn vì những năm tháng", "đã đồng hành."],
        sec: 10,
      },
      {
        kind: "quote",
        src: p(31),
        lines: ["Cảm ơn những tận tâm, sẻ chia", "và cống hiến cho mái trường."],
        sec: 10,
      },
      {
        kind: "quote",
        src: p(10),
        lines: [
          "Cảm ơn vì đã là một phần ký ức đẹp",
          "của biết bao thế hệ đồng nghiệp và học sinh.",
        ],
        sec: 11,
      },
    ],
  },
  {
    id: "ket",
    clips: [
      {
        kind: "quote",
        src: p(32),
        lines: ["Khép lại một hành trình…", "để bắt đầu một hành trình mới."],
        sec: 8,
      },
      { kind: "quote", src: p(24), lines: ["Chúc Cô thật nhiều sức khỏe"], sec: 7 },
      {
        kind: "quote",
        src: p(12),
        lines: ["Luôn vui – luôn khỏe – luôn bình an"],
        sec: 7,
      },
      {
        kind: "quote",
        src: p(8),
        lines: ["và tận hưởng thật trọn vẹn", "những tháng ngày phía trước."],
        sec: 8,
      },
      { kind: "ending", sec: 8 },
      { kind: "final", src: p(30), sec: 10 },
    ],
  },
];

export type PlacedClip = Clip & { from: number; frames: number; index: number };

// Tính vị trí bắt đầu của từng cảnh (các cảnh chồng nhau OVERLAP frame).
export const placeClips = () => {
  const placed: PlacedClip[] = [];
  const sectionStart: Record<string, number> = {};
  let cursor = 0;
  let index = 0;
  for (const section of SECTIONS) {
    sectionStart[section.id] = cursor;
    for (const clip of section.clips) {
      const frames = Math.round(clip.sec * FPS);
      placed.push({ ...clip, from: cursor, frames, index });
      cursor += frames - OVERLAP;
      index++;
    }
  }
  const total = cursor + OVERLAP;
  return { placed, sectionStart, total };
};
