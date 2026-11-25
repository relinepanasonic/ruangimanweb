import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE_NAME, FOUNDERS_CREDIT } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_NAME;

/**
 * Branded share card for the home page and every route under it that doesn't
 * define its own. Generated at build rather than shipped as a static PNG so the
 * copy stays in sync with the dictionaries — including the locale.
 *
 * Uses ImageResponse's built-in font: loading Inter here would mean bundling a
 * .ttf for an image almost nobody sees at full size.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          background:
            "radial-gradient(55% 60% at 18% 82%, rgba(214,176,114,0.22), transparent 70%), radial-gradient(50% 50% at 86% 12%, rgba(57,79,107,0.75), transparent 72%), linear-gradient(160deg, #1b1e23 0%, #272a30 60%, #16191d 100%)",
          color: "#EAE5D9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: "#D6B072",
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#D6B072",
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.04,
              letterSpacing: -3,
              fontWeight: 700,
              maxWidth: 900,
            }}
          >
            {dict.hero.headlineLines.join(" ")}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.45,
              color: "#9CA3AF",
              maxWidth: 820,
            }}
          >
            {dict.hero.sub}
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#C6B9A3" }}>
          {dict.footer.madeBy} {FOUNDERS_CREDIT}
        </div>
      </div>
    ),
    size,
  );
}
