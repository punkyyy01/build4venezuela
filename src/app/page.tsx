const impactStats = [
  { value: "188+", label: "lives reported lost" },
  { value: "1,500+", label: "people injured" },
  { value: "346+", label: "structures damaged" },
  { value: "72h", label: "to build and ship" },
];

const priorities = [
  "Search-and-rescue coordination",
  "Medical care routing and triage",
  "Emergency shelter and supplies",
  "Missing-persons and family updates",
  "Verified local information flows",
  "Donation, volunteer, and aid logistics",
];

const schedule = [
  {
    day: "Friday, June 26",
    time: "00:00 UTC-5",
    title: "Kickoff",
    text: "Teams form, needs are mapped, and builders choose a concrete emergency problem.",
  },
  {
    day: "Saturday, June 27",
    time: "All day",
    title: "Build sprint",
    text: "Prototype, validate with Venezuelans, and keep the scope focused on usefulness.",
  },
  {
    day: "Sunday, June 28",
    time: "23:59 UTC-5",
    title: "Ship deadline",
    text: "Submit working tools, public repos, demos, handoff notes, and deployment links.",
  },
];

const asciiNorth = `
      ##***..
   #%%%%##*###++***##*-
%%%@%%%##**++++++****###*----
%%##*++==--++#%%%%%%%###+::.
+==----::::::##%%%%%%%#+....
...::::.      +###%%%#*+     ..::
`;

const asciiSouth = `
      --+++++***%%%%%%###*=-
  +++###%%%%%%@@%%%%###***++=-
--==+***#####%%%%%%%#**+=--::.
     .:--==++***###+=:.        
           .::----:.            
`;

function PixelStar({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 100 100"
    >
      <path d="M50 5 61 36h33L67 55l10 33-27-20-27 20 10-33L6 36h33L50 5Z" />
    </svg>
  );
}

function HudCorner({ position }: { position: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden font-mono text-2xl text-white/10 sm:block ${position}`}
    >
      <span className="block leading-none">- v -</span>
      <span className="mx-auto mt-1 block h-5 w-px bg-white/10" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative isolate flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_18%,rgba(0,199,232,0.14),transparent_32%),radial-gradient(circle_at_22%_78%,rgba(255,225,43,0.1),transparent_28%),radial-gradient(circle_at_82%_76%,rgba(255,47,95,0.1),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
        <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-white/8 to-transparent" />

        <HudCorner position="left-8 top-8" />
        <HudCorner position="right-8 top-8" />
        <HudCorner position="bottom-8 left-8" />
        <HudCorner position="bottom-8 right-8" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 border-white/10 border-b pb-5 font-mono text-xs uppercase tracking-[0.28em] text-white/65">
          <a href="#top" className="text-white">
            Build4Venezuela
          </a>
          <nav aria-label="Primary navigation" className="hidden gap-6 md:flex">
            <a className="transition hover:text-white" href="#brief">
              Brief
            </a>
            <a className="transition hover:text-white" href="#schedule">
              Schedule
            </a>
            <a className="transition hover:text-white" href="#build">
              Build
            </a>
          </nav>
          <a
            className="rounded-full border border-white/20 px-4 py-2 text-[0.65rem] text-white transition hover:border-[#00c7e8] hover:text-[#00c7e8]"
            href="https://www.instagram.com/p/DaBPry2SITz/"
            rel="noreferrer"
            target="_blank"
          >
            Updates
          </a>
        </header>

        <div
          id="top"
          className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center py-16 sm:py-20 lg:py-24"
        >
          <div className="mx-auto flex items-center gap-4 pb-8">
            <PixelStar className="h-10 w-10 text-[#ffe12b] sm:h-12 sm:w-12" />
            <PixelStar className="h-10 w-10 text-[#00c7e8] sm:h-12 sm:w-12" />
            <PixelStar className="h-10 w-10 text-[#ff2f5f] sm:h-12 sm:w-12" />
          </div>

          <div className="text-center">
            <p className="font-mono text-xl uppercase tracking-[0.34em] text-white/80 sm:text-3xl md:text-5xl">
              Build for
            </p>
            <h1 className="mt-4 font-mono text-5xl font-black uppercase leading-[0.86] tracking-[-0.08em] text-white [text-shadow:8px_0_0_rgba(255,255,255,0.08)] sm:text-7xl md:text-8xl lg:text-[9rem]">
              Venezuela
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-balance text-lg leading-8 text-white/72 sm:text-xl">
              A global 72-hour hackathon for builders, designers, doctors,
              organizers, and operators to ship tools people need after the June
              24 earthquakes.
            </p>
          </div>

          <div className="relative mx-auto mt-14 grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
            <pre className="hidden overflow-hidden text-right font-mono text-[0.45rem] leading-[0.65rem] text-white/85 sm:block md:text-[0.58rem] md:leading-[0.78rem]">
              {asciiNorth}
            </pre>

            <div className="relative mx-auto flex h-56 w-64 items-center justify-center sm:h-72 sm:w-80">
              <span className="absolute top-0 left-0 h-5 w-5 border-[#ffe12b] border-t border-l" />
              <span className="absolute top-0 right-0 h-5 w-5 border-[#ffe12b] border-t border-r" />
              <span className="absolute bottom-0 left-0 h-5 w-5 border-[#00c7e8] border-b border-l" />
              <span className="absolute right-0 bottom-0 h-5 w-5 border-[#ff2f5f] border-r border-b" />
              <svg
                aria-label="White silhouette inspired by the map of Venezuela"
                className="h-36 w-48 drop-shadow-[0_0_32px_rgba(255,255,255,0.18)] sm:h-44 sm:w-60"
                fill="currentColor"
                role="img"
                viewBox="0 0 240 170"
              >
                <title>White silhouette inspired by the map of Venezuela</title>
                <path d="M39 54 56 42l15 5 8-18 17 15 22-3 16 9 23-6 15 12 28 3 8 14-9 14 13 15-19 8-12 22-28 3-17 17-26-5-23 13-20-12-26 4-8-18-20-10 10-20-9-17 17-10-2-23Z" />
              </svg>
            </div>

            <pre className="hidden overflow-hidden font-mono text-[0.45rem] leading-[0.65rem] text-white/85 sm:block md:text-[0.58rem] md:leading-[0.78rem]">
              {asciiSouth}
            </pre>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              className="group inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#ffe12b] sm:w-auto"
              href="#build"
            >
              Join the build
              <span className="ml-3 transition group-hover:translate-x-1">
                -&gt;
              </span>
            </a>
            <a
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#ff2f5f] hover:text-[#ff2f5f] sm:w-auto"
              href="#brief"
            >
              Read the brief
            </a>
          </div>
        </div>
      </section>

      <section
        id="brief"
        className="border-white/10 border-y bg-white text-black"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-24">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-black/55">
              Situation brief
            </p>
            <h2 className="mt-4 max-w-xl text-balance text-4xl font-black uppercase leading-none tracking-[-0.05em] sm:text-6xl">
              Build something people need.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-black/70">
              Venezuela is facing a growing humanitarian emergency after two
              strong earthquakes on June 24. Reports may change as rescue teams
              reach more areas, but the immediate needs are clear: search,
              medical care, shelter, information, and coordination.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 sm:grid-cols-2">
            {impactStats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 sm:p-8">
                <div className="font-mono text-4xl font-black tracking-[-0.08em] sm:text-6xl">
                  {stat.value}
                </div>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-black/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.28em] text-[#00c7e8]">
                Emergency priorities
              </p>
              <h2 className="mt-4 text-balance text-4xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl">
                Useful beats impressive.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {priorities.map((priority, index) => (
                <div
                  className="border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#ffe12b]/60"
                  key={priority}
                >
                  <span className="font-mono text-xs text-white/35">
                    0{index + 1}
                  </span>
                  <p className="mt-4 text-lg font-semibold text-white">
                    {priority}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="schedule"
        className="bg-[#080808] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 border-white/10 border-b pb-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.28em] text-[#ff2f5f]">
                Timeline
              </p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl">
                72 hours. One premise.
              </h2>
            </div>
            <p className="max-w-md font-mono text-sm uppercase leading-6 tracking-[0.18em] text-white/60">
              Starts 00:00 UTC-5 on June 26. Ends 23:59 UTC-5 on June 28.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            {schedule.map((item) => (
              <article className="bg-[#080808] p-6 sm:p-8" key={item.title}>
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/45">
                  {item.day}
                </p>
                <time className="mt-2 block font-mono text-lg text-[#ffe12b]">
                  {item.time}
                </time>
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-white/65">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="build"
        className="relative overflow-hidden bg-white px-5 py-16 text-black sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="absolute top-8 right-8 hidden font-mono text-[8rem] font-black leading-none tracking-[-0.14em] text-black/[0.035] lg:block">
          404
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-black/55">
              The call
            </p>
            <h2 className="mt-4 max-w-4xl text-balance text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
              Let&apos;s help Venezuela together.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
              Bring your skills. Keep the scope humane. Talk to people close to
              the crisis. Build a working thing that can be used, deployed,
              translated, handed off, or extended when the weekend ends.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#ff2f5f]"
                href="mailto:hello@build4venezuela.org?subject=I%20want%20to%20build%20for%20Venezuela"
              >
                I want to build
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.18em] transition hover:border-black hover:bg-black hover:text-white"
                href="https://www.instagram.com/p/DaBPry2SITz/"
                rel="noreferrer"
                target="_blank"
              >
                Follow updates
              </a>
            </div>
          </div>

          <div className="border border-black bg-black p-4 text-white shadow-[-12px_12px_0_#ffe12b] sm:p-6">
            <div className="flex items-center gap-2 border-white/10 border-b pb-4">
              <span className="h-3 w-3 rounded-full bg-[#ff2f5f]" />
              <span className="h-3 w-3 rounded-full bg-[#ffe12b]" />
              <span className="h-3 w-3 rounded-full bg-[#00c7e8]" />
              <span className="ml-auto font-mono text-xs uppercase tracking-[0.18em] text-white/35">
                build.config
              </span>
            </div>
            <div className="space-y-4 pt-6 font-mono text-sm leading-7 text-white/70">
              <p>
                <span className="text-[#00c7e8]">premise</span>: "build
                something people need"
              </p>
              <p>
                <span className="text-[#ffe12b]">constraint</span>: "ship in 72
                hours"
              </p>
              <p>
                <span className="text-[#ff2f5f]">standard</span>: "useful,
                usable, handoff-ready"
              </p>
              <p>
                <span className="text-white">output</span>: "tools for rescue,
                care, shelter, truth, and aid"
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
