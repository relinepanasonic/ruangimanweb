import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The circular "N" badge bottom-left in local dev is Next's own dev-mode
  // build indicator — framework chrome, not part of this site, and it never
  // ships to production regardless. Turned off anyway: on this page it sits
  // directly over the rail's real CTA button and reads as a design bug.
  devIndicators: false,
  images: {
    remotePatterns: [
      // Blog cover images live in the app's Supabase Storage bucket.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
