import { ImageResponse } from "next/og";
import { getPostBySlug, prettifyCategory } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_NAME;

/** Per-post share card: category, headline, byline, on the brand ground. */
export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
            "radial-gradient(55% 60% at 82% 88%, rgba(214,176,114,0.18), transparent 70%), radial-gradient(55% 55% at 14% 10%, rgba(57,79,107,0.72), transparent 72%), linear-gradient(160deg, #1b1e23 0%, #272a30 60%, #16191d 100%)",
          color: "#EAE5D9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#D6B072",
              border: "2px solid rgba(214,176,114,0.4)",
              borderRadius: 999,
              padding: "10px 24px",
            }}
          >
            {post ? prettifyCategory(post.category) : SITE_NAME}
          </div>
        </div>

        <div
          style={{
            fontSize: post && post.title.length > 70 ? 62 : 76,
            lineHeight: 1.08,
            letterSpacing: -2.5,
            fontWeight: 700,
            maxWidth: 980,
          }}
        >
          {post?.title ?? SITE_NAME}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#9CA3AF",
          }}
        >
          <div>{post?.author_name ?? "CFM Editorial"}</div>
          <div style={{ color: "#D6B072" }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    size,
  );
}
