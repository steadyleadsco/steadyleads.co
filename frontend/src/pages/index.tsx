import React, { useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/Layout';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    spa: '',
    email: '',
    city: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, send to backend API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', spa: '', email: '', city: '', message: '' });
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-20 text-center bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-navy mb-6 leading-tight">
            Your Med Spa Deserves a Full Appointment Book.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            We deliver 20–50 qualified leads per month to med spas — people in
            your area actively searching for the treatments you offer. No ad
            spend. No long-term contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary px-8 py-3">
              Get Your Free Lead Gen Audit →
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Takes 2 minutes. We'll show you exactly how many potential patients
            you're missing.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-4">
            You're Great at Aesthetics. Marketing? Not So Much.
          </h2>
          <p className="text-slate-600 mb-8">
            And that's fine — you shouldn't have to be. But right now, people
            in your city are searching for exactly what you offer and finding
            your competitors instead.
          </p>
          <ul className="space-y-3">
            {[
              'Hundreds of people search for "[your city] Botox" every month — and you don\'t show up',
              'Your website looks good but doesn\'t convert visitors into booked consultations',
              'You\'re relying on word-of-mouth and Instagram, which is unpredictable',
              'You\'ve tried agencies before and got reports instead of results',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-4">
            We Fill the Gap Between "Great Med Spa" and "Fully Booked."
          </h2>
          <p className="text-slate-600 mb-12">
            Steady Leads builds lead generation systems specifically for med
            spas. We do one thing: <strong>get people who want your treatments to contact you.</strong>
          </p>
          <div className="space-y-8">
            {[
              {
                num: 1,
                title: 'We Audit Your Market',
                desc: 'We analyze your city — who\'s searching for what, where your competitors rank, and where the gaps are.',
              },
              {
                num: 2,
                title: 'We Build Your Lead Engine',
                desc: 'Custom landing pages, local search optimization, and lead capture systems designed to convert.',
              },
              {
                num: 3,
                title: 'You Get Leads',
                desc: 'Real people in your area requesting consultations. Delivered weekly. Tracked and reported.',
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">The Numbers Speak.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: '42',
                desc: 'consultation requests/month — Nashville med spa, up from 8 in 60 days',
              },
              {
                stat: '$33K',
                desc: 'in new patient revenue — Boise med spa, first 90 days',
              },
              {
                stat: '50+',
                desc: 'leads/month — Asheville med spa, revenue nearly doubled',
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-green mb-2">
                  {item.stat}
                </div>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Try It Before You Pay For It.
          </h2>
          <p className="text-slate-600 mb-8">
            We're confident enough to let the leads do the talking.
          </p>
          <div className="bg-white border-2 border-green rounded-lg p-8 mb-8">
            <ul className="text-left space-y-4">
              {[
                'We'll generate <strong>10+ qualified leads</strong> for your med spa in 7 days',
                'Completely free. No credit card. No contract.',
                'If those leads turn into consultations, we talk about doing this every month.',
                'If they don\'t, we part as friends.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green font-bold text-lg">✓</span>
                  <span
                    className="text-slate-700"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <a href="#contact" className="btn-primary px-8 py-3">
            Start Your Free Trial →
          </a>
          <p className="text-sm text-slate-500 mt-4">
            Limited to 5 new med spa partners per month.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">
            Simple Pricing. Real Results.
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Starter',
                price: '$2,000',
                period: '/month',
                features: [
                  '20–30 qualified leads/month',
                  '1 treatment landing page',
                  'Weekly lead reports',
                  'Lead capture system',
                  'Setup fee: $1,500',
                ],
              },
              {
                title: 'Growth',
                price: '$2,500',
                period: '/month',
                featured: true,
                features: [
                  '40–50+ qualified leads/month',
                  '3 treatment landing pages',
                  'Weekly lead reports',
                  'Full SEO content engine',
                  'Setup fee: $2,500',
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`border-2 rounded-lg p-8 ${
                  plan.featured
                    ? 'border-green bg-slate-50'
                    : 'border-slate-200'
                }`}
              >
                <h3 className="text-2xl font-bold text-navy mb-2">
                  {plan.title}
                </h3>
                <div className="text-4xl font-bold text-navy mb-1">
                  {plan.price}
                  <span className="text-base text-slate-500 font-normal">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 my-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-green font-bold">✓</span>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="btn-primary w-full justify-center">
                  Get Started →
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 text-sm mt-8">
            <strong>No long-term contracts.</strong> 90-day initial period,
            then month-to-month.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12">
            Questions & Answers
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How quickly will I see leads?',
                a: 'Most med spas see their first leads within 7–14 days of launch. Volume builds over 30–60 days as our systems optimize.',
              },
              {
                q: 'Do I need to spend money on ads?',
                a: 'No. Our system generates leads through organic search and optimized web presence. No ad spend required.',
              },
              {
                q: 'What kind of leads will I get?',
                a: 'Real people in your area searching for treatments you offer. They fill out a form, call, or request a consultation. These are exclusive to your practice — not shared leads.',
              },
              {
                q: 'How is this different from my last marketing agency?',
                a: 'We don\'t charge you $5,000/month to manage your Instagram. We generate leads. Period. If leads don\'t come, you don\'t stay. That keeps us accountable.',
              },
              {
                q: 'What\'s the catch with the free trial?',
                a: 'No catch. We deliver 10+ leads in 7 days. If they\'re good, you sign up. If they\'re not, you walk away.',
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

      {/* Contact */}
      <section id="contact" className="py-20 bg-navy text-white">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Your Competitors Are Getting These Patients. You Should Be.
          </h2>
          <p className="text-slate-400 text-center mb-8">
            Tell us about your med spa and we'll show you exactly how many leads
            you're leaving on the table.
          </p>

          {submitted && (
            <div className="bg-green text-white p-4 rounded-lg mb-6 text-center">
              Thanks! We'll be in touch soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg text-slate-900"
            />
            <input
              type="text"
              name="spa"
              placeholder="Med spa name"
              value={formData.spa}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg text-slate-900"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg text-slate-900"
            />
            <input
              type="text"
              name="city"
              placeholder="City & State"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg text-slate-900"
            />
            <textarea
              name="message"
              rows={3}
              placeholder="Anything else you want us to know?"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg text-slate-900"
            />
            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 text-lg"
            >
              Get Your Free Audit →
            </button>
          </form>

          <p className="text-slate-400 text-center mt-6 text-sm">
            abel@steadyleads.co
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
