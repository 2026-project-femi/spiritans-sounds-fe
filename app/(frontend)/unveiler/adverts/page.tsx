import { Megaphone, CheckCircle, Mail, Phone } from "lucide-react";

const packages = [
  {
    name: "Banner Ad",
    price: "₦15,000",
    period: "/ month",
    description: "A prominent banner displayed across the Treasures Unveiler section of the site.",
    features: [
      "Full-width banner placement",
      "Displayed on all Unveiler pages",
      "Link to your website or campaign",
      "Monthly performance report",
    ],
    highlighted: false,
  },
  {
    name: "Featured Sponsor",
    price: "₦45,000",
    period: "/ month",
    description: "Premium sponsorship with your brand featured in our newsletter, radio broadcasts, and website.",
    features: [
      "Everything in Banner Ad",
      "Mention in radio broadcasts",
      "Featured in monthly newsletter",
      "Logo on event materials",
      "Social media shoutout",
    ],
    highlighted: true,
  },
  {
    name: "Event Partner",
    price: "₦80,000",
    period: "/ event",
    description: "Partner with us for Treasures Unveiled and other major events — maximum visibility and impact.",
    features: [
      "Everything in Featured Sponsor",
      "Branded presence at events",
      "Speaking opportunity",
      "Young Creators Award co-branding",
      "Post-event media coverage",
    ],
    highlighted: false,
  },
];

const audiences = [
  { stat: "5,000+", label: "Monthly Website Visitors" },
  { stat: "2,000+", label: "Newsletter Subscribers" },
  { stat: "1,500+", label: "Radio Listeners" },
  { stat: "500+", label: "Young Creators Network Members" },
];

export default function AdvertsPage() {
  return (
    <main className="pb-24">
      {/* Header */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-brand-primary font-semibold border border-brand-primary/30 px-4 py-1.5 rounded-full mb-6">
          Advertising & Partnerships
        </span>
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Reach a{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-red-600">
            Faith-Filled
          </span>{" "}
          Audience
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Partner with Treasures Unveiler to connect your brand, ministry, or service with 
          a vibrant community of young creatives, families, and faith seekers.
        </p>
      </section>

      {/* Audience Stats */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {audiences.map(({ stat, label }) => (
            <div key={label} className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-red-600 mb-2">
                {stat}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Advertising Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.name}
              className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 ${
                pkg.highlighted
                  ? "bg-linear-to-br from-red-950/30 to-red-900/30 border-brand-primary/50 scale-105"
                  : "bg-white/5 border-white/10 hover:border-brand-primary/30"
              }`}>
              {pkg.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase font-bold text-white bg-linear-to-r from-brand-primary to-red-700 px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-black text-brand-primary">{pkg.price}</span>
                  <span className="text-gray-500 text-sm">{pkg.period}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{pkg.description}</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/contact"
                className={`block text-center py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                  pkg.highlighted
                    ? "bg-linear-to-r from-brand-primary to-red-700 text-white hover:opacity-90"
                    : "border border-brand-primary/40 text-brand-primary hover:bg-brand-primary/10"
                }`}>
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-3xl mx-auto px-6 text-center">
        <div className="p-10 rounded-2xl bg-white/5 border border-white/10">
          <Megaphone className="w-10 h-10 text-brand-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Custom Partnership?</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Have a unique idea for collaboration? We're open to bespoke partnerships that align with our mission 
            of forming and celebrating young creatives.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:info@spiritanssound.com"
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-brand-primary to-red-700 text-white font-semibold rounded-full hover:opacity-90 transition-all">
              <Mail className="w-4 h-4" /> Email Us
            </a>
            <a href="/contact"
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              <Phone className="w-4 h-4" /> Contact Page
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
