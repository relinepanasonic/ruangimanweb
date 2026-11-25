// One-off: take the full-resolution art dropped in design/ and write the
// web-sized versions the slider actually loads.
//
//   design/card-backgrounds/<slug>.jpg  ->  public/features/<slug>.jpg   720x960
//   design/screens/<slug>.png           ->  public/features/screens/...  320x640
//
// Ten backgrounds load on one page, so weight matters more than resolution
// here — the cards render ~346px wide.
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";

const BG_SRC = "design/card-backgrounds";
const BG_OUT = "public/features";
const SC_OUT = "public/features/screens";

const kb = (p) => Math.round(statSync(p).size / 1024) + "KB";

for (const file of readdirSync(BG_SRC).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const slug = file.replace(/\.[^.]+$/, "");
  const out = `${BG_OUT}/${slug}.jpg`;
  await sharp(`${BG_SRC}/${file}`)
    .resize(720, 960, { fit: "cover" })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(out);
  console.log("bg    ", slug.padEnd(18), kb(out));
}

// The signed-in captures came in as <slug>1 / <slug>2 — the "1" shots are the
// top of each page, which is the part worth showing in a phone this small.
for (const [src, slug] of [
  ["profil1.png", "profil"],
  ["temukan1.png", "temukan"],
]) {
  const out = `${SC_OUT}/${slug}.png`;
  await sharp(`design/screens/${src}`)
    .resize(320, 640, { fit: "cover", position: "top" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log("screen", slug.padEnd(18), kb(out));
}
