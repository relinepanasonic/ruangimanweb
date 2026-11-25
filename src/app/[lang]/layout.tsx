import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import BackgroundAudio from "@/components/BackgroundAudio";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { getDictionary } from "@/i18n/get-dictionary";
import { locales, isLocale, localeHtmlLang, type Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL, APP_URL, FOUNDER, COFOUNDER } from "@/lib/site";

// This is the ROOT layout — it lives under [lang] so <html lang> can be correct
// for each locale. See node_modules/next/dist/docs/01-app/02-guides/internationalization.md
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.home.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.meta.home.description,
    applicationName: SITE_NAME,
    authors: [{ name: FOUNDER }, { name: COFOUNDER }],
    creator: FOUNDER,
    // Google gives this tag no ranking weight — the real surface is the ~2,700
    // Bible chapter pages, the Mass-schedule long tail and the blog, all of
    // which are in the sitemap with their own structured data. Kept broad and
    // honest for the engines that still read it.
    keywords: [
      "Ruang Iman",
      "Katolik",
      "Catholic",
      "Katolik Indonesia",
      "Gereja Katolik",
      "keuskupan",
      "Keuskupan Agung Jakarta",
      "KWI",
      "Paus",
      "Misa",
      "jadwal Misa",
      "jadwal Misa hari ini",
      "bacaan Misa hari ini",
      "Injil hari ini",
      "Alkitab Katolik",
      "Alkitab online",
      "Deuterokanonika",
      "renungan harian Katolik",
      "doa Katolik",
      "doa Rosario",
      "santo dan santa",
      "orang kudus",
      "kalender liturgi",
      "komunitas Katolik",
      "orang muda Katolik",
      "aplikasi Katolik",
      "Indonesian Catholic community",
      "Catholic Mass times Indonesia",
    ],
    alternates: {
      canonical: `/${lang}`,
      languages: {
        id: "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: lang === "id" ? "id_ID" : "en_US",
      url: `${SITE_URL}/${lang}`,
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      // og:image comes from the opengraph-image.tsx file convention in this
      // same folder — Next injects it, so listing it here would duplicate it.
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.home.title,
      description: dict.meta.home.description,
    },
    icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <html lang={localeHtmlLang[locale]} className={inter.variable}>
      <head>
        {/* Tells search engines this marketing site and the app are one thing. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  // Square, per Google's Organization/publisher-logo guidance.
                  logo: `${SITE_URL}/logo-mark.png`,
                  founder: [
                    { "@type": "Person", name: FOUNDER },
                    { "@type": "Person", name: COFOUNDER },
                  ],
                  description: dict.meta.home.description,
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  inLanguage: localeHtmlLang[locale],
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
                {
                  "@type": "SoftwareApplication",
                  name: SITE_NAME,
                  url: APP_URL,
                  applicationCategory: "LifestyleApplication",
                  operatingSystem: "Web, iOS, Android",
                  description: dict.meta.home.description,
                  author: [
                    { "@type": "Person", name: FOUNDER },
                    { "@type": "Person", name: COFOUNDER },
                  ],
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "IDR",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {/* Scroll-reveal sections start hidden and are un-hidden by an
            IntersectionObserver. Without JS that never happens, so reveal the
            lot. See the .no-js rule in globals.css. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal]{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
        <SmoothScrollProvider />
        <Cursor />
        <BackgroundAudio />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-brand-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-brand-dark"
        >
          {locale === "id" ? "Lompat ke konten" : "Skip to content"}
        </a>
        <Navbar lang={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer lang={locale} dict={dict} />
      </body>
    </html>
  );
}
