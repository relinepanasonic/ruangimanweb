/**
 * The little app screens that sit inside the phone on each feature card.
 *
 * They're authored at a comfortable 320 x 640 logical size and scaled down by
 * the phone frame, rather than being written directly at 6px. Two reasons:
 * the proportions are sane to reason about, and the browser rasterises
 * transformed text at the composited scale, so it stays crisp where a literal
 * `text-[6px]` would be mush.
 *
 * Each is a *suggestion* of the real screen, not a spec — bold shapes, one
 * gold accent, nothing that needs to be read at card size. If real app
 * screenshots turn up they can replace these via `/features/screens/<slug>.png`
 * (see PhoneMock), and these stay as the fallback.
 */

const GOLD = "#D6B072";

/** A stand-in for a line of text. */
function Line({ w = "100%", dim = false }: { w?: string; dim?: boolean }) {
  return (
    <span
      className="block h-[7px] rounded-full"
      style={{ width: w, background: dim ? "#2A2E35" : "#3C424B" }}
    />
  );
}

function Chip({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={
        gold
          ? { background: GOLD, color: "#0E1013" }
          : { background: "#20242B", color: "#9CA3AF" }
      }
    >
      {children}
    </span>
  );
}

function Avatar({ size = 30, gold }: { size?: number; gold?: boolean }) {
  return (
    <span
      className="block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: gold
          ? `linear-gradient(140deg, ${GOLD}, #8a6f42)`
          : "linear-gradient(140deg,#3A4049,#22262D)",
      }}
    />
  );
}

/** Card-shaped block used by most of the screens. */
function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-3 ${className}`}
      style={{ background: "#181C22", border: "1px solid #262B33" }}
    >
      {children}
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[15px] font-bold text-white">{title}</span>
      <span className="flex gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[3px] w-[3px] rounded-full"
            style={{ background: "#4A515B" }}
          />
        ))}
      </span>
    </div>
  );
}

const screens: Record<string, React.ReactNode> = {
  // Profile: avatar, name, the journey stats, favourite songs.
  profil: (
    <>
      <div className="flex flex-col items-center pt-2">
        <Avatar size={54} gold />
        <span className="mt-2 text-[15px] font-bold text-white">Nico J.</span>
        <span className="mt-1 text-[11px]" style={{ color: "#7A828D" }}>
          Jakarta · Sejak 2024
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["12", "34", "5"].map((n, i) => (
          <Panel key={i} className="!p-2 text-center">
            <span className="block text-[14px] font-bold" style={{ color: GOLD }}>
              {n}
            </span>
            <span className="mt-1 block h-[5px] rounded-full" style={{ background: "#2A2E35" }} />
          </Panel>
        ))}
      </div>
      <Panel className="mt-2">
        <div className="flex items-center gap-2">
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
            style={{ background: GOLD }}
          >
            <span
              style={{
                width: 0,
                height: 0,
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                borderLeft: "6px solid #0E1013",
                marginLeft: 2,
              }}
            />
          </span>
          <span className="flex-1 space-y-1.5">
            <Line w="70%" />
            <Line w="45%" dim />
          </span>
        </div>
      </Panel>
    </>
  ),

  // Share a thought: composer plus one reply.
  bagikan: (
    <>
      <Header title="Bagikan" />
      <Panel>
        <div className="flex gap-2">
          <Avatar size={24} gold />
          <span className="flex-1 space-y-1.5 pt-1">
            <Line w="90%" />
            <Line w="65%" />
          </span>
        </div>
        <div className="mt-3 flex justify-end">
          <Chip gold>Kirim</Chip>
        </div>
      </Panel>
      <Panel className="mt-2">
        <div className="flex gap-2">
          <Avatar size={22} />
          <span className="flex-1 space-y-1.5 pt-1">
            <Line w="80%" dim />
            <Line w="55%" dim />
          </span>
        </div>
      </Panel>
    </>
  ),

  // Bible: a passage with version chips.
  alkitab: (
    <>
      <div className="mb-2 flex gap-1.5">
        <Chip gold>TB</Chip>
        <Chip>NIV</Chip>
      </div>
      <span className="block text-[15px] font-bold text-white">Yohanes 15</span>
      <span className="mt-3 block space-y-[9px]">
        <Line w="100%" />
        <Line w="94%" />
        <Line w="98%" />
        <Line w="60%" />
      </span>
      <div
        className="mt-3 rounded-xl p-2.5"
        style={{ background: "rgba(214,176,114,0.12)", borderLeft: `3px solid ${GOLD}` }}
      >
        <span className="block space-y-[7px]">
          <Line w="92%" />
          <Line w="70%" />
        </span>
      </div>
    </>
  ),

  // Daily devotional.
  renungan: (
    <>
      <span className="text-[11px] font-semibold" style={{ color: GOLD }}>
        SENIN · 4 SEP
      </span>
      <span className="mt-2 block text-[16px] font-bold leading-tight text-white">
        Tinggallah
        <br />
        dalam Aku
      </span>
      <span className="mt-3 block space-y-[9px]">
        <Line w="100%" />
        <Line w="88%" />
        <Line w="95%" />
        <Line w="52%" />
      </span>
      <Panel className="mt-3">
        <span className="block space-y-[7px]">
          <Line w="85%" dim />
          <Line w="60%" dim />
        </span>
      </Panel>
    </>
  ),

  // Prayers.
  doa: (
    <>
      <Header title="Doa" />
      {["Rosario", "Novena", "Koronka"].map((name, i) => (
        <Panel key={name} className="mb-2 !py-2.5">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold"
              style={{
                background: i === 0 ? GOLD : "#20242B",
                color: i === 0 ? "#0E1013" : "#7A828D",
              }}
            >
              {i + 1}
            </span>
            <span className="flex-1">
              <span className="block text-[12px] font-semibold text-white">{name}</span>
              <span className="mt-1 block">
                <Line w="55%" dim />
              </span>
            </span>
          </div>
        </Panel>
      ))}
    </>
  ),

  // Find each other.
  temukan: (
    <>
      <Header title="Temukan" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Panel key={i} className="!p-2">
            <span className="flex flex-col items-center gap-1.5">
              <Avatar size={26} gold={i === 1} />
              <Line w="80%" dim />
            </span>
          </Panel>
        ))}
      </div>
      <Panel className="mt-2 !py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex-1 space-y-1.5">
            <Line w="60%" />
            <Line w="40%" dim />
          </span>
          <Chip gold>Sapa</Chip>
        </div>
      </Panel>
    </>
  ),

  // Chat thread.
  chat: (
    <>
      <div className="mb-3 flex items-center gap-2">
        <Avatar size={26} />
        <span className="flex-1 space-y-1.5">
          <Line w="55%" />
          <Line w="30%" dim />
        </span>
      </div>
      <div className="space-y-2">
        <div
          className="max-w-[72%] rounded-2xl rounded-tl-sm p-2.5"
          style={{ background: "#20242B" }}
        >
          <span className="block space-y-[6px]">
            <Line w="90%" dim />
            <Line w="60%" dim />
          </span>
        </div>
        <div
          className="ml-auto max-w-[72%] rounded-2xl rounded-tr-sm p-2.5"
          style={{ background: GOLD }}
        >
          <span className="block space-y-[6px]">
            <span className="block h-[7px] rounded-full" style={{ width: "85%", background: "rgba(14,16,19,0.55)" }} />
            <span className="block h-[7px] rounded-full" style={{ width: "50%", background: "rgba(14,16,19,0.35)" }} />
          </span>
        </div>
        <div
          className="max-w-[55%] rounded-2xl rounded-tl-sm p-2.5"
          style={{ background: "#20242B" }}
        >
          <Line w="70%" dim />
        </div>
      </div>
    </>
  ),

  // Community centre: an event with attendees.
  "pusat-komunitas": (
    <>
      <Header title="Acara" />
      <Panel>
        <div className="flex gap-2.5">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            style={{ background: GOLD, color: "#0E1013" }}
          >
            <span className="text-center leading-none">
              <span className="block text-[14px] font-extrabold">12</span>
              <span className="block text-[8px] font-bold">SEP</span>
            </span>
          </span>
          <span className="flex-1 space-y-1.5 pt-1">
            <Line w="85%" />
            <Line w="55%" dim />
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex -space-x-1.5">
            {[0, 1, 2].map((i) => (
              <Avatar key={i} size={20} gold={i === 0} />
            ))}
          </span>
          <Chip gold>Ikut</Chip>
        </div>
      </Panel>
      <Panel className="mt-2 !py-2.5">
        <span className="block space-y-1.5">
          <Line w="70%" dim />
          <Line w="45%" dim />
        </span>
      </Panel>
    </>
  ),

  // News list.
  kabar: (
    <>
      <Header title="Kabar" />
      {[0, 1, 2].map((i) => (
        <Panel key={i} className="mb-2 !p-2">
          <div className="flex gap-2.5">
            <span
              className="h-11 w-11 shrink-0 rounded-lg"
              style={{
                background:
                  i === 0
                    ? `linear-gradient(140deg, ${GOLD}, #6b552f)`
                    : "linear-gradient(140deg,#333941,#20242B)",
              }}
            />
            <span className="flex-1 space-y-1.5 pt-1">
              <Line w="95%" dim={i !== 0} />
              <Line w="62%" dim />
            </span>
          </div>
        </Panel>
      ))}
    </>
  ),

  // Mass times.
  "jadwal-misa": (
    <>
      <Header title="Jadwal Misa" />
      <Panel className="!py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex-1 space-y-1.5">
            <Line w="75%" />
            <Line w="45%" dim />
          </span>
          <Chip gold>Hari ini</Chip>
        </div>
      </Panel>
      <div className="mt-2 space-y-2">
        {["06:00", "08:30", "17:00"].map((time, i) => (
          <Panel key={time} className="!py-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className="text-[12px] font-bold tabular-nums"
                style={{ color: i === 1 ? GOLD : "#7A828D" }}
              >
                {time}
              </span>
              <span className="flex-1 space-y-1.5">
                <Line w="70%" dim />
              </span>
            </div>
          </Panel>
        ))}
      </div>
    </>
  ),
};

export default function FeatureScreen({ slug }: { slug: string }) {
  return (
    <div
      className="flex h-full w-full flex-col px-4 pb-4 pt-3"
      style={{ background: "#0E1013" }}
    >
      {/* Status bar */}
      <div className="mb-3 flex shrink-0 items-center justify-between px-1">
        <span className="text-[11px] font-semibold" style={{ color: "#6B7280" }}>
          9:41
        </span>
        <span
          className="h-[6px] w-[22px] rounded-sm"
          style={{ border: "1px solid #3C424B" }}
        />
      </div>
      <div className="min-h-0 flex-1">{screens[slug] ?? screens.profil}</div>
    </div>
  );
}
