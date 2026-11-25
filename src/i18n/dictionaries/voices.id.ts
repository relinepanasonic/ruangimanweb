
export type Voice = {
  slug: string;
  name: string;
  initials: string;
  role: string;
  community: string;
  city: string;
  headline: string;
  thought: string;
  verse?: string;
  story: string[];
  services: { year: string; name: string; community: string }[];
  media: "portrait" | "community" | "none";
};

const voices: Voice[] = [
  {
    slug: "damar",
    name: "Damar Prasetyo",
    initials: "DP",
    role: "Anggota aktif",
    community: "Pria Sejati",
    city: "Jakarta",
    headline: "Kopi, teman, dan obrolan akhir pekan.",
    thought: "Dulu aku kira kumpul komunitas itu membosankan. Ternyata rasanya seperti nongkrong bareng sahabat.",
    verse: "Amsal 27:17",
    story: [
      "Kesibukan kerja di Jakarta bikin aku jarang punya waktu luang. Misa Minggu saja sering terburu-buru.",
      "Suatu hari aku diajak ngopi santai bareng teman-teman setelah Misa. Awalnya ragu, tapi ternyata obrolannya seru dan sangat nyambung.",
      "Tidak ada yang terlalu berat atau menggurui, kami cuma bertukar cerita kehidupan sehari-hari.",
      "Sekarang, jadwal ngopi hari Minggu selalu jadi momen yang paling aku tunggu."
    ],
    services: [
      { year: "2024", name: "Anggota", community: "Pria Sejati Jakarta" },
      { year: "2025", name: "Panitia Acara", community: "Pria Sejati Jakarta" },
    ],
    media: "portrait",
  },
  {
    slug: "yohana",
    name: "Yohana Sitanggang",
    initials: "YS",
    role: "Tim doa",
    community: "OMK",
    city: "Medan",
    headline: "Punya support system yang luar biasa.",
    thought: "Aku baru sadar betapa tenangnya punya teman-teman yang saling mendoakan.",
    verse: "Matius 18:20",
    story: [
      "Sebagai anak muda yang sibuk, kadang aku merasa berjalan sendirian menghadapi rutinitas.",
      "Sejak gabung OMK, aku menemukan lingkaran pertemanan yang sangat positif dan selalu ceria.",
      "Kami sering nongkrong bareng, dan di akhir sesi kami selalu menyempatkan untuk saling mendoakan.",
      "Rasanya sangat lega punya sahabat yang selalu mendukung dan mendengarkan."
    ],
    services: [
      { year: "2024", name: "Anggota", community: "OMK Medan" },
      { year: "2025", name: "Tim Doa", community: "OMK Medan" },
    ],
    media: "none",
  },
  {
    slug: "bernardus",
    name: "Bernardus Ola",
    initials: "BO",
    role: "Fotografer",
    community: "Komunitas Kreatif Katolik",
    city: "Flores",
    headline: "Membawa hobi ke dalam pelayanan.",
    thought: "Gereja tidak pernah melarang kita bersenang-senang dengan talenta kita.",
    story: [
      "Aku selalu suka fotografi dan jalan-jalan bareng teman-teman.",
      "Suatu hari Romo meminta bantuanku untuk memotret acara anak muda di paroki.",
      "Ternyata seru sekali bisa memakai hobiku untuk kegiatan komunitas.",
      "Sekarang aku dan teman-teman malah bikin tim dokumentasi sendiri. Berkarya sambil kumpul-kumpul."
    ],
    services: [
      { year: "2024", name: "Fotografer", community: "Acara Paroki" },
      { year: "2025", name: "Tim Kreatif", community: "Keuskupan" },
    ],
    media: "community",
  },
  {
    slug: "clara",
    name: "Clara Wijaya",
    initials: "CW",
    role: "Anggota",
    community: "Legio Mariae Muda",
    city: "Semarang",
    headline: "Memulai dari hal-hal kecil yang menyenangkan.",
    thought: "Pelayanan tidak selalu harus berat. Kadang cukup dengan senyum dan kehadiran.",
    story: [
      "Dulu aku ragu ikut komunitas karena takut terlalu kaku.",
      "Tapi setelah mencoba datang, ternyata suasananya sangat cair dan modern.",
      "Kami sering mengadakan bakti sosial sambil jalan-jalan kuliner setelahnya.",
      "Iman ternyata bisa dirayakan dengan cara yang sangat ceria dan bersahabat."
    ],
    services: [
      { year: "2024", name: "Anggota", community: "Legio Mariae" },
      { year: "2025", name: "Seksi Acara", community: "Legio Mariae" },
    ],
    media: "none",
  },
  {
    slug: "yosef",
    name: "Yosef Rumbiak",
    initials: "YR",
    role: "Koordinator anak muda",
    community: "Komunitas Kitorang",
    city: "Jayapura",
    headline: "Musik, taman, dan cerita akhir pekan.",
    thought: "Kami lebih suka berkumpul di alam terbuka sambil main gitar.",
    verse: "1 Korintus 12:12",
    story: [
      "Setiap Sabtu sore, kami sering kumpul di taman atau pinggir danau.",
      "Acara kami sangat santai: main gitar, nyanyi bareng, dan sekadar ngobrol ringan.",
      "Dari obrolan santai itu, sering kali kami jadi lebih saling mengenal dan mendukung.",
      "Gereja buat kami bukan cuma gedung, tapi kebersamaan di mana saja kami berada."
    ],
    services: [
      { year: "2024", name: "Koodinator", community: "Komunitas Kitorang" },
    ],
    media: "community",
  },
  {
    slug: "maria",
    name: "Maria Lengkong",
    initials: "ML",
    role: "Penyanyi",
    community: "Paduan Suara Muda",
    city: "Manado",
    headline: "Bernyanyi sambil merayakan hidup.",
    thought: "Latihan paduan suara adalah momen pelarian paling menyenangkan dari penatnya kerja.",
    story: [
      "Menyanyi sudah jadi bagian hidupku sejak kecil.",
      "Gabung di paduan suara anak muda paroki ternyata seru banget. Kami tidak kaku.",
      "Setiap selesai latihan kami pasti nongkrong atau makan bareng.",
      "Pelayanan yang dilakukan dengan hati gembira terasa sangat ringan."
    ],
    services: [
      { year: "2023", name: "Penyanyi", community: "Paduan Suara Muda" },
      { year: "2025", name: "Pengurus Harian", community: "Paduan Suara Muda" },
    ],
    media: "portrait",
  },
  {
    slug: "antonius",
    name: "Antonius Halim",
    initials: "AH",
    role: "Anggota",
    community: "Komunitas Profesional Katolik",
    city: "Surabaya",
    headline: "Menemukan keseimbangan kerja dan iman.",
    thought: "Punya teman-teman yang suportif di dunia profesional itu anugerah.",
    story: [
      "Di dunia kerja yang kompetitif, kadang kita butuh ruang untuk rileks.",
      "Lewat komunitas profesional muda ini, aku menemukan tempat berbagi yang aman.",
      "Kami saling mendukung, berjejaring, dan tetap menjaga nilai-nilai kebaikan.",
      "Kami sering ngopi bareng sambil membahas ide-ide bisnis yang positif."
    ],
    services: [
      { year: "2024", name: "Anggota", community: "Profesional Muda" },
    ],
    media: "none",
  },
  {
    slug: "fransiska",
    name: "Fransiska Dewi",
    initials: "FD",
    role: "Creative Director",
    community: "Komsos Paroki",
    city: "Yogyakarta",
    headline: "Gereja yang relevan dengan gaya hidup modern.",
    thought: "Anak muda suka hal-hal kreatif, dan kita bisa membawanya ke gereja.",
    verse: "Ibrani 10:24-25",
    story: [
      "Aku selalu percaya gereja itu bisa tampil modern dan aesthetic.",
      "Bersama teman-teman Komsos, kami mendesain konten media sosial paroki agar lebih fresh.",
      "Ide-ide liar dan kreatif sangat dihargai di sini.",
      "Seru sekali melihat anak-anak muda lain jadi lebih antusias berpartisipasi."
    ],
    services: [
      { year: "2024", name: "Tim Kreatif", community: "Komsos" },
    ],
    media: "community",
  },
  {
    slug: "gregorius",
    name: "Gregorius Sanjaya",
    initials: "GS",
    role: "Tim acara",
    community: "Patriot",
    city: "Makassar",
    headline: "Bertemu sahabat di kota perantauan.",
    thought: "Satu sapaan ramah mengubah caraku melihat akhir pekan.",
    story: [
      "Awal pindah kerja ke kota ini, aku tidak punya teman satupun.",
      "Suatu hari setelah Misa, ada yang mengajakku berkenalan dan ngopi.",
      "Sekarang grup teman-teman gereja ini jadi teman jalan dan teman makan paling seru.",
      "Tidak ada lagi akhir pekan yang sepi di kota baru."
    ],
    services: [
      { year: "2024", name: "Anggota", community: "Patriot Makassar" },
    ],
    media: "none",
  },
  {
    slug: "theresia",
    name: "Theresia Anggun",
    initials: "TA",
    role: "Penyelenggara acara",
    community: "Komunitas Muda Berbagi",
    city: "Jakarta",
    headline: "Berbagi itu bisa dengan gaya yang fun.",
    thought: "Kami bikin charity event yang bentuknya seperti festival seni.",
    verse: "Matius 25:40",
    story: [
      "Kata siapa kegiatan sosial itu selalu membosankan?",
      "Kami sering membuat acara charity yang digabung dengan pameran seni atau live music.",
      "Antusiasmenya luar biasa, teman-teman dari luar gereja pun banyak yang ikut hadir.",
      "Membantu sesama ternyata sangat menyenangkan jika dilakukan bersama-sama."
    ],
    services: [
      { year: "2025", name: "Ketua Panitia", community: "Charity Festival" },
    ],
    media: "portrait",
  },
  {
    slug: "ignasius",
    name: "Ignasius Tarigan",
    initials: "IT",
    role: "Mentor OMK",
    community: "OMK",
    city: "Berastagi",
    headline: "Energi anak muda yang tak ada habisnya.",
    thought: "Cukup kasih mereka ruang, ide-ide keren akan bermunculan sendiri.",
    story: [
      "Anak muda sekarang itu kritis dan penuh energi positif.",
      "Aku cuma mendampingi sesekali, membiarkan mereka mengeksekusi ide acara mereka sendiri.",
      "Dari pertandingan esport sampai akustikan, mereka buat semuanya hidup.",
      "Bangga rasanya melihat mereka begitu bersemangat."
    ],
    services: [
      { year: "2024", name: "Pendamping", community: "OMK" },
    ],
    media: "community",
  },
  {
    slug: "veronika",
    name: "Veronika Sari",
    initials: "VS",
    role: "Tuan rumah",
    community: "Sel Muda",
    city: "Bandung",
    headline: "Kumpul di rumah, makan-makan, dan ngobrol.",
    thought: "Kami lebih sering menyebutnya potluck akhir bulan daripada rapat.",
    story: [
      "Setiap akhir bulan, aku selalu menawarkan rumahku untuk tempat kumpul teman-teman sel muda.",
      "Kami patungan beli makanan, masak bareng, dan nonton film.",
      "Doanya tidak panjang, tapi kebersamaannya sangat berkesan.",
      "Ini definisi rumah yang hangat dan penuh tawa."
    ],
    services: [
      { year: "2024", name: "Anggota", community: "Sel Muda" },
    ],
    media: "portrait",
  },
  {
    slug: "markus",
    name: "Markus Doni",
    initials: "MD",
    role: "Inisiator",
    community: "Grup Diskusi Modern",
    city: "Kupang",
    headline: "Diskusi santai tapi bermakna.",
    thought: "Kami suka berkumpul di kafe untuk membahas topik-topik kehidupan.",
    story: [
      "Kami sering nongkrong di kafe favorit setiap Jumat malam.",
      "Topik yang dibahas bebas, mulai dari karir, hubungan, sampai iman.",
      "Suasananya selalu rileks, penuh canda tawa, dan tidak menghakimi.",
      "Grup kecil ini jadi tempat kami bertumbuh bersama."
    ],
    services: [
      { year: "2024", name: "Fasilitator", community: "Grup Diskusi" },
    ],
    media: "community",
  },
  {
    slug: "agnes",
    name: "Agnes Priscilla",
    initials: "AP",
    role: "Anggota",
    community: "Komunitas Ekspatriat & Perantau",
    city: "Denpasar",
    headline: "Menemukan keluarga baru di Pulau Dewata.",
    thought: "Kami datang dari berbagai kota, bertemu dan nyambung begitu saja.",
    verse: "Mazmur 133:1",
    story: [
      "Kerja di Bali bikin aku jauh dari keluarga di Flores.",
      "Tapi di sini aku menemukan komunitas perantau yang sangat seru dan dinamis.",
      "Kami sering roadtrip bareng di akhir pekan atau sekadar brunch bareng setelah Misa.",
      "Bali tidak pernah terasa sepi dengan kehadiran mereka."
    ],
    services: [
      { year: "2025", name: "Anggota", community: "Komunitas Perantau" },
    ],
    media: "none",
  },
  {
    slug: "petrus",
    name: "Petrus Kambu",
    initials: "PK",
    role: "Tim Acara",
    community: "Komunitas Orang Muda",
    city: "Merauke",
    headline: "Merayakan keberagaman dengan gaya yang asyik.",
    thought: "Teman-temanku datang dari berbagai latar belakang, dan itu yang bikin seru.",
    story: [
      "Kami sering bikin acara lintas komunitas yang kasual dan modern.",
      "Biasanya bentuknya piknik atau konser kecil-kecilan.",
      "Dari acara seperti ini, banyak teman baru yang ikut bergabung.",
      "Berada di tengah keberagaman membuat kami semakin kaya warna."
    ],
    services: [
      { year: "2025", name: "Panitia", community: "Acara Orang Muda" },
    ],
    media: "community",
  },
  {
    slug: "lidwina",
    name: "Lidwina Cahya",
    initials: "LC",
    role: "Mahasiswi",
    community: "KMK",
    city: "Malang",
    headline: "Masa kuliah yang diisi dengan hal positif.",
    thought: "Komunitas kampus jadi pelarianku yang paling seru kalau lagi pusing tugas.",
    story: [
      "Jadi mahasiswa itu capek. Tapi untung aku punya teman-teman KMK yang super asyik.",
      "Kami sering belajar bareng di perpustakaan atau ngopi di dekat kampus.",
      "Tidak ada senioritas, semuanya berbaur dan saling bercanda.",
      "Masa kuliahku jadi jauh lebih berwarna berkat mereka."
    ],
    services: [
      { year: "2025", name: "Anggota", community: "KMK Malang" },
    ],
    media: "none",
  },
  {
    slug: "stefanus",
    name: "Stefanus Rian",
    initials: "SR",
    role: "Musisi",
    community: "Tim Musik Liturgi",
    city: "Pontianak",
    headline: "Bermain musik untuk sesuatu yang lebih besar.",
    thought: "Bisa main musik bareng teman-teman yang satu frekuensi itu menyenangkan.",
    story: [
      "Aku hobi main musik sejak SMA.",
      "Sekarang aku sering mengiringi lagu-lagu dengan aransemen yang lebih modern dan segar.",
      "Latihan musik bareng tim selalu penuh tawa.",
      "Rasanya luar biasa bisa bikin suasana gereja jadi lebih ceria lewat lagu."
    ],
    services: [
      { year: "2024", name: "Musisi", community: "Tim Liturgi" },
    ],
    media: "portrait",
  },
  {
    slug: "katarina",
    name: "Katarina Hutasoit",
    initials: "KH",
    role: "Anggota",
    community: "Wanita Profesional Katolik",
    city: "Balikpapan",
    headline: "Berjejaring sambil bertumbuh.",
    thought: "Kami ngobrolin soal karir, keluarga, dan liburan dengan sama serunya.",
    story: [
      "Komunitas ini isinya perempuan-perempuan hebat yang sangat inspiratif.",
      "Kami rutin kumpul di lounge atau restoran yang cozy.",
      "Semuanya saling mendukung satu sama lain tanpa ada rasa gengsi.",
      "Ini tempat terbaik untuk berbagi cerita setelah seminggu bekerja keras."
    ],
    services: [
      { year: "2025", name: "Anggota", community: "Wanita Profesional" },
    ],
    media: "none",
  },
  {
    slug: "yustinus",
    name: "Yustinus Bagas",
    initials: "YB",
    role: "Volunteer",
    community: "Pemuda Peduli Lingkungan",
    city: "Solo",
    headline: "Jalan-jalan sambil berdampak positif.",
    thought: "Ternyata bersih-bersih tempat wisata bareng teman itu seru banget.",
    story: [
      "Kami suka bikin acara jalan-jalan santai sambil kampanye cinta lingkungan.",
      "Biasanya kami berkunjung ke galeri seni atau taman kota.",
      "Setelah bersih-bersih, kami pasti lanjut makan-makan enak.",
      "Cara yang sangat asyik untuk menghabiskan akhir pekan."
    ],
    services: [
      { year: "2024", name: "Volunteer", community: "Pemuda Peduli Lingkungan" },
    ],
    media: "community",
  },
  {
    slug: "angela",
    name: "Angela Meilani",
    initials: "AM",
    role: "Anggota",
    community: "Komunitas Pekerja Muda",
    city: "Batam",
    headline: "Menyempatkan diri untuk sejenak rileks.",
    thought: "Kami tahu kapan harus kerja keras, dan kapan harus istirahat sambil tertawa.",
    verse: "Galatia 6:2",
    story: [
      "Kerja di kota industri bikin jadwal harian sangat padat.",
      "Makanya, pertemuan komunitas selalu aku jadikan momen untuk bernapas dan rileks.",
      "Kami saling menceritakan kejadian lucu di kantor masing-masing.",
      "Tawa mereka selalu sukses menghilangkan capekku."
    ],
    services: [
      { year: "2025", name: "Anggota", community: "Pekerja Muda Batam" },
    ],
    media: "portrait",
  },
];

export const ILLUSTRATIVE = voices.map((voice) => voice.slug);
export default voices;
