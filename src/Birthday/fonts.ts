import { continueRender, delayRender, staticFile } from "remotion";

export const FONT = "BdayInter";
export const FONT_DISPLAY = "BdayInterDisplay";

const faces: [string, string, string][] = [
  [FONT, "fonts/Inter-SemiBold.otf", "600"],
  [FONT, "fonts/Inter-Bold.otf", "700"],
  [FONT_DISPLAY, "fonts/InterDisplay-Black.otf", "900"],
];

const handle = delayRender("Loading fonts");
Promise.all(
  faces.map(([family, file, weight]) => {
    const face = new FontFace(family, `url(${staticFile(file)})`, { weight });
    document.fonts.add(face);
    return face.load();
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
