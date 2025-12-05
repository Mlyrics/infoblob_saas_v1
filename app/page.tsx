import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);

  // 🔹 Logged-in users go straight to their dashboard
  if (user) {
    return redirect('/dashboard'); // ⬅️ changed from '/account' to '/dashboard'
  }

  const primaryCtaHref = '/signin';
  const secondaryCtaHref = '#pricing';

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">
        {/* HERO */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-300 mb-4">
              AI-powered tech & finance roundups
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Turn news feeds into{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                daily content
              </span>{' '}
              for your audience.
            </h1>

            <p className="mt-5 text-lg text-zinc-300 max-w-xl">
              InfoBlob ingests your favorite tech & finance sources, summarizes them with AI, and
              publishes to your blog or newsletter automatically.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={primaryCtaHref}
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black shadow hover:bg-zinc-100 transition"
              >
                Get started free
              </a>
              <a
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-zinc-900 transition"
              >
                View pricing
              </a>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              No code, no daily writing. Plug in feeds, choose topics, and let InfoBlob deliver.
            </p>
          </div>

          {/* Right-side highlight card */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase text-zinc-400 tracking-[0.2em] mb-3">
                SAMPLE DAILY ROUNDUP
              </p>
              <div className="space-y-4 text-sm text-zinc-100">
                <div className="border border-zinc-800 rounded-xl p-3 bg-zinc-950/60">
                  <p className="text-xs text-purple-300 mb-1">AI & Cloud · 3 min read</p>
                  <p className="font-semibold">
                    Nvidia expands AI lead as new chips hit hyperscalers
                  </p>
                  <p className="mt-1 text-zinc-400">
                    A concise, founder-friendly summary pulled from your curated feeds and written
                    in your preferred tone.
                  </p>
                </div>
                <div className="border border-zinc-800 rounded-xl p-3 bg-zinc-950/60">
                  <p className="text-xs text-emerald-300 mb-1">Crypto & Markets · 2 min read</p>
                  <p className="font-semibold">
                    Bitcoin consolidates while ETF flows cool off
                  </p>
                  <p className="mt-1 text-zinc-400">
                    InfoBlob assembles a daily digest from multiple sources and prepares it for
                    Ghost, WordPress, or your CMS.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                Generated from live RSS feeds · Summarized with AI · Ready to publish automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Stack / social proof */}
        <section className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase text-center">
            BUILT ON A MODERN STACK
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-500 text-xs">
            <span>Next.js</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>Vercel</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>Supabase</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>Stripe</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>Make.com automations</span>
          </div>
        </section>

        {/* Feature grid */}
        <section className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Everything you need to automate content.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <h3 className="text-lg font-semibold mb-2">RSS in, drafts out</h3>
              <p className="text-sm text-zinc-400">
                Connect your own feeds or pick from our curated tech & finance list. New articles
                are pulled in throughout the day.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <h3 className="text-lg font-semibold mb-2">AI summaries in your voice</h3>
              <p className="text-sm text-zinc-400">
                Summaries are generated with AI and tuned to your audience: founders, engineers,
                traders, or general readers.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <h3 className="text-lg font-semibold mb-2">Auto-publish to your stack</h3>
              <p className="text-sm text-zinc-400">
                Send content directly to Ghost, WordPress, or your own API. Choose full autopilot or
                approve drafts first.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            How InfoBlob works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-xs font-semibold text-zinc-500 mb-1">Step 1</p>
              <h3 className="text-lg font-semibold mb-2">Connect feeds</h3>
              <p className="text-sm text-zinc-400">
                Add RSS URLs or use presets. InfoBlob starts ingesting new stories right away.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-xs font-semibold text-zinc-500 mb-1">Step 2</p>
              <h3 className="text-lg font-semibold mb-2">Choose topics & tone</h3>
              <p className="text-sm text-zinc-400">
                Tell us what you care about (AI, cloud, crypto, macro…) and how you want to sound.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-xs font-semibold text-zinc-500 mb-1">Step 3</p>
              <h3 className="text-lg font-semibold mb-2">Publish on autopilot</h3>
              <p className="text-sm text-zinc-400">
                InfoBlob assembles a daily or weekly roundup and posts it automatically to your
                destinations.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing – reusing your existing dynamic component */}
        <section id="pricing" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold">Pricing that grows with you</h2>
            <p className="text-sm text-zinc-400">
              Start with Basic, move to Pro when you&apos;re ready, or run client sites on Agency.
            </p>
          </div>

          <Pricing
            user={user}
            products={products ?? []}
            subscription={subscription}
          />
        </section>

        {/* FAQ + final CTA */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Questions, answered.</h2>
            <div className="space-y-3 text-sm text-zinc-300">
              <div>
                <p className="font-semibold text-white">
                  Do I need to write prompts or code?
                </p>
                <p className="text-zinc-400">
                  No. InfoBlob ships with sensible defaults. You configure feeds, topics, and
                  destinations from the dashboard.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">
                  Can I review content before it goes live?
                </p>
                <p className="text-zinc-400">
                  Yes. Keep everything as drafts at first, then switch to autopilot once you&apos;re
                  comfortable.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">
                  What if I want to cancel or change plans?
                </p>
                <p className="text-zinc-400">
                  You can upgrade, downgrade, or cancel anytime via the Stripe-powered billing
                  portal in your account.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <h3 className="text-lg font-semibold mb-3">
              Ready to stop writing daily recaps?
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Create an account, connect a couple of feeds, and let InfoBlob draft your first AI
              roundup today.
            </p>
            <a
              href={primaryCtaHref}
              className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 transition"
            >
              Start your first feed
            </a>
            <p className="mt-3 text-xs text-zinc-500">
              You can switch plans or cancel anytime in your account portal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
