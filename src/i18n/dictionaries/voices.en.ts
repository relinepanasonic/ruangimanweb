
import type { Voice } from "./voices.id";

const voices: Voice[] = [
  {
    slug: "damar",
    name: "Damar Prasetyo",
    initials: "DP",
    role: "Active member",
    community: "Pria Sejati",
    city: "Jakarta",
    headline: "Coffee, friends, and weekend chats.",
    thought: "I thought community gatherings were boring. Turns out it's like hanging out with best friends.",
    verse: "Proverbs 27:17",
    story: [
      "Working in Jakarta means I rarely have free time. Even Sunday Mass is often rushed.",
      "One day I was invited for a casual coffee with friends after Mass. I was hesitant at first, but the conversation was fun and relatable.",
      "Nothing too heavy or preachy, we just exchanged daily life stories.",
      "Now, Sunday coffee is the moment I look forward to the most."
    ],
    services: [
      { year: "2024", name: "Member", community: "Pria Sejati Jakarta" },
      { year: "2025", name: "Event Committee", community: "Pria Sejati Jakarta" },
    ],
    media: "portrait",
  },
  {
    slug: "yohana",
    name: "Yohana Sitanggang",
    initials: "YS",
    role: "Prayer team",
    community: "OMK",
    city: "Medan",
    headline: "Having an incredible support system.",
    thought: "I just realized how calming it is to have friends who pray for each other.",
    verse: "Matthew 18:20",
    story: [
      "As a busy young person, sometimes I feel like I'm navigating my routine alone.",
      "Since joining OMK, I've found a highly positive and cheerful circle of friends.",
      "We hang out often, and at the end of the session, we always make time to pray for each other.",
      "It feels so relieving to have friends who always support and listen."
    ],
    services: [
      { year: "2024", name: "Member", community: "OMK Medan" },
      { year: "2025", name: "Prayer Team", community: "OMK Medan" },
    ],
    media: "none",
  },
  {
    slug: "bernardus",
    name: "Bernardus Ola",
    initials: "BO",
    role: "Photographer",
    community: "Catholic Creative Community",
    city: "Flores",
    headline: "Bringing hobbies into service.",
    thought: "The church never stops us from having fun with our talents.",
    story: [
      "I've always loved photography and traveling with friends.",
      "One day the Priest asked for my help to photograph a youth event in the parish.",
      "It turned out to be so much fun using my hobby for community activities.",
      "Now my friends and I have even created our own documentation team. Creating art while hanging out."
    ],
    services: [
      { year: "2024", name: "Photographer", community: "Parish Event" },
      { year: "2025", name: "Creative Team", community: "Diocese" },
    ],
    media: "community",
  },
  {
    slug: "clara",
    name: "Clara Wijaya",
    initials: "CW",
    role: "Member",
    community: "Young Legion of Mary",
    city: "Semarang",
    headline: "Starting with small, fun things.",
    thought: "Service doesn't always have to be heavy. Sometimes a smile and presence are enough.",
    story: [
      "I used to hesitate to join the community because I thought it would be too stiff.",
      "But after trying to come, it turned out the atmosphere was very fluid and modern.",
      "We often do social work and follow it up with a culinary trip together.",
      "Faith can actually be celebrated in a very cheerful and friendly way."
    ],
    services: [
      { year: "2024", name: "Member", community: "Legion of Mary" },
      { year: "2025", name: "Event Section", community: "Legion of Mary" },
    ],
    media: "none",
  },
  {
    slug: "yosef",
    name: "Yosef Rumbiak",
    initials: "YR",
    role: "Youth coordinator",
    community: "Kitorang Community",
    city: "Jayapura",
    headline: "Music, parks, and weekend stories.",
    thought: "We prefer gathering outdoors while playing the guitar.",
    verse: "1 Corinthians 12:12",
    story: [
      "Every Saturday afternoon, we often gather in the park or by the lake.",
      "Our events are very relaxed: playing guitar, singing together, and just chatting.",
      "From those casual chats, we often get to know and support each other better.",
      "For us, the church isn't just a building, but togetherness wherever we are."
    ],
    services: [
      { year: "2024", name: "Coordinator", community: "Kitorang Community" },
    ],
    media: "community",
  },
  {
    slug: "maria",
    name: "Maria Lengkong",
    initials: "ML",
    role: "Singer",
    community: "Youth Choir",
    city: "Manado",
    headline: "Singing while celebrating life.",
    thought: "Choir practice is the most fun escape from work fatigue.",
    story: [
      "Singing has been a part of my life since childhood.",
      "Joining the parish youth choir turned out to be super fun. We're not stiff.",
      "Every time after practice we definitely hang out or eat together.",
      "Service done with a joyful heart feels very light."
    ],
    services: [
      { year: "2023", name: "Singer", community: "Youth Choir" },
      { year: "2025", name: "Board Member", community: "Youth Choir" },
    ],
    media: "portrait",
  },
  {
    slug: "antonius",
    name: "Antonius Halim",
    initials: "AH",
    role: "Member",
    community: "Catholic Professionals Community",
    city: "Surabaya",
    headline: "Finding balance between work and faith.",
    thought: "Having supportive friends in the professional world is a blessing.",
    story: [
      "In a competitive working world, sometimes we need a space to relax.",
      "Through this young professional community, I found a safe place to share.",
      "We support each other, network, and still maintain good values.",
      "We often grab coffee together while discussing positive business ideas."
    ],
    services: [
      { year: "2024", name: "Member", community: "Young Professionals" },
    ],
    media: "none",
  },
  {
    slug: "fransiska",
    name: "Fransiska Dewi",
    initials: "FD",
    role: "Creative Director",
    community: "Parish Communications",
    city: "Yogyakarta",
    headline: "A church relevant to modern lifestyles.",
    thought: "Young people love creative things, and we can bring that to the church.",
    verse: "Hebrews 10:24-25",
    story: [
      "I always believed the church could look modern and aesthetic.",
      "Together with the communications team, we design the parish's social media content to be fresher.",
      "Wild and creative ideas are highly valued here.",
      "It's so much fun seeing other young people become more enthusiastic about participating."
    ],
    services: [
      { year: "2024", name: "Creative Team", community: "Communications" },
    ],
    media: "community",
  },
  {
    slug: "gregorius",
    name: "Gregorius Sanjaya",
    initials: "GS",
    role: "Event team",
    community: "Patriot",
    city: "Makassar",
    headline: "Meeting best friends in a new city.",
    thought: "One friendly greeting changed the way I see the weekend.",
    story: [
      "When I first moved to work in this city, I had absolutely no friends.",
      "One day after Mass, someone invited me to get acquainted and grab coffee.",
      "Now this group of church friends has become my most fun travel and dining buddies.",
      "There are no more lonely weekends in the new city."
    ],
    services: [
      { year: "2024", name: "Member", community: "Patriot Makassar" },
    ],
    media: "none",
  },
  {
    slug: "theresia",
    name: "Theresia Anggun",
    initials: "TA",
    role: "Event Organizer",
    community: "Youth Sharing Community",
    city: "Jakarta",
    headline: "Sharing can be done in a fun way.",
    thought: "We create charity events that feel like art festivals.",
    verse: "Matthew 25:40",
    story: [
      "Who said social activities are always boring?",
      "We often create charity events combined with art exhibitions or live music.",
      "The enthusiasm is incredible, many friends from outside the church also attend.",
      "Helping others is actually very fun when done together."
    ],
    services: [
      { year: "2025", name: "Head of Committee", community: "Charity Festival" },
    ],
    media: "portrait",
  },
  {
    slug: "ignasius",
    name: "Ignasius Tarigan",
    initials: "IT",
    role: "OMK Mentor",
    community: "OMK",
    city: "Berastagi",
    headline: "The endless energy of youth.",
    thought: "Just give them space, cool ideas will emerge on their own.",
    story: [
      "Young people today are critical and full of positive energy.",
      "I just mentor them occasionally, letting them execute their own event ideas.",
      "From esports tournaments to acoustic sessions, they bring everything to life.",
      "It feels proud to see them so enthusiastic."
    ],
    services: [
      { year: "2024", name: "Mentor", community: "OMK" },
    ],
    media: "community",
  },
  {
    slug: "veronika",
    name: "Veronika Sari",
    initials: "VS",
    role: "Host",
    community: "Youth Cell",
    city: "Bandung",
    headline: "Gathering at home, eating, and chatting.",
    thought: "We call it an end-of-month potluck rather than a meeting.",
    story: [
      "Every end of the month, I always offer my house as a gathering place for youth cell friends.",
      "We chip in to buy food, cook together, and watch movies.",
      "The prayers aren't long, but the togetherness is very memorable.",
      "This is the definition of a warm home full of laughter."
    ],
    services: [
      { year: "2024", name: "Member", community: "Youth Cell" },
    ],
    media: "portrait",
  },
  {
    slug: "markus",
    name: "Markus Doni",
    initials: "MD",
    role: "Initiator",
    community: "Modern Discussion Group",
    city: "Kupang",
    headline: "Casual but meaningful discussions.",
    thought: "We like to gather in cafes to discuss life topics.",
    story: [
      "We often hang out at our favorite cafe every Friday night.",
      "The topics discussed are free, from career, relationships, to faith.",
      "The atmosphere is always relaxed, full of jokes, and non-judgmental.",
      "This small group has become a place for us to grow together."
    ],
    services: [
      { year: "2024", name: "Facilitator", community: "Discussion Group" },
    ],
    media: "community",
  },
  {
    slug: "agnes",
    name: "Agnes Priscilla",
    initials: "AP",
    role: "Member",
    community: "Expat & Newcomer Community",
    city: "Denpasar",
    headline: "Finding a new family on the Island of the Gods.",
    thought: "We come from different cities, meet and just click.",
    verse: "Psalm 133:1",
    story: [
      "Working in Bali takes me far from my family in Flores.",
      "But here I found a very fun and dynamic community of newcomers.",
      "We often go on road trips together on weekends or just have brunch together after Mass.",
      "Bali never feels lonely with their presence."
    ],
    services: [
      { year: "2025", name: "Member", community: "Newcomer Community" },
    ],
    media: "none",
  },
  {
    slug: "petrus",
    name: "Petrus Kambu",
    initials: "PK",
    role: "Event Team",
    community: "Youth Community",
    city: "Merauke",
    headline: "Celebrating diversity in a fun way.",
    thought: "My friends come from various backgrounds, and that's what makes it fun.",
    story: [
      "We often organize cross-community events that are casual and modern.",
      "Usually in the form of a picnic or a small concert.",
      "From events like this, many new friends join in.",
      "Being amidst diversity makes us richer in color."
    ],
    services: [
      { year: "2025", name: "Committee", community: "Youth Event" },
    ],
    media: "community",
  },
  {
    slug: "lidwina",
    name: "Lidwina Cahya",
    initials: "LC",
    role: "Student",
    community: "KMK",
    city: "Malang",
    headline: "College days filled with positive things.",
    thought: "The campus community is my most fun escape when stressed with assignments.",
    story: [
      "Being a student is exhausting. But luckily I have super fun KMK friends.",
      "We often study together in the library or grab coffee near campus.",
      "There is no seniority, everyone mingles and jokes around with each other.",
      "My college days have become much more colorful thanks to them."
    ],
    services: [
      { year: "2025", name: "Member", community: "KMK Malang" },
    ],
    media: "none",
  },
  {
    slug: "stefanus",
    name: "Stefanus Rian",
    initials: "SR",
    role: "Musician",
    community: "Liturgical Music Team",
    city: "Pontianak",
    headline: "Playing music for something bigger.",
    thought: "Being able to play music with friends on the same frequency is delightful.",
    story: [
      "I've had a hobby of playing music since high school.",
      "Now I often accompany songs with more modern and fresh arrangements.",
      "Music practice with the team is always full of laughter.",
      "It feels amazing to make the church atmosphere more cheerful through songs."
    ],
    services: [
      { year: "2024", name: "Musician", community: "Liturgical Team" },
    ],
    media: "portrait",
  },
  {
    slug: "katarina",
    name: "Katarina Hutasoit",
    initials: "KH",
    role: "Member",
    community: "Catholic Professional Women",
    city: "Balikpapan",
    headline: "Networking while growing.",
    thought: "We talk about career, family, and vacations with equal excitement.",
    story: [
      "This community is filled with great women who are very inspiring.",
      "We routinely gather in cozy lounges or restaurants.",
      "Everyone supports each other without any sense of prestige.",
      "This is the best place to share stories after a week of hard work."
    ],
    services: [
      { year: "2025", name: "Member", community: "Professional Women" },
    ],
    media: "none",
  },
  {
    slug: "yustinus",
    name: "Yustinus Bagas",
    initials: "YB",
    role: "Volunteer",
    community: "Environmentally Conscious Youth",
    city: "Solo",
    headline: "Traveling while making a positive impact.",
    thought: "It turns out cleaning tourist spots with friends is really fun.",
    story: [
      "We like to organize casual outings while campaigning for environmental love.",
      "Usually we visit art galleries or city parks.",
      "After cleaning up, we definitely continue with eating good food.",
      "A very fun way to spend the weekend."
    ],
    services: [
      { year: "2024", name: "Volunteer", community: "Environmentally Conscious Youth" },
    ],
    media: "community",
  },
  {
    slug: "angela",
    name: "Angela Meilani",
    initials: "AM",
    role: "Member",
    community: "Young Workers Community",
    city: "Batam",
    headline: "Making time to relax for a moment.",
    thought: "We know when to work hard, and when to rest while laughing.",
    verse: "Galatians 6:2",
    story: [
      "Working in an industrial city makes the daily schedule very tight.",
      "Therefore, community meetings are always my moment to breathe and relax.",
      "We share funny incidents from our respective offices.",
      "Their laughter always successfully takes my exhaustion away."
    ],
    services: [
      { year: "2025", name: "Member", community: "Young Workers Batam" },
    ],
    media: "portrait",
  },
];

export default voices;
