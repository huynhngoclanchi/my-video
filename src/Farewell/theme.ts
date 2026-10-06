import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Font tải sẵn trong public/fonts (đều hỗ trợ tiếng Việt).
const fonts: [string, string, string, string][] = [
  ["Playfair Display", "PlayfairDisplay-VF.ttf", "normal", "400 900"],
  ["Playfair Display", "PlayfairDisplay-Italic-VF.ttf", "italic", "400 900"],
  ["Dancing Script", "DancingScript-VF.ttf", "normal", "400 700"],
  ["Be Vietnam Pro", "BeVietnamPro-Light.ttf", "normal", "300"],
  ["Be Vietnam Pro", "BeVietnamPro-Medium.ttf", "normal", "500"],
];
for (const [family, file, style, weight] of fonts) {
  loadFont({ family, url: staticFile(`fonts/${file}`), style, weight });
}

export const serif = "'Playfair Display', serif";
export const script = "'Dancing Script', cursive";
export const sans = "'Be Vietnam Pro', sans-serif";

export const COLORS = {
  gold: "#e9c77b",
  goldDeep: "#c9a14a",
  cream: "#fdf4e3",
  wine: "#3a1a1f",
  night: "#120c0a",
};
