import Link from "next/link";
import { Star, Users, Award, Heart } from "lucide-react";

const pillars = [
  { icon: Star, title: "Treasures Unveiled", desc: "Annual celebration honouring benefactors and recognising young talents with the Young Creators Award." },
  { icon: Users, title: "Young Creators Network", desc: "A mentorship community where award recipients are accompanied and formed as creative missionaries." },
  { icon: Award, title: "Treasures Unveiler Magazine", desc: "Print and online magazine shining a light on youth talents, Spiritans Sound Outreach, and missionary news." },
  { icon: Heart, title: "Spiritans Sound Outreach", desc: "The sheltering tree — a youth ministry of the Holy Ghost Fathers and Brothers, Nigeria South-West Province." },
];

export default function AboutPage() {
  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0c0c0e] via-[#1a0a0a] to-[#0c0c0e] z-0" />
        <div className="absolute inset-0 opacity-10 z-0"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #ee0303 0%, transparent 60%), radial-gradient(circle at 70% 30%, #991b1b 0%, transparent 60%)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-brand-primary font-semibold border border-brand-primary/30 px-4 py-1.5 rounded-full">
            Treasures Unveiler Youth Development Foundation
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Bring Out What Is<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-red-600">
              New and Old
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            A response of faith to the Gospel call — recognising the gifts God has planted in young hearts,
            and helping those gifts grow and bear fruit for the Church and society.
          </p>
          <p className="text-sm text-gray-500 italic">cf. Mt 13:52</p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/unveiler" className="px-8 py-3 bg-linear-to-r from-brand-primary to-red-700 text-white font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105">
              See Our Events
            </Link>
            <Link href="/donations" className="px-8 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
              Support the Mission
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-primary font-semibold">Our Story</span>
            <h2 className="text-4xl font-bold text-white leading-tight">
              A Living Branch of the Spiritans Sound Outreach
            </h2>
            <p className="text-gray-400 leading-relaxed">
              TUYDF is an initiative of <strong className="text-white">Rev. Fr. Oluwafemi Victor Orilua, CSSp</strong>,
              founder of Spiritans Sound Outreach — a youth ministry of the Holy Ghost Fathers and Brothers,
              Nigeria South-West Province, committed to proclaiming Christ through music, art, and writing.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Born from prayer and mission, the Foundation seeks to recognise the gifts God has planted in young people
              and to help those gifts grow and bear fruit. While Spiritans Sound Outreach remains the sheltering tree,
              Treasures Unveiler Youth Development Foundation stands as a living branch — dedicated to forming,
              mentoring, and sending forth young creatives.
            </p>
            <blockquote className="border-l-2 border-brand-primary pl-4 italic text-gray-400 text-sm">
              "Each has received a gift to be used to serve others." — 1 Pt 4:10
            </blockquote>
          </div>
          <div className="space-y-4">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-brand-primary to-red-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
