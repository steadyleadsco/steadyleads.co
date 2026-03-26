import React, { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    spa: "",
    email: "",
    city: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const captchaToken = (window as any).hcaptcha?.getResponse?.();

      const response = await fetch("https://steadyleads.co/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: "",
          spa_name: formData.spa,
          city: formData.city,
          message: formData.message,
          captchaToken,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", spa: "", email: "", city: "", message: "" });
        if (typeof window !== "undefined" && (window as any).hcaptcha?.reset) {
          (window as any).hcaptcha.reset();
        }
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        setError(result.error || "Failed to submit form");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <head>
        <script src="https://js.hcaptcha.com/1/api.js" async></script>
      </head>

      <div>
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <a className="text-2xl font-bold text-navy" href="/">
              Steady Leads
            </a>
            <div className="space-x-6">
              <a className="text-slate-600 hover:text-navy" href="/">
                Home
              </a>
              <a className="text-slate-600 hover:text-navy" href="#contact">
                Contact
              </a>
              <a className="btn-primary" href="/dashboard/login">
                Dashboard
              </a>
            </div>
          </div>
        </nav>

        <section className="py-20 text-center bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-navy mb-6 leading-tight">
              Your Med Spa Deserves a Full Appointment Book.
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              We deliver 20-50 qualified leads per month to med spas. No ad spend.
              No long-term contracts.
            </p>
            <a href="#contact" className="btn-primary px-8 py-3 inline-block">
              Get Your Free Lead Gen Audit
            </a>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-navy mb-4">
              You Are Great at Aesthetics. Marketing? Not So Much.
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">x</span>
                <span className="text-slate-700">Hundreds of people search for treatments every month but do not find you</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">x</span>
                <span className="text-slate-700">Your website looks good but does not convert visitors into consultations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">x</span>
                <span className="text-slate-700">You rely on word-of-mouth and Instagram, which is unpredictable</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">x</span>
                <span className="text-slate-700">Past agencies gave reports instead of results</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-navy mb-4">
              We Fill the Gap Between Great Med Spa and Fully Booked
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    We Audit Your Market
                  </h3>
                  <p className="text-slate-600">We analyze your city to identify demand and gaps.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    We Build Your Lead Engine
                  </h3>
                  <p className="text-slate-600">Custom landing pages and lead capture systems.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    You Get Leads
                  </h3>
                  <p className="text-slate-600">Real people requesting consultations. Delivered weekly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-navy text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">The Numbers Speak</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-green mb-2">42</div>
                <p className="text-slate-400 text-sm">consultation requests per month from one Nashville med spa</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green mb-2">33K</div>
                <p className="text-slate-400 text-sm">in new patient revenue from one Boise med spa in 90 days</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green mb-2">50+</div>
                <p className="text-slate-400 text-sm">leads per month from one Asheville med spa</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Try It Before You Pay For It
            </h2>
            <div className="bg-white border-2 border-green rounded-lg p-8 mb-8">
              <ul className="text-left space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green font-bold">✓</span>
                  <span className="text-slate-700">10+ qualified leads in 7 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green font-bold">✓</span>
                  <span className="text-slate-700">Completely free. No credit card. No contract.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green font-bold">✓</span>
                  <span className="text-slate-700">If leads convert, we discuss monthly service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green font-bold">✓</span>
                  <span className="text-slate-700">If not, we part as friends</span>
                </li>
              </ul>
            </div>
            <a href="#contact" className="btn-primary px-8 py-3 inline-block">
              Start Your Free Trial
            </a>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-navy mb-12 text-center">
              Simple Pricing. Real Results.
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-2 border-slate-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-navy mb-2">Starter</h3>
                <div className="text-4xl font-bold text-navy mb-1">
                  2000
                  <span className="text-base text-slate-500 font-normal">/month</span>
                </div>
                <ul className="space-y-3 my-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green">✓</span>
                    <span className="text-slate-700">20-30 leads per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green">✓</span>
                    <span className="text-slate-700">1 landing page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green">✓</span>
                    <span className="text-slate-700">Weekly reports</span>
                  </li>
                </ul>
                <a href="#contact" className="btn-primary w-full justify-center">Get Started</a>
              </div>

              <div className="border-2 border-green bg-slate-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-navy mb-2">Growth</h3>
                <div className="text-4xl font-bold text-navy mb-1">
                  2500
                  <span className="text-base text-slate-500 font-normal">/month</span>
                </div>
                <ul className="space-y-3 my-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green">✓</span>
                    <span className="text-slate-700">40-50+ leads per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green">✓</span>
                    <span className="text-slate-700">3 landing pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green">✓</span>
                    <span className="text-slate-700">Full SEO content engine</span>
                  </li>
                </ul>
                <a href="#contact" className="btn-primary w-full justify-center">Get Started</a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-navy text-white">
          <div className="max-w-md mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Let us Talk About Your Leads
            </h2>
            <p className="text-slate-400 text-center mb-8">
              Tell us about your med spa and we will show you how many leads you are missing.
            </p>

            {submitted && (
              <div className="bg-green text-white p-4 rounded-lg mb-6 text-center">
                Thanks for reaching out! We will be in touch within 24 hours.
              </div>
            )}

            {error && (
              <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center text-sm">
                {error}
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
                placeholder="City and State"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg text-slate-900"
              />
              <textarea
                name="message"
                rows={3}
                placeholder="Tell us more (optional)"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg text-slate-900"
              />

              <div className="h-captcha" suppressHydrationWarning data-sitekey="adda03a4-d1aa-4f7e-9cd0-f128e596d3c8"></div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-lg"
              >
                {loading ? "Sending..." : "Send My Info"}
              </button>
            </form>

            <p className="text-slate-400 text-center mt-6 text-sm">
              abel@steadyleads.co
            </p>
          </div>
        </section>

        <footer className="bg-navy text-white py-12 mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p>© 2026 Steady Leads. All rights reserved.</p>
            <p className="text-slate-400 mt-2">abel@steadyleads.co</p>
          </div>
        </footer>
      </div>
    </>
  );
}
