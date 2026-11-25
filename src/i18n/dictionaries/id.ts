/**
 * Bahasa Indonesia — the source-of-truth dictionary.
 * `en.ts` mirrors this shape and is type-checked against it.
 *
 * Voice: warm, first-person, unhurried. Not a church bulletin, not a pitch deck.
 * Write like Nico telling a friend over coffee why he built this.
 */
import voicesPeople from "./voices.id";

const id = {
  meta: {
    home: {
      title: "Ruang Iman — Rumah untuk iman kita",
      description:
        "Ruang Iman adalah rumah digital untuk umat Katolik Indonesia: tempat berkumpul, bertumbuh secara rohani bersama, dan saling terhubung antar pribadi maupun komunitas.",
    },
    cerita: {
      title: "Cerita di balik Ruang Iman",
      description:
        "Kenapa Nico Japar dan Tony Chen membangun Ruang Iman: sebuah rumah bagi umat Katolik Indonesia yang seiman, tapi selama ini jarang saling terhubung.",
    },
    fitur: {
      title: "Apa saja isi Ruang Iman",
      description:
        "Renungan harian, doa, Alkitab, komunitas se-Indonesia, sahabat seiman, acara, camp, dan berita — semuanya dalam satu ruang.",
    },
    blog: {
      title: "Blog Ruang Iman",
      description:
        "Cerita, katekese ringan, kisah orang kudus, dan sejarah Gereja — ditulis untuk dibaca santai, bukan untuk digurui.",
    },
    // Both of these carry the keywords people actually type into Google.
    alkitab: {
      title: "Alkitab Katolik Online — 73 Kitab Lengkap",
      description:
        "Baca Alkitab Katolik online lengkap 73 kitab, termasuk Deuterokanonika, dalam Bahasa Indonesia. Gratis, tanpa iklan, bisa dibaca di HP.",
    },
    jadwalMisa: {
      title: "Jadwal Misa Katolik Seluruh Indonesia",
      description:
        "Cari jadwal Misa gereja Katolik terdekat di seluruh Indonesia — Misa harian, Misa Minggu, dan Misa hari raya, lengkap dengan alamat dan peta.",
    },
  },

  nav: {
    home: "Beranda",
    story: "Cerita Kami",
    features: "Fitur",
    massTimes: "Jadwal Misa",
    bible: "Alkitab",
    blog: "Blog",
    cta: "Buka Aplikasi",
    menu: "Menu",
    close: "Tutup",
    switchLang: "Ganti bahasa",
  },

  hero: {
    eyebrow: "Untuk umat Katolik Indonesia",
    // The giant wordmark behind the portrait. Uppercased by the component.
    wordmark: "RUANG IMAN",
    // Stacked over the portrait's chest, one line per entry.
    headlineLines: ["Rumah untuk", "Iman Kita."],
    sub: "Satu tempat untuk berdoa, membaca Kitab Suci, dan saling menemukan — dari Sabang sampai Merauke.",
    foundedBy: "Didirikan oleh",
    cta: "Buka Aplikasi",
    ctaSecondary: "Ceritanya",
    scrollHint: "Gulir",
    // The two floating cards on the left of the hero.
    stats: [
      { value: "8jt+", label: "Umat Katolik\nIndonesia" },
      { value: "37", label: "Keuskupan\nterhubung" },
    ],
    // The list on the right — the five areas of the app, which section two
    // then walks through one by one.
    pillars: ["Beranda", "Rohani", "Komunitas", "Koneksi", "Berita"],
  },

  // The left rail that the hero navigation folds into.
  sidebar: {
    tagline:
      "Rumah digital untuk umat Katolik Indonesia — berkumpul, bertumbuh, dan saling terhubung.",
    nav: [
      { id: "beranda", label: "Beranda", icon: "home" },
      { id: "perjalanan", label: "Perjalanan", icon: "route" },
      { id: "cerita", label: "Cerita", icon: "quote" },
      { id: "fitur", label: "Fitur", icon: "grid" },
      { id: "komunitas", label: "Komunitas", icon: "map" },
      { id: "blog", label: "Blog", icon: "news" },
    ],
  },

  // Section two: the five areas of the app as one journey, threaded along a
  // path that draws itself as you scroll.
  journey: {
    eyebrow: "Perjalanan di dalam",
    heading: "Lima ruang, satu perjalanan.",
    lead: "Begini rasanya memakai Ruang Iman sehari-hari — dari membuka mata pagi hari sampai ketemu orangnya betulan.",
    stops: [
      {
        no: "01",
        key: "Beranda",
        title: "Mulai dari rumah.",
        body: "Tempat kamu mendarat tiap pagi. Renungan hari ini, intensi doa yang baru masuk, dan kabar dari komunitasmu — semuanya di layar pertama.",
        tags: ["Renungan harian", "Ruang doa", "Kabar terbaru"],
      },
      {
        no: "02",
        key: "Terhubung",
        title: "Cari orangnya, bukan cuma kontennya.",
        body: "Profil, minat, dan pelayanan. Temukan orang yang sedang berjalan ke arah yang sama denganmu, lalu mulai percakapan yang tidak berhenti di 'salam kenal'.",
        tags: ["Sahabat seiman", "Profil", "Pesan"],
      },
      {
        no: "03",
        key: "Rohani",
        title: "Yang bikin kamu bertumbuh.",
        body: "Kitab Suci lengkap, permenungan yang tidak menggurui, dan tempat menitipkan doa — lalu tahu bahwa ada orang sungguhan yang mendoakanmu balik.",
        tags: ["Alkitab", "Renungan", "Doa"],
      },
      {
        no: "04",
        key: "Komunitas",
        title: "Ketemu di dunia nyata.",
        body: "Peta komunitas Katolik se-Indonesia, jadwal acara, camp dan retret. Karena pada akhirnya iman tidak tumbuh di layar — ia tumbuh waktu kamu datang.",
        tags: ["Peta komunitas", "Acara", "Camp & retret"],
      },
      {
        no: "05",
        key: "Berita",
        title: "Kabar dari keluarga besar.",
        body: "Cerita dari komunitas lain, refleksi, dan hal-hal baik yang layak dirayakan bersama. Supaya kita tahu: kita tidak sedang berjalan sendirian.",
        tags: ["Cerita komunitas", "Refleksi", "Kabar baik"],
      },
    ],
  },

  story: {
    label: "Sedikit cerita",
    frames: [
      {
        index: "01",
        kicker: "Kita ini banyak",
        title: "Delapan juta lebih.",
        body: "Umat Katolik Indonesia tersebar di ribuan pulau, ratusan paroki, tak terhitung komunitas kecil yang setia berkumpul tiap minggu.",
      },
      {
        index: "02",
        kicker: "Tapi",
        title: "Kita jalan sendiri-sendiri.",
        body: "Komunitas di kota sebelah tak kenal komunitas kita. Orang di bangku belakang tak kenal orang di bangku depan. Seiman — tapi tidak saling terhubung.",
      },
      {
        index: "03",
        kicker: "Padahal",
        title: "Iman tumbuh paling subur kalau dijalani bareng.",
        body: "Doa jadi lebih ringan waktu ada yang mendoakan balik. Pertanyaan sulit jadi lebih jujur waktu ada teman seperjalanan.",
      },
      {
        index: "04",
        kicker: "Jadi",
        title: "Aku bikin satu ruang.",
        body: "Bukan aplikasi rohani yang kaku. Sebuah rumah — tempat kamu bisa mampir tiap hari, ketemu orang, dan pulang dengan iman yang sedikit lebih hangat.",
      },
    ],
  },

  founder: {
    eyebrow: "Dari para pendiri",
    heading: "Kenapa aku bikin Ruang Iman",
    paragraphs: [
      "Aku Nico Japar. Aku bukan pastor, bukan teolog. Aku cuma orang Katolik biasa yang lama memperhatikan satu hal yang mengganjal.",
      "Di Indonesia, kita punya komunitas Katolik yang luar biasa hidup. Tapi mereka hidup masing-masing. Satu komunitas punya program bagus, komunitas lain tidak pernah tahu. Ada orang yang sedang berat imannya, duduk sendirian di Misa, dan tidak ada yang tahu namanya.",
      "Aku pikir, sayang sekali. Kita ini satu keluarga besar yang kebetulan belum saling kenalan.",
      "Ruang Iman lahir dari situ. Aku ingin ada satu tempat yang rasanya seperti pulang: kamu bisa buka pagi-pagi untuk renungan, menitip doa dan benar-benar ada yang mendoakan, menemukan komunitas di kotamu, ikut acara, lalu berteman betulan — bukan cuma nambah kontak.",
      "Ini bukan proyek besar dengan tim besar. Ini dibangun pelan-pelan, malam demi malam, karena aku percaya iman kita akan jauh lebih kuat kalau dijalani bersama.",
    ],
    quote:
      "Kita seiman. Tinggal satu langkah lagi: saling terhubung.",
    name: "Nico Japar",
    role: "Founder Ruang Iman",
    cta: "Baca cerita lengkapnya",
    // Rendered under Nico's note. Written in the third person on purpose: it is
    // not Tony's own voice, and it only states what he does for the project.
    cofounder: {
      eyebrow: "Co-Founder",
      heading: "Dan satu lagi yang membuat rumah ini sampai ke umat.",
      paragraphs: [
        "Tony Chen bergabung sebagai Co-Founder Ruang Iman. Ia punya jaringan yang luas di antara komunitas-komunitas Katolik di seluruh Indonesia.",
        "Aplikasi sebagus apa pun tidak berarti kalau tidak sampai ke umat. Tugas Tony adalah membawa Ruang Iman ke komunitas-komunitas itu, dari kelompok doa kecil sampai komunitas besar, supaya semakin banyak umat Katolik Indonesia punya satu rumah yang sama.",
      ],
      name: "Tony Chen",
      role: "Co-Founder Ruang Iman",
      tags: ["Jaringan komunitas", "Penyebaran aplikasi"],
    },
  },

  features: {
    eyebrow: "Isi rumahnya",
    heading: "Sepuluh alasan untuk membukanya tiap hari.",
    sub: "Semuanya berangkat dari kebiasaan nyata umat — bukan daftar fitur supaya kelihatannya panjang.",
    cta: "Lihat semua fitur",
    // Nudge for the horizontal slider on the home page.
    dragHint: "Geser untuk lihat semua",
    /**
     * The single source of truth for what's in the app. The home page shows
     * these as a horizontal slider, /fitur as a stacked list.
     *
     * `slug` is what names this feature's media on disk — the slider looks for
     * /features/<slug>.mp4, .jpg (poster) and /features/icons/<slug>.mp4. It is
     * deliberately NOT translated: the files are shared between locales.
     */
    items: [
      {
        slug: "profil",
        icon: "profile",
        title: "Profil dan Timeline Kamu",
        body: "Perjalanan imanmu, komunitas yang kamu ikuti, dan lagu rohani favoritmu. Plus Timeline Saya untuk acara yang kamu layani, lengkap dengan teman yang ikut membantu.",
        tags: ["Perjalanan", "Timeline", "Lagu favorit"],
      },
      {
        slug: "bagikan",
        icon: "thought",
        title: "Bagikan Isi Hatimu",
        body: "Tulis apa yang sedang kamu syukuri, doakan, atau pertanyakan. Satu ekosistem yang membacanya — dan membalas.",
        tags: ["Refleksi", "Diskusi", "Saling dukung"],
      },
      {
        slug: "alkitab",
        icon: "bible",
        title: "Alkitab untuk Dibaca dan Didengar",
        body: "Tiga versi: TB (Indonesia), NRSV-CE dan NKJV (Inggris). Kitab Deuterokanonika ada di NRSV-CE. Bisa dibacakan ayat demi ayat, dicari per kata di seluruh Alkitab, dan ayat favoritmu tersimpan.",
        tags: ["3 versi", "Dibacakan", "Cari kata"],
      },
      {
        slug: "renungan",
        icon: "book",
        title: "Bacaan dan Renungan Harian",
        body: "Bacaan Misa hari ini mengikuti teks lektionari KWI: bacaan, mazmur, dan Injil, plus Santo dan Santa yang dirayakan. Lalu lanjutkan dengan rencana renungan.",
        tags: ["Bacaan KWI", "Santo & Santa", "Rencana renungan"],
      },
      {
        slug: "doa",
        icon: "hands",
        title: "Doa Katolik",
        body: "Jalan Salib 14 perhentian, doa dalam bahasa Aram, Doa Medali Santo Benediktus, serta doa harian dan doa dasar. Semuanya siap dibuka, tinggal cari.",
        tags: ["Jalan Salib", "Doa Aram", "Doa harian"],
      },
      {
        slug: "temukan",
        icon: "users",
        title: "Terhubung dengan Sesama Umat",
        body: "Dari komunitas dan kotamu, temukan umat lain yang sedang berjalan ke arah yang sama. Kirim permintaan pertemanan, lalu kenalan tanpa rasa canggung.",
        tags: ["Komunitas", "Kota", "Teman"],
      },
      {
        slug: "rosario",
        icon: "hands",
        title: "Beautiful Rosario",
        body: "Berdoa Rosario dengan manik yang bercahaya, dalam tampilan 2D atau 3D. Geser dial untuk berpindah manik, dan setiap peristiwa dilengkapi ayat Kitab Suci.",
        tags: ["Tampilan 3D", "Ayat tiap peristiwa", "Manik bercahaya"],
      },
      {
        slug: "pusat-komunitas",
        icon: "calendar",
        title: "Semua Kegiatan Komunitas dalam Satu Aplikasi",
        body: "Buat event dan camp, kelola panitia dan rapat, atur anggota, dan jalankan Connect Group. Semua kegiatan komunitasmu ada di satu tempat.",
        tags: ["Event & camp", "Connect Group", "Anggota"],
      },
      {
        slug: "kabar",
        icon: "news",
        title: "Warta Komunitas",
        body: "Berita gereja, event, dan blog dari komunitas di seluruh Indonesia, supaya yang baik di satu kota tidak berhenti di kota itu.",
        tags: ["Berita", "Event", "Blog"],
      },
      {
        slug: "jadwal-misa",
        icon: "church",
        title: "Jadwal Misa Se-Indonesia",
        body: "Jadwal Misa dari paroki di seluruh nusantara. Sedang di luar kota? Gereja terdekat dan jam Misanya ada di genggaman.",
        tags: ["Nasional", "Paroki", "Jam Misa"],
      },
    ],
  },

  // "What's new": features shipped since the first ten. The first four have a
  // real app screenshot (/whats-new/<shot>); the rest render as compact cards.
  // `soon` marks something built but not yet released.
  whatsNew: {
    eyebrow: "Baru di Ruang Iman",
    heading: "Rumahnya makin hidup.",
    sub: "Doa, Kitab Suci, komunitas, dan event: fitur-fitur terbaru yang kami tambahkan setelah mendengar kebutuhan umat.",
    soon: "Segera hadir",
    cta: "Coba di aplikasi",
    showcase: [
      {
        shot: "4-rosario-3d.jpg",
        icon: "hands",
        title: "Rosario 2D & 3D",
        body: "Berdoa Rosario dengan manik yang bercahaya. Geser dial untuk berpindah manik, dan ganti ke tampilan 3D kapan pun kamu mau.",
        tags: ["Tampilan 3D", "Geser dial", "Manik bercahaya"],
      },
      {
        shot: "5-alkitab.jpg",
        icon: "bible",
        title: "Alkitab yang bisa kamu dengarkan",
        body: "Baca dengan nyaman, atau putar tiap pasal dibacakan ayat demi ayat dengan sorotan, lengkap dengan pilihan kecepatan. Cari kata di seluruh Alkitab, atau langsung loncat ke ayat seperti Yeremia 31:3.",
        tags: ["Dibacakan", "Cari kata", "Ayat favorit"],
      },
    ],
    flows: [
      {
        icon: "users",
        title: "Buka komunitasmu untuk umat Ruang Iman",
        intro: "Dari ide sampai kegiatan nyata. Semua langkahnya ada di Pusat Komunitas.",
        steps: [
          {
            title: "Buat komunitasmu",
            body: "Beri nama, logo, dan tagline, lalu tulis halaman Tentang yang bisa dibagikan ke WhatsApp.",
          },
          {
            title: "Buka untuk pengguna Ruang Iman",
            body: "Pilih terbuka untuk siapa saja, atau perlu persetujuan admin dengan pertanyaan pendaftaran sendiri.",
          },
          {
            title: "Terima anggota",
            body: "Setujui permintaan gabung, tambahkan anggota yang sudah punya akun, dan undang yang belum.",
          },
          {
            title: "Jalankan kegiatan",
            body: "Buat event, camp, dan Connect Group, lalu kelola panitia dan anggotanya.",
          },
        ],
      },
      {
        icon: "calendar",
        title: "Tiket event dengan QR",
        intro: "Dari pendaftaran sampai daftar hadir, tanpa kertas dan tanpa ribet.",
        steps: [
          {
            title: "Bagikan tautan pendaftaran",
            body: "Peserta mendaftar lewat tautan pendek tanpa perlu login. Akun Ruang Iman dibuatkan otomatis.",
          },
          {
            title: "Tiket QR langsung jadi",
            body: "Tiket tampil di layar dan bisa diunduh, siap ditunjukkan di pintu masuk.",
          },
          {
            title: "Scan di pintu masuk",
            body: "Panitia memindai QR untuk mencatat kehadiran, lengkap dengan waktu scan dan siapa yang memindai.",
          },
          {
            title: "Unduh daftar hadir",
            body: "Ekspor ke Excel atau PDF, atau cetak tiket A5 dan kartu nama dengan desain sendiri.",
          },
        ],
      },
    ],
    more: [
      {
        icon: "users",
        title: "Connect Group",
        body: "Kelompok kecil di dalam komunitas. Pilih PIC, pengurus, dan anggota dari pengguna Ruang Iman, dan dapat pengingat sebelum pertemuan.",
      },
      {
        icon: "hands",
        title: "Intensi Doa dan SOS Doa",
        body: "Titipkan intensi dan saling mendoakan. Saat berat, minta didoakan atau curhat dan berkonsultasi lewat WhatsApp.",
      },
      {
        icon: "book",
        title: "Santo dan Santa hari ini",
        body: "Kalender orang kudus tiap hari, dan notifikasi pagi yang menyapa dengan perayaan serta santo-santa hari itu.",
      },
      {
        icon: "church",
        title: "Kotbah Romo",
        body: "Kumpulan homili dan video dari para Romo, satu halaman dengan doa dan renungan.",
      },
      {
        icon: "calendar",
        title: "Pengingat doa",
        body: "Pengingat Angelus, Rosario, Jam Kerahiman, dan bacaan harian yang kamu pilih sendiri. Ketuk notifikasinya, dan doanya langsung terbuka.",
      },
      {
        icon: "profile",
        title: "Api doa dan Tebus Hari",
        body: "Tujuh api tiap minggu yang menyala dari doa, bacaan, dan renunganmu. Lupa sehari? Tebus Hari dengan satu ayat Kitab Suci.",
      },
      {
        icon: "users",
        title: "Beberapa komunitas",
        body: "Gabung ke banyak komunitas dan pilih satu sebagai komunitas utama. Halaman tiap komunitas bisa dibagikan lewat WhatsApp atau sebagai pesan ke teman.",
      },
      {
        icon: "church",
        title: "Gereja Katolik Indonesia",
        body: "Keuskupan se-Indonesia, profil para uskup, dan direktori Romo, dalam satu peta yang bisa diketuk.",
      },
    ],
  },

  // The wall of members, sitting right after the map: the map shows the reach,
  // this shows what the reach is actually made of.
  voices: {
    // One small line at the top of the wall, the way the reference does it —
    // the cards are the content, the title just names the room.
    smallTitleLead: "Satu Iman,",
    smallTitleRest: "Sejuta Cerita",
    // Rendered whenever any person is still an invented persona.
    illustrative: "Cerita ilustrasi",
    counter: "Sudah kamu buka",
    close: "Tutup",
    // Rendered as "KENALI CERITA DAMAR".
    discover: "Kenali cerita",
    readingTime: "menit baca",
    servicesLabel: "Pelayanannya",
    hint: "Geser, lalu klik siapa saja",
    // Same nudge, phrased for a thumb — shown instead of `hint` on phones.
    hintTouch: "Geser, lalu ketuk siapa saja",
    soundOn: "Suara",
    people: voicesPeople,
  },

  map: {
    eyebrow: "Terhubung se-Indonesia",
    heading: "37 keuskupan.",
    findMass: "Cari Jadwal Gereja",
    stats: [
      { value: "37", label: "Keuskupan" },
      { value: "8jt+", label: "Umat Katolik Indonesia" },
      { value: "1", label: "Ruang bersama" },
    ],
  },

  blog: {
    eyebrow: "Blog",
    heading: "Bacaan santai untuk perjalanan iman",
    sub: "Kisah orang kudus, sejarah Gereja, katekese ringan, dan cerita komunitas.",
    readMore: "Baca",
    viewAll: "Lihat semua tulisan",
    backToBlog: "Kembali ke blog",
    empty: "Belum ada tulisan yang terbit. Mampir lagi sebentar lagi, ya.",
    emptyConfig:
      "Blog belum terhubung ke database. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.",
    notFound: "Tulisan ini tidak ditemukan.",
    allCategories: "Semua",
    minRead: "menit baca",
    by: "Oleh",
    newer: "Lebih baru",
    older: "Lebih lama",
    page: "Halaman",
    relatedHeading: "Tulisan lainnya",
  },

  alkitab: {
    eyebrow: "Alkitab",
    heading: "Alkitab Katolik, lengkap 73 kitab.",
    lead: "Perjanjian Lama, Perjanjian Baru, dan Deuterokanonika dalam Terjemahan Baru — teks yang sama dengan yang dipakai aplikasi Ruang Iman.",
    editionNote: "Edisi Bahasa Indonesia (Terjemahan Baru).",
    englishNote: "Mau Alkitab edisi Bahasa Inggris yang lengkap?",
    englishCta: "Buka aplikasinya",
    oldTestament: "Perjanjian Lama",
    newTestament: "Perjanjian Baru",
    deutero: "Deuterokanonika",
    chapters: "pasal",
    chapter: "Pasal",
    selectChapter: "Pilih pasal",
    prev: "Sebelumnya",
    next: "Berikutnya",
    backToBooks: "Semua kitab",
    searchPlaceholder: "Cari nama kitab...",
    noResults: "Tidak ada kitab yang cocok.",
    contents: "Daftar Isi",
    chaptersShort: "Psl",
    close: "Tutup",
    empty: "Pasal ini belum tersedia. Coba pasal lain, ya.",
    readInApp: "Baca di aplikasi",
  },

  jadwalMisa: {
    eyebrow: "Jadwal Misa",
    heading: "Jadwal Misa Katolik se-Indonesia.",
    lead: "Cari gereja terdekat dan lihat jadwal Misa harian, Misa Minggu, dan Misa hari raya — data yang sama dengan yang ada di aplikasi.",
    provinces: "Provinsi",
    churches: "gereja",
    church: "Gereja",
    regularSchedule: "Jadwal Misa rutin",
    specialSchedule: "Misa hari raya & khusus",
    address: "Alamat",
    openMaps: "Buka di Google Maps",
    backToProvinces: "Semua provinsi",
    backToProvince: "Kembali ke",
    empty: "Belum ada data jadwal Misa untuk wilayah ini.",
    notFound: "Gereja ini tidak ditemukan.",
    syncedAt: "Data diperbarui",
    findNearby: "Cari gereja di provinsimu",
  },

  cta: {
    heading: "Pintunya selalu terbuka.",
    sub: "Gratis, dan cuma butuh satu menit untuk mulai.",
    button: "Masuk ke Ruang Iman",
  },

  footer: {
    tagline: "Tempat berkumpul, belajar, dan terhubung bagi komunitas Katolik Indonesia.",
    explore: "Jelajahi",
    app: "Aplikasi",
    openApp: "Buka Ruang Iman",
    // The founder's name is appended by the component (lib/site.ts FOUNDER).
    madeBy: "Dibuat dengan sepenuh hati oleh",
    rights: "Hak cipta dilindungi.",
  },

  pages: {
    cerita: {
      eyebrow: "Cerita kami",
      heading: "Sebuah rumah yang belum ada, jadi kami bangun sendiri.",
      lead: "Ruang Iman tidak dimulai dari rapat strategi. Ia dimulai dari satu perasaan yang sulit diabaikan: kita ini banyak, tapi kok terasa sendiri-sendiri.",
      sections: [
        {
          title: "Yang mengganjal",
          body: [
            "Setiap minggu, jutaan orang Katolik Indonesia datang ke gereja, duduk berdampingan, menyanyikan lagu yang sama, lalu pulang tanpa saling tahu nama.",
            "Di sisi lain, ada ratusan komunitas yang bekerja keras — kelompok doa, komunitas kategorial, pelayanan orang muda — dan hampir semuanya bekerja sendirian. Program bagus di satu kota tidak pernah sampai ke kota lain. Ilmu tidak menular. Semangat tidak menular.",
          ],
        },
        {
          title: "Yang kami percayai",
          body: [
            "Iman itu bukan olahraga individu. Sejak awal, Gereja selalu berbentuk jemaat — orang-orang yang berkumpul, memecah roti, dan saling menanggung.",
            "Kalau kita bisa memindahkan sedikit saja dari kehangatan itu ke layar yang kita pegang setiap hari, kita tidak sedang menggantikan Misa. Kita sedang memperpanjang hari Minggu ke enam hari sisanya.",
          ],
        },
        {
          title: "Yang kami bangun",
          body: [
            "Ruang Iman dibangun mengelilingi satu pertanyaan sederhana: apa yang sebenarnya dibutuhkan seorang Katolik biasa, di hari biasa?",
            "Jawabannya ternyata tidak rumit. Sesuatu untuk direnungkan pagi hari. Tempat menitipkan doa dan tahu ada yang mendoakan. Cara menemukan komunitas di kota baru. Undangan acara yang tidak tenggelam di grup chat. Dan teman-teman yang sedang berjalan ke arah yang sama.",
          ],
        },
        {
          title: "Ke mana arahnya",
          body: [
            "Ini masih awal. Ruang Iman akan terus tumbuh mengikuti umat yang memakainya — bukan mengikuti peta jalan produk yang kaku.",
            "Kalau kamu punya masukan, komunitas yang ingin bergabung, atau sekadar ingin bercerita, pintunya terbuka. Masuk saja ke aplikasinya, dan sapa.",
          ],
        },
      ],
    },
    fitur: {
      eyebrow: "Fitur",
      heading: "Apa saja yang bisa kamu lakukan di dalam.",
      lead: "Tidak ada fitur yang ditambahkan supaya daftarnya terlihat panjang. Semuanya berangkat dari kebiasaan nyata umat.",
      tryIt: "Coba fitur ini",
    },
    blog: {
      eyebrow: "Blog",
      heading: "Tulisan dari Ruang Iman",
      lead: "Kisah orang kudus, sejarah Gereja, katekese ringan, dan cerita komunitas — ditulis untuk dibaca santai.",
    },
  },
};

export default id;

/**
 * Shape every other locale must satisfy. Deliberately NOT `as const` — the
 * literal types would make `en.ts` unassignable to it.
 */
export type Dictionary = typeof id;
