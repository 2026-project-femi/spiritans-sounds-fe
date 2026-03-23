"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Who founded Spiritans Sound Outreach?",
    a: "Spiritans Sound Outreach was founded by Rev. Fr. Oluwafemi Victor Orilua, CSSp.",
  },
  {
    q: "When was Spiritans Sound Outreach established?",
    a: "It was established on 1st December 2018.",
  },
  {
    q: "What is Spiritans Sound Outreach?",
    a: "Spiritans Sound Outreach is a youth ministry of the Holy Ghost Fathers (Spiritans), dedicated to using the arts, media, and creative expression as instruments of evangelization.",
  },
  {
    q: "What is the mission of Spiritans Sound Outreach?",
    a: "Our mission is to discover, nurture, and promote God-given talents in young people, using those gifts for the purpose of evangelization and the spread of the Gospel.",
  },
  {
    q: "What is Treasures Unveiler Youth Development Foundation?",
    a: "Treasures Unveiler Youth Development Foundation is the registered non-profit arm of Spiritans Sound Outreach. It provides structure for our youth development programs, partnerships, and outreach initiatives.",
  },
  {
    q: "What is Treasures Unveiler Magazine?",
    a: "Treasures Unveiler Magazine is our flagship publication — a faith-based magazine that features youth stories, creative works, spiritual reflections, and news from the Outreach community.",
  },
  {
    q: "How can I contribute to the magazine?",
    a: "You can contribute articles, artwork, poetry, or testimonies by reaching out to us via our contact page or social media channels. We welcome submissions from young creatives.",
  },
  {
    q: "What is the Young Creators Network?",
    a: "The Young Creators Network is a community within Spiritans Sound Outreach that connects young artists, writers, musicians, and creatives who want to use their gifts for God's glory.",
  },
  {
    q: "How can one join the Young Creators Network?",
    a: "You can join by registering through our contact form or by reaching out on our social media platforms. Membership is open to young people who share our vision of faith-driven creativity.",
  },
  {
    q: "What is Treasures Unveiled (annual event)?",
    a: "Treasures Unveiled is our annual event that showcases the talents of young members of the Outreach — including performances, art exhibitions, spoken word, and more — as a celebration of God's gifts.",
  },
  {
    q: "How can I become a member of Spiritans Sound Outreach?",
    a: "Anyone who shares our faith and vision is welcome. You can become a member by attending our events, joining the Young Creators Network, or connecting with us through our website or social media.",
  },
  {
    q: "Are there regular spiritual activities?",
    a: "Yes! We hold a weekly Zoom prayer meeting every Friday at 9 PM. This is open to all members and supporters who wish to pray together and deepen their faith.",
  },
  {
    q: "Does the Outreach have performance groups?",
    a: "Yes. One of our notable performance groups is the Graceful Groovers, a dance group that uses movement and choreography as a form of worship and ministry.",
  },
  {
    q: "How can I stay updated or support the mission?",
    a: "You can follow us on our social media channels, subscribe to our newsletter, donate through our website, or purchase our publications. Every act of support helps us reach more young people with the Gospel.",
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="px-6 md:px-12 py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 border-b border-foreground/10 pb-8">
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-brand-primary block mb-3">
            Common Questions
          </span>
          <h2 className="text-4xl serif tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <dl>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-foreground/10">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-foreground text-base leading-snug">
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-brand-primary shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-96" : "max-h-0"}`}
              >
                <p className="pb-5 text-sm font-light text-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
