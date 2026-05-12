import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import {
  CalendarDays,
  MapPin,
  Phone,
  Flame,
  Sparkles,
  Building2,
  Smartphone,
} from "lucide-react";
import { MandalaDivider } from "@/components/MandalaDivider";
import { RazorpayDonate } from "@/components/RazorpayDonate";
import swamijiImg from "@/assets/swamiji.jpg";
import yagnaHero from "@/assets/yagna-hero.jpg";
import yamunaPushkaraluImg from "@/assets/yamuna-pushkaralu-2026.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title:
          "Sri Krishna Kalachakram Brahma Yagna — 90th Vishwa Shanti Mahotsavam",
      },
      {
        name: "description",
        content:
          "Donate to Sri Krishna Kalachakram Brahma Yagna by Sri Sri Sri Krishnajyothi Swarupanandha Swamiji — 108 Yagnas mission for world peace. 01–13 June 2026, Vrindavanam.",
      },
    ],
  }),
});

const rituals = [
  "Chaturveda Poorvaka",
  "Sri Maha Ganapati",
  "Sri Maha Rudra",
  "Sri Sahasrachandi",
  "Sri Subrahmanya",
  "Navagraha",
  "Ramayana",
  "Nakshatra",
  "Sri Sara",
  "Sri Maha Sudarsana with Sri Lakshmi Narayana",
];

const phonepeNumbers = [
  "9652440117",
  "9640688116",
  "8688991683",
  "9148523427",
];

function Index() {
  const completed = 90;
  const total = 108;
  const pct = (completed / total) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(180deg, color-mix(in oklab, var(--cream) 92%, transparent) 0%, color-mix(in oklab, var(--cream) 80%, transparent) 60%, var(--cream) 100%), url(${yagnaHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-saffron" />
            <span className="font-display text-deep-red font-semibold tracking-wider text-sm sm:text-base">
              Sri Krishna Jyothi Swarupanandha Trust
            </span>
          </div>
          <a
            href="#donate"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-deep-red hover:text-saffron transition"
          >
            Donate Now →
          </a>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep-red/10 text-deep-red text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> 90th Maha Yagna · 108 Mission
            </p>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight text-deep-red">
              Sri Krishna Kalachakram
              <span className="block text-gradient-gold mt-2">
                90th Vishwa Shanti Maha Yoga Mahotsavam
              </span>
            </h1>
            <p className="mt-5 text-lg text-foreground/80 font-body">
              Sri Sri Sri Krishnajyothi Swarupanandha Swamiji's divine mission
              of 108 Yagnas for world peace. <strong>90 completed.</strong>{" "}
              Help us reach 108.
            </p>

            <div className="mt-8 max-w-md">
              <div className="flex justify-between text-sm font-semibold text-deep-red mb-2">
                <span>Mission Progress</span>
                <span>
                  {completed} / {total} Yagnas
                </span>
              </div>
              <Progress
                value={pct}
                className="h-3 bg-cream border border-[var(--gold)]/40"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round(pct)}% complete · 18 Yagnas remaining
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-saffron hover:opacity-90 text-white font-display tracking-wide text-base px-8 shadow-divine"
              >
                <a href="#donate">Donate Now</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[var(--deep-red)] text-deep-red hover:bg-deep-red hover:text-white font-display tracking-wide"
              >
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </div>

          <div className="justify-self-center lg:justify-self-end">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full gradient-saffron blur-xl opacity-50" />
              <img
                src={swamijiImg}
                alt="Sri Sri Sri Krishnajyothi Swarupanandha Swamiji"
                width={320}
                height={420}
                className="relative w-72 sm:w-80 h-auto rounded-2xl object-cover border-4 border-[var(--gold)] shadow-divine"
              />
              <p className="mt-3 text-center font-display text-deep-red text-sm tracking-wide">
                Pujya Swamiji
              </p>
            </div>
          </div>
        </div>
      </header>

      <MandalaDivider />

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-deep-red">
            About the Brahma Yagna
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            A 13-day Maha Yagna held with traditional Vedic rituals, dedicated
            to universal peace, harmony and the well-being of all beings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-card border border-[var(--gold)]/40 p-6 flex gap-4">
            <CalendarDays className="w-8 h-8 text-saffron shrink-0" />
            <div>
              <h3 className="font-display text-lg text-deep-red">
                Event Dates
              </h3>
              <p className="text-foreground/80 mt-1">
                01 June 2026 — 13 June 2026
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-[var(--gold)]/40 p-6 flex gap-4">
            <MapPin className="w-8 h-8 text-saffron shrink-0" />
            <div>
              <h3 className="font-display text-lg text-deep-red">Venue</h3>
              <p className="text-foreground/80 mt-1">
                Vrindavanam, Mathura District, Uttar Pradesh — 281121
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl gradient-devotional border border-[var(--gold)]/40 p-6 sm:p-8">
          <h3 className="font-display text-xl text-deep-red mb-4 text-center">
            Sacred Rituals Performed
          </h3>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {rituals.map((r) => (
              <li
                key={r}
                className="flex items-start gap-2 text-foreground/85"
              >
                <Flame className="w-4 h-4 text-saffron mt-1 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MandalaDivider />

      {/* DONATE */}
      <section
        id="donate"
        className="max-w-4xl mx-auto px-6 py-12 scroll-mt-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-deep-red">
            Offer Your Sankalpa
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Every contribution, however small, becomes an oblation in this Maha
            Yagna for universal peace.
          </p>
        </div>
        <RazorpayDonate />
      </section>

      <MandalaDivider />

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <img
          src={yamunaPushkaraluImg}
          alt="Yamuna Pushkaralu 2026 devotional gathering"
          width={1264}
          height={848}
          className="w-full rounded-2xl border border-[var(--gold)]/50 shadow-divine"
          loading="lazy"
        />
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-deep-red">
            Contact & Bank Details
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-card border border-[var(--gold)]/40 p-6">
            <Phone className="w-8 h-8 text-saffron mb-3" />
            <h3 className="font-display text-lg text-deep-red">Call Us</h3>
            <p className="block mt-2 text-2xl font-bold text-saffron">
              63002 59174
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              For sankalpa registration & queries
            </p>
          </div>

          <div className="rounded-2xl bg-card border border-[var(--gold)]/40 p-6 lg:col-span-2">
            <Building2 className="w-8 h-8 text-saffron mb-3" />
            <h3 className="font-display text-lg text-deep-red">
              Trust Bank Details
            </h3>
            <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Account Name</dt>
              <dd className="font-semibold">
                Sri Krishna Jyothi Swarupanandha Trust
              </dd>
              <dt className="text-muted-foreground">Account No.</dt>
              <dd className="font-mono font-semibold">037011100004049</dd>
              <dt className="text-muted-foreground">IFSC</dt>
              <dd className="font-mono font-semibold">UBIN0803707</dd>
              <dt className="text-muted-foreground">Bank</dt>
              <dd className="font-semibold">Union Bank of India, A.P.</dd>
            </dl>
          </div>

          <div className="rounded-2xl gradient-devotional border border-[var(--gold)]/40 p-6 lg:col-span-3">
            <Smartphone className="w-8 h-8 text-saffron mb-3" />
            <h3 className="font-display text-lg text-deep-red">
              PhonePe Numbers
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {phonepeNumbers.map((n) => (
                <span
                  key={n}
                  className="px-4 py-2 rounded-full bg-card border border-[var(--gold)]/60 text-deep-red font-mono font-semibold"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MandalaDivider />

      {/* FOOTER */}
      <footer className="bg-deep-red text-cream mt-8">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="font-display text-xl sm:text-2xl text-gradient-gold">
            "Akhanda Hari Nama Sankirtana Andaru Aahvanistule…"
          </p>
          <p className="mt-4 text-sm opacity-80">
            © {new Date().getFullYear()} Sri Krishna Jyothi Swarupanandha
            Trust. All rights reserved.
          </p>
          <p className="mt-1 text-xs opacity-60">
            Sri Krishna Kalachakram — 90th Vishwa Shanti Maha Yoga Mahotsavam ·
            Vrindavanam
          </p>
        </div>
      </footer>
    </div>
  );
}
