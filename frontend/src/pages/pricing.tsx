import Link from 'next/link';
import { PublicLayout } from '@/components/Layout';

export default function Pricing() {
  return (
    <PublicLayout>
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-navy mb-4">
              Simple Pricing. Real Results.
            </h1>
            <p className="text-xl text-slate-600">
              No surprises. No hidden fees. Just leads.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: 'Starter',
                price: '$2,000',
                period: '/month',
                setupFee: '$1,500',
                description: 'Perfect for new med spas or testing the waters',
                features: [
                  '20–30 qualified leads/month',
                  '1 treatment landing page',
                  'Weekly lead reports',
                  'Email lead capture system',
                  'Basic SEO optimization',
                  'Lead source tracking',
                  'Monthly check-in calls',
                ],
              },
              {
                title: 'Growth',
                price: '$2,500',
                period: '/month',
                setupFee: '$2,500',
                description: 'For established spas ready to scale',
                featured: true,
                features: [
                  '40–50+ qualified leads/month',
                  '3 treatment landing pages',
                  'Weekly lead reports + analytics',
                  'Phone + email + form lead capture',
                  'Full SEO content engine',
                  'Advanced lead filtering',
                  'Bi-weekly strategic calls',
                  'Competitor analysis reports',
                ],
              },
            ].map((plan) => (
              <div
                key={plan.title}
                className={`border-2 rounded-lg p-8 ${
                  plan.featured
                    ? 'border-green ring-2 ring-green ring-offset-4 lg:scale-105'
                    : 'border-slate-200'
                }`}
              >
                {plan.featured && (
                  <div className="inline-block bg-green text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-navy mb-2">
                  {plan.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6">{plan.description}</p>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-navy">
                    {plan.price}
                    <span className="text-base text-slate-500 font-normal">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Setup fee: <strong>{plan.setupFee}</strong>
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green font-bold text-lg">✓</span>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className="btn-primary w-full justify-center"
                >
                  Get Started →
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-lg p-8 mb-12">
            <h3 className="text-lg font-bold text-navy mb-4">
              What's Included in Every Plan
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Lead source tracking and reporting',
                'No long-term contracts (90-day initial, then month-to-month)',
                'Real qualified leads (not shared)',
                'Dedicated support via email',
                'Free monthly strategy sessions',
                'Exclusive to your market',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green font-bold">✓</span>
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h3 className="font-bold text-navy mb-2">Custom Enterprise Plans</h3>
            <p className="text-slate-700">
              Running multiple locations or need something custom? We work with
              multi-unit med spa groups. <strong>Email abel@steadyleads.co</strong> to discuss your specific needs.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12">Pricing FAQ</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Why does the Growth plan cost more?',
                a: 'More leads means more work — more landing pages to build, more content to create, more campaigns to manage. The pricing reflects the real cost and the higher volume you\'ll get.',
              },
              {
                q: 'Do I pay if I don\'t get leads?',
                a: 'Not in the free trial. After that, you\'re paying for a system we\'ll build and manage. If leads stop, we fix it. That\'s our responsibility, not yours.',
              },
              {
                q: 'Can I change plans later?',
                a: 'Yes. If you start with Starter and want to upgrade to Growth, we\'ll add it to your next billing cycle. Same if you need to scale down.',
              },
              {
                q: 'What\'s included in the setup fee?',
                a: 'Market research, landing page design & development, lead capture system setup, initial SEO optimization, and launch configuration. It\'s a one-time cost.',
              },
              {
                q: 'Is there a contract?',
                a: 'No. You get a 90-day initial commitment, then it\'s month-to-month. Cancel anytime after that.',
              },
              {
                q: 'What if I\'m not happy after 90 days?',
                a: 'If leads aren\'t meeting expectations, we\'ll work with you to optimize. If it\'s still not right, you can leave at the end of your 90-day period.',
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-navy mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Stop Leaving Money on the Table?</h2>
        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
          Start your free trial today. We'll deliver 10+ qualified leads in 7 days.
        </p>
        <Link href="/#contact" className="btn-primary px-8 py-3">
          Get Your Free Audit →
        </Link>
      </section>
    </PublicLayout>
  );
}
