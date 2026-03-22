import Link from 'next/link';
import { PublicLayout } from '@/components/Layout';

export default function About() {
  return (
    <PublicLayout>
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-navy mb-4">
              How We Got Here
            </h1>
            <p className="text-xl text-slate-600">
              A story about med spas, leads, and accountability.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-navy mb-4">The Problem</h2>
            <p className="text-slate-700 mb-6">
              Med spa owners are good at what they do — they know aesthetics,
              they understand their clients, they deliver results. But marketing?
              Most have tried it and failed.
            </p>
            <p className="text-slate-700 mb-6">
              They've spent thousands with agencies that delivered reports
              instead of leads. They've tried running ads themselves and watched
              budgets evaporate. They've relied on word-of-mouth and Instagram,
              which works until it doesn't.
            </p>
            <p className="text-slate-700 mb-12">
              Meanwhile, their competitors are filling books. Real people are
              searching for "Botox in [their city]" and finding someone else.
              That's not a marketing problem. That's a systems problem.
            </p>

            <h2 className="text-3xl font-bold text-navy mb-4">Why Steady Leads</h2>
            <p className="text-slate-700 mb-6">
              We started because we got tired of watching med spa owners leave
              money on the table. We built a system that does one thing: gets
              real people who want your treatments to contact you.
            </p>
            <p className="text-slate-700 mb-6">
              No fluff. No Instagram management. No $5K/month reports that
              nobody reads.
            </p>
            <p className="text-slate-700 mb-12">
              Just leads. Real ones. Qualified. Exclusive. Trackable.
            </p>

            <h2 className="text-3xl font-bold text-navy mb-4">How It Works</h2>
            <p className="text-slate-700 mb-6">
              We build lead generation systems using proven channels:
            </p>
            <ul className="text-slate-700 space-y-3 mb-6">
              <li className="flex gap-3">
                <span className="text-green font-bold">•</span>
                <span>
                  <strong>Local search optimization:</strong> Getting your med
                  spa to show up when people in your area search for treatments
                  you offer.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green font-bold">•</span>
                <span>
                  <strong>SEO content:</strong> Articles, guides, and
                  optimization that rank and convert.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green font-bold">•</span>
                <span>
                  <strong>Landing pages:</strong> Custom-built pages for each
                  treatment that turn visitors into leads.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green font-bold">•</span>
                <span>
                  <strong>Lead capture:</strong> Phone forms, email signup, chat
                  — multiple ways people can reach you.
                </span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-navy mb-4">Our Guarantee</h2>
            <p className="text-slate-700 mb-6">
              We're confident enough to let leads do the talking. Try us for
              free for 7 days. If you don't like the leads, you don't pay us
              anything.
            </p>
            <p className="text-slate-700 mb-12">
              If you do like them, we talk about making it permanent.
            </p>

            <h2 className="text-3xl font-bold text-navy mb-4">What We Believe</h2>
            <div className="bg-slate-50 border-l-4 border-green p-6 rounded mb-12">
              <p className="text-slate-700 mb-3">
                <strong>Results over reports.</strong> We don't care about
                vanity metrics. We care about leads. Real people. Contacted and
                booked.
              </p>
              <p className="text-slate-700 mb-3">
                <strong>Accountability.</strong> If leads don't come, we don't
                get paid. That keeps us honest.
              </p>
              <p className="text-slate-700 mb-3">
                <strong>Simplicity.</strong> No jargon. No 50-page contracts.
                No BS.
              </p>
              <p className="text-slate-700">
                <strong>Your success is our success.</strong> We win when your
                book is full.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h3 className="text-lg font-bold text-navy mb-3">
              Questions? Let's Talk.
            </h3>
            <p className="text-slate-700 mb-4">
              Reach out to Abel directly at{' '}
              <strong>abel@steadyleads.co</strong> or use the form below to
              book a free strategy call.
            </p>
            <Link href="/#contact" className="btn-primary">
              Schedule a Call →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
