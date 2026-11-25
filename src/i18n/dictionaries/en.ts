import type { Dictionary } from "./id";
import voicesPeople from "./voices.en";

/**
 * English mirror of `id.ts`. Same voice — warm, first-person, unhurried.
 * Not a translation exercise: where a literal translation would sound stiff,
 * say the same thing the way an English speaker actually would.
 */
const en: Dictionary = {
  meta: {
    home: {
      title: "Ruang Iman — A home for our faith",
      description:
        "Ruang Iman is a digital home for Catholics in Indonesia: a place to gather, to grow spiritually together, and to finally be connected — person to person, community to community.",
    },
    cerita: {
      title: "The story behind Ruang Iman",
      description:
        "Why Nico Japar and Tony Chen built Ruang Iman: a home for Indonesian Catholics who share a faith but have rarely been connected to one another.",
    },
    fitur: {
      title: "What's inside Ruang Iman",
      description:
        "Daily reflections, prayer, the Bible, communities across Indonesia, friends in faith, events, camps and news — all in one room.",
    },
    blog: {
      title: "The Ruang Iman blog",
      description:
        "Stories, gentle catechesis, lives of the saints and Church history — written to be read slowly, not to lecture anyone.",
    },
    alkitab: {
      title: "Catholic Bible Online — All 73 Books",
      description:
        "Read the complete Catholic Bible online — all 73 books including the Deuterocanon. Free, ad-free, and readable on your phone.",
    },
    jadwalMisa: {
      title: "Catholic Mass Schedules Across Indonesia",
      description:
        "Find Mass times at Catholic churches across Indonesia — daily Mass, Sunday Mass and feast days, with addresses and maps.",
    },
  },

  nav: {
    home: "Home",
    massTimes: "Mass Times",
    bible: "Bible",
    story: "Our Story",
    features: "Features",
    blog: "Blog",
    cta: "Open the App",
    menu: "Menu",
    close: "Close",
    switchLang: "Switch language",
  },

  hero: {
    eyebrow: "For Catholics in Indonesia",
    // The wordmark is the brand name — it stays Indonesian in both locales.
    wordmark: "RUANG IMAN",
    headlineLines: ["A Home for", "Our Faith."],
    sub: "One place to pray, to read Scripture, and to actually find each other — from Sabang all the way to Merauke.",
    foundedBy: "Founded by",
    cta: "Open the App",
    ctaSecondary: "The story",
    scrollHint: "Scroll",
    stats: [
      { value: "8M+", label: "Catholics in\nIndonesia" },
      { value: "37", label: "Dioceses\nconnected" },
    ],
    pillars: ["Home", "Spiritual", "Community", "Connect", "News"],
  },

  sidebar: {
    tagline:
      "A digital home for Indonesian Catholics — to gather, to grow, and to finally be connected.",
    nav: [
      { id: "beranda", label: "Home", icon: "home" },
      { id: "perjalanan", label: "The Journey", icon: "route" },
      { id: "cerita", label: "Story", icon: "quote" },
      { id: "fitur", label: "Features", icon: "grid" },
      { id: "komunitas", label: "Community", icon: "map" },
      { id: "blog", label: "Blog", icon: "news" },
    ],
  },

  journey: {
    eyebrow: "Inside the app",
    heading: "Five rooms, one journey.",
    lead: "This is what using Ruang Iman actually feels like day to day — from opening your eyes in the morning to meeting people in person.",
    stops: [
      {
        no: "01",
        key: "Home",
        title: "Start at home.",
        body: "Where you land every morning. Today's reflection, the prayer intentions that just came in, and news from your community — all on the first screen.",
        tags: ["Daily reflection", "Prayer room", "Latest news"],
      },
      {
        no: "02",
        key: "Connect",
        title: "Look for the person, not just the content.",
        body: "Profiles, interests, ministries. Find people walking the same direction you are, then start a conversation that doesn't stop at hello.",
        tags: ["Friends in faith", "Profiles", "Messages"],
      },
      {
        no: "03",
        key: "Spiritual",
        title: "The part that grows you.",
        body: "The full Bible, reflections that don't lecture, and somewhere to leave a prayer — then know that a real person is praying it back for you.",
        tags: ["Bible", "Reflections", "Prayer"],
      },
      {
        no: "04",
        key: "Community",
        title: "Meet in the real world.",
        body: "A map of Catholic communities across Indonesia, event schedules, camps and retreats. Because faith doesn't grow on a screen — it grows when you show up.",
        tags: ["Community map", "Events", "Camps & retreats"],
      },
      {
        no: "05",
        key: "News",
        title: "Word from the wider family.",
        body: "Stories from other communities, reflections, and the good things worth celebrating together. So we know we aren't walking this alone.",
        tags: ["Community stories", "Reflections", "Good news"],
      },
    ],
  },

  story: {
    label: "A short story",
    frames: [
      {
        index: "01",
        kicker: "There are many of us",
        title: "More than eight million.",
        body: "Indonesian Catholics spread across thousands of islands, hundreds of parishes, and countless small communities that faithfully gather every week.",
      },
      {
        index: "02",
        kicker: "And yet",
        title: "We walk alone.",
        body: "The community one city over has never heard of ours. The person in the back pew has never met the person in the front. Same faith — no connection.",
      },
      {
        index: "03",
        kicker: "But here's the thing",
        title: "Faith grows best in company.",
        body: "Prayer gets lighter when someone prays back. Hard questions get more honest when someone is walking beside you.",
      },
      {
        index: "04",
        kicker: "So",
        title: "I built a room.",
        body: "Not another stiff devotional app. A home — somewhere you can drop by daily, meet people, and leave with a faith that feels a little warmer.",
      },
    ],
  },

  founder: {
    eyebrow: "From the founders",
    heading: "Why I built Ruang Iman",
    paragraphs: [
      "I'm Nico Japar. I'm not a priest and I'm not a theologian. I'm an ordinary Catholic who spent a long time noticing one thing that wouldn't leave me alone.",
      "Indonesia has extraordinarily alive Catholic communities. But they live in isolation. One community runs a beautiful programme and no other community ever hears about it. Someone is quietly struggling with their faith, sitting alone at Mass, and nobody knows their name.",
      "It felt like such a waste. We're one big family that simply hasn't been introduced yet.",
      "Ruang Iman came out of that. I wanted somewhere that feels like coming home: open it in the morning for a reflection, leave a prayer intention and have someone genuinely pray for it, find a community in your city, show up to something, and end up with real friends — not just more contacts.",
      "This isn't a big project with a big team. It's been built slowly, night after night, because I believe our faith gets far stronger when it's carried together.",
    ],
    quote: "We already share a faith. There's one step left: finding each other.",
    name: "Nico Japar",
    role: "Founder of Ruang Iman",
    cta: "Read the full story",
    cofounder: {
      eyebrow: "Co-Founder",
      heading: "And one more person who gets this home out to the people.",
      paragraphs: [
        "Tony Chen joined as Co-Founder of Ruang Iman. He is well connected across Catholic communities throughout Indonesia.",
        "An app, however good, means little if it never reaches the people. Tony's job is to bring Ruang Iman to those communities, from small prayer groups to large communities, so that more Indonesian Catholics have one shared home.",
      ],
      name: "Tony Chen",
      role: "Co-Founder of Ruang Iman",
      tags: ["Community network", "Spreading the app"],
    },
  },

  features: {
    eyebrow: "What's inside",
    heading: "Ten reasons to open it every day.",
    sub: "All of it grew out of what Catholics actually do — not from a list padded out to look long.",
    cta: "See all features",
    dragHint: "Drag to see them all",
    // `slug` names the media on disk and is shared across locales — see id.ts.
    items: [
      {
        slug: "profil",
        icon: "profile",
        title: "Your Profile and Timeline",
        body: "Your journey of faith, the communities you belong to, and the songs you love. Plus My Timeline for the events you serve in, with the friends who help you run them.",
        tags: ["Journey", "Timeline", "Favourite songs"],
      },
      {
        slug: "bagikan",
        icon: "thought",
        title: "Share What's On Your Mind",
        body: "Write what you're grateful for, praying about, or wrestling with. A whole ecosystem reads it — and answers.",
        tags: ["Reflection", "Discussion", "Support"],
      },
      {
        slug: "alkitab",
        icon: "bible",
        title: "A Bible to Read and to Hear",
        body: "Three versions: TB (Indonesian), NRSV-CE and NKJV (English). The Deuterocanonical books are in the NRSV-CE. Have it read aloud verse by verse, search every word across the whole Bible, and keep your favourite verses.",
        tags: ["3 versions", "Read aloud", "Word search"],
      },
      {
        slug: "renungan",
        icon: "book",
        title: "Daily Readings and Reflection",
        body: "Today's Mass readings following the KWI lectionary text: readings, psalm and Gospel, plus the saints and celebration of the day. Then carry on with a devotion plan.",
        tags: ["KWI lectionary", "Saints of the day", "Devotion plans"],
      },
      {
        slug: "doa",
        icon: "hands",
        title: "Catholic Prayer",
        body: "The Rosary with 2D and 3D beads and the Scripture for each mystery, the Stations of the Cross, prayers in Aramaic and the Saint Benedict Medal prayer. All of it ready to open.",
        tags: ["3D Rosary", "Stations of the Cross", "Aramaic"],
      },
      {
        slug: "temukan",
        icon: "users",
        title: "Find Each Other",
        body: "Find fellow Catholics from your communities and your city, send a friend request, and start getting to know each other without the awkwardness.",
        tags: ["Communities", "City", "Friends"],
      },
      {
        slug: "chat",
        icon: "chat",
        title: "Private & Group Chat",
        body: "Talk one to one, or start a group for your community. Conversations that don't drown under a hundred other messages.",
        tags: ["Direct messages", "Groups", "Media"],
      },
      {
        slug: "pusat-komunitas",
        icon: "calendar",
        title: "Community Center",
        body: "For community leaders: create events and camps, manage crew and meetings, look after members, and run Connect Groups. All in one place.",
        tags: ["Events & camps", "Connect Groups", "Members"],
      },
      {
        slug: "kabar",
        icon: "news",
        title: "Community News",
        body: "Church news, events and a blog from communities across Indonesia, so the good in one city does not stop at its edge.",
        tags: ["News", "Events", "Blog"],
      },
      {
        slug: "jadwal-misa",
        icon: "church",
        title: "Mass Times Nationwide",
        body: "Mass schedules from parishes across the archipelago. Out of town? The nearest church and its times are in your hand.",
        tags: ["Nationwide", "Parishes", "Mass times"],
      },
    ],
  },

  whatsNew: {
    eyebrow: "New in Ruang Iman",
    heading: "The house keeps coming alive.",
    sub: "Prayer, Scripture, communities and events: the newest things we have added after listening to what people actually need.",
    soon: "Coming soon",
    cta: "Try it in the app",
    showcase: [
      {
        shot: "4-rosario-3d.jpg",
        icon: "hands",
        title: "Rosary in 2D & 3D",
        body: "Pray the Rosary with glowing beads. Swipe the dial to move bead by bead, and switch to the 3D view whenever you like.",
        tags: ["3D view", "Swipe dial", "Glowing beads"],
      },
      {
        shot: "3-rosario-ayat.jpg",
        icon: "bible",
        title: "Rosary with Scripture",
        body: "Choose the Joyful, Luminous, Sorrowful or Glorious Mysteries. Each mystery comes with its Bible passage, so you meditate as you pray.",
        tags: ["4 mysteries", "Verse for each", "Jump between parts"],
      },
      {
        shot: "5-alkitab.jpg",
        icon: "bible",
        title: "A Bible you can listen to",
        body: "Read comfortably, or play any chapter read aloud verse by verse with highlighting and a speed you choose. Search every word, or jump straight to a verse like Jeremiah 31:3.",
        tags: ["Read aloud", "Word search", "Favourite verses"],
      },
    ],
    more: [
      {
        icon: "calendar",
        title: "Event registration and QR tickets",
        body: "People register through a short link without logging in and get a QR ticket at once. Organisers scan at the door, then download the attendance list to Excel or PDF.",
        soon: true,
      },
      {
        icon: "users",
        title: "Connect Groups",
        body: "Small groups inside a community. Pick the lead, committee and members from Ruang Iman users, and get a reminder before each meeting.",
      },
      {
        icon: "hands",
        title: "Prayer Intentions and SOS Prayer",
        body: "Leave an intention and pray for one another. On a heavy day, ask to be prayed for or talk it through and get counsel over WhatsApp.",
      },
      {
        icon: "book",
        title: "Saints of the day",
        body: "A calendar of saints for every day, and a morning notification that greets you with the day's celebration and saints.",
      },
      {
        icon: "church",
        title: "Homilies from the priests",
        body: "A collection of homilies and videos from priests, on one page beside prayer and devotion.",
      },
      {
        icon: "calendar",
        title: "Prayer reminders",
        body: "Reminders for the Angelus, the Rosary, the Divine Mercy hour and the daily reading, chosen by you. Tap the notification and the prayer opens right away.",
      },
      {
        icon: "profile",
        title: "Prayer flames and Redeem a Day",
        body: "Seven flames a week, lit by your prayer, reading and devotion. Missed a day? Redeem it with a single Bible verse.",
      },
      {
        icon: "users",
        title: "Several communities",
        body: "Join as many communities as you like and pick one as your main. Each community page can be shared over WhatsApp or sent to a friend as a message.",
      },
      {
        icon: "church",
        title: "The Catholic Church in Indonesia",
        body: "Every diocese in Indonesia, the profile of each bishop and a directory of priests, on one tappable map.",
      },
    ],
  },

  voices: {
    smallTitleLead: "One faith,",
    smallTitleRest: "a million stories",
    illustrative: "Illustrative stories",
    counter: "You've opened",
    close: "Close",
    // Rendered as "DISCOVER DAMAR'S STORY".
    discover: "Discover",
    readingTime: "min read",
    servicesLabel: "Where they've served",
    hint: "Drag, then click anyone",
    // Same nudge, phrased for a thumb — shown instead of `hint` on phones.
    hintTouch: "Swipe, then tap anyone",
    soundOn: "Sound",
    people: voicesPeople,
  },

  map: {
    eyebrow: "Connected nationwide",
    heading: "37 dioceses.",
    findMass: "Find Mass Times",
    stats: [
      { value: "37", label: "Dioceses" },
      { value: "8M+", label: "Catholics in Indonesia" },
      { value: "1", label: "Shared room" },
    ],
  },

  blog: {
    eyebrow: "Blog",
    heading: "Easy reading for the road of faith",
    sub: "Lives of the saints, Church history, gentle catechesis, and stories from the communities.",
    readMore: "Read",
    viewAll: "See all writing",
    backToBlog: "Back to the blog",
    empty: "Nothing published yet. Come back in a little while.",
    emptyConfig:
      "The blog isn't connected to the database yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    notFound: "We couldn't find that piece.",
    allCategories: "All",
    minRead: "min read",
    by: "By",
    newer: "Newer",
    older: "Older",
    page: "Page",
    relatedHeading: "More writing",
  },

  alkitab: {
    eyebrow: "Bible",
    heading: "The Catholic Bible, all 73 books.",
    lead: "Old Testament, New Testament and the Deuterocanon in the Indonesian Terjemahan Baru — the same text the Ruang Iman app reads.",
    editionNote: "Indonesian edition (Terjemahan Baru).",
    englishNote: "Want the full English-language Bible?",
    englishCta: "Open the app",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    deutero: "Deuterocanon",
    chapters: "chapters",
    chapter: "Chapter",
    selectChapter: "Pick a chapter",
    prev: "Previous",
    next: "Next",
    backToBooks: "All books",
    searchPlaceholder: "Search book names...",
    noResults: "No books match your search.",
    contents: "Contents",
    chaptersShort: "Ch",
    close: "Close",
    empty: "This chapter isn't available yet. Try another one.",
    readInApp: "Read in the app",
  },

  jadwalMisa: {
    eyebrow: "Mass schedules",
    heading: "Catholic Mass times across Indonesia.",
    lead: "Find a church near you and see its daily, Sunday and feast-day Mass times — the same data that's in the app.",
    provinces: "Provinces",
    churches: "churches",
    church: "Church",
    regularSchedule: "Regular Mass times",
    specialSchedule: "Feast days & special Masses",
    address: "Address",
    openMaps: "Open in Google Maps",
    backToProvinces: "All provinces",
    backToProvince: "Back to",
    empty: "No Mass schedule data for this area yet.",
    notFound: "That church could not be found.",
    syncedAt: "Data updated",
    findNearby: "Find a church in your province",
  },

  cta: {
    heading: "The door is always open.",
    sub: "Free, and about a minute to get started.",
    button: "Enter Ruang Iman",
  },

  footer: {
    tagline: "A place to gather, learn and connect for Indonesia's Catholic community.",
    explore: "Explore",
    app: "App",
    openApp: "Open Ruang Iman",
    madeBy: "Made wholeheartedly by",
    rights: "All rights reserved.",
  },

  pages: {
    cerita: {
      eyebrow: "Our story",
      heading: "The home we needed didn't exist, so we built it.",
      lead: "Ruang Iman didn't start in a strategy meeting. It started with a feeling that was hard to shake: there are so many of us, so why does it feel like we're each on our own?",
      sections: [
        {
          title: "What kept bothering me",
          body: [
            "Every week, millions of Indonesian Catholics walk into church, sit shoulder to shoulder, sing the same songs, and go home without ever learning each other's names.",
            "Meanwhile there are hundreds of communities working hard — prayer groups, categorial communities, youth ministries — and nearly all of them are working alone. A great programme in one city never reaches the next. Know-how doesn't spread. Neither does the energy.",
          ],
        },
        {
          title: "What we believe",
          body: [
            "Faith was never an individual sport. From the very beginning the Church has taken the shape of a gathering — people who come together, break bread, and carry one another.",
            "If we can move even a little of that warmth onto the screen we hold all day, we're not replacing Mass. We're stretching Sunday across the other six days.",
          ],
        },
        {
          title: "What we built",
          body: [
            "Ruang Iman is built around one simple question: what does an ordinary Catholic actually need, on an ordinary day?",
            "The answer turned out not to be complicated. Something to sit with in the morning. Somewhere to leave a prayer and know it was heard. A way to find community in a new city. An invitation that doesn't drown in a group chat. And friends heading the same direction.",
          ],
        },
        {
          title: "Where this is going",
          body: [
            "This is still early. Ruang Iman will keep growing around the people who use it — not around a rigid product roadmap.",
            "If you have feedback, a community that wants to join, or you just want to talk, the door is open. Come into the app and say hello.",
          ],
        },
      ],
    },
    fitur: {
      eyebrow: "Features",
      heading: "What you can actually do in here.",
      lead: "Nothing was added just to make the list look longer. Every part of this came from something Catholics already do.",
      tryIt: "Try this feature",
    },
    blog: {
      eyebrow: "Blog",
      heading: "Writing from Ruang Iman",
      lead: "Lives of the saints, Church history, gentle catechesis, and stories from the communities — written to be read slowly.",
    },
  },
};

export default en;
