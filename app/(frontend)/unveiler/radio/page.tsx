import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { Clock, Music, Mic } from "lucide-react";
import { RadioPlayer } from "./RadioPlayer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const defaultSchedule = [
  { time: "6:00 AM",  endTime: "6:30 AM",  program: "Morning Offering",                        host: "Prayer Team",                   type: "Prayer" },
  { time: "6:30 AM",  endTime: "7:00 AM",  program: "My Daily Journey with the Holy Spirit",   host: "Spiritans Sound Prayer Team",   type: "Prayer" },
  { time: "7:00 AM",  endTime: "7:30 AM",  program: "In His Presence",                         host: "Spiritans Sound Music",         type: "Music" },
  { time: "7:30 AM",  endTime: "9:00 AM",  program: "Daily Homily",                            host: "Guest Preachers",               type: "Homily" },
  { time: "9:00 AM",  endTime: "12:00 PM", program: "Prayers for Special Intentions",          host: "Prayer Team",                   type: "Prayer" },
  { time: "12:00 PM", endTime: "3:00 PM",  program: "Angelus and Midday Prayer",               host: "Community",                     type: "Prayer" },
  { time: "3:00 PM",  endTime: "6:00 PM",  program: "Divine Mercy Chaplet",                    host: "Community",                     type: "Prayer" },
  { time: "6:00 PM",  endTime: "7:00 PM",  program: "Angelus",                                 host: "Community",                     type: "Prayer" },
  { time: "7:00 PM",  endTime: "10:00 PM", program: "Talk / Interview Segment",                host: "Invited Contributors",          type: "Talk" },
  { time: "10:00 PM", endTime: "11:00 PM", program: "Night Prayer and Worship",                host: "Community",                     type: "Prayer" },
];

const typeColors: Record<string, string> = {
  Prayer: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Music: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
  Talk: "text-red-500 bg-red-500/10 border-red-500/20",
  Youth: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Homily: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Reflection: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default async function RadioPage() {
  let radioData;
  try {
    const payload = await getPayload({ config: configPromise });
    radioData = await payload.findGlobal({ slug: "radio" });
  } catch (error) {
    console.error("Failed to fetch radio data:", error);
  }

  const tagline = radioData?.tagline || "Voices of Faith, Hope, and Mission.";
  const streamUrl = radioData?.streamUrl;
  const schedule = (radioData?.schedule && radioData.schedule.length > 0) ? radioData.schedule : defaultSchedule;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return (
    <main className="pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-red-950/20 via-[#0c0c0e] to-[#0c0c0e] z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 lg:pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Player & Info */}
          <section className="lg:col-span-5 space-y-6 md:space-y-8 lg:sticky lg:top-24 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <span className="inline-block text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-brand-primary font-semibold border border-brand-primary/30 px-3 md:px-4 py-1.5 rounded-full">
                Spiritans Sound Internet Radio
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Listen. Pray. <br className="hidden lg:block"/><span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-red-600">Be Renewed.</span>
              </h1>
              <p className="text-gray-400 leading-relaxed font-medium text-sm md:text-base lg:text-lg italic mt-4 px-4 lg:px-0">
                &quot;{tagline}&quot;
              </p>
            </div>

            <RadioPlayer streamUrl={streamUrl} schedule={schedule} />
            
            
          </section>

          {/* Right Column: Schedule Grid */}
          <section className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="bg-[#121214]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 sm:p-6 md:p-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Programme</h2>
              </div>
              
            

              <div className="space-y-3">
                {schedule.map((item: { time: string; endTime?: string; program: string; host?: string; type?: string; day?: string }, i: number) => {
                  const parseTimeToMinutes = (tStr: string) => {
                    const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (match) {
                      let h = parseInt(match[1]);
                      const m = parseInt(match[2]);
                      const isPMMatch = match[3].toUpperCase() === "PM";
                      if (isPMMatch && h !== 12) h += 12;
                      if (!isPMMatch && h === 12) h = 0;
                      return h * 60 + m;
                    }
                    const itemHour = parseInt(tStr.split(":")[0]) || 0;
                    const isPM = tStr.includes("PM");
                    const h = isPM && itemHour !== 12 ? itemHour + 12 : (itemHour === 12 && !isPM ? 0 : itemHour);
                    return h * 60;
                  };

                  const startMinutes = parseTimeToMinutes(item.time || "");
                  const endMinutes = item.endTime ? parseTimeToMinutes(item.endTime) : null;

                  const isCurrent = currentMinutes >= startMinutes &&
                    (endMinutes !== null ? currentMinutes < endMinutes : currentMinutes < startMinutes + 90);

                  const typeColor = typeColors[item.type || "Talk"] || "text-gray-400 bg-gray-400/10 border-gray-400/20";

                  return (
                    <div key={i}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? "bg-red-950/20 border-brand-primary/40 shadow-lg shadow-red-900/10"
                          : "bg-white/3 border-white/8 hover:border-white/20"
                      }`}>
                      <div className="w-full sm:w-20 md:w-24 shrink-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                        <span className={`text-xs md:text-sm font-mono font-bold ${isCurrent ? "text-brand-primary" : "text-gray-500"}`}>
                          {item.time}{item.endTime ? ` – ${item.endTime}` : ""}
                        </span>
                        {isCurrent && <div className="text-[9px] md:text-[10px] text-brand-primary uppercase tracking-widest mt-0 sm:mt-0.5 animate-pulse">On Air</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm md:text-base lg:text-lg truncate ${isCurrent ? "text-white" : "text-gray-300"}`}>
                          {item.program}
                          {item.day && <span className="ml-2 text-[9px] md:text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-sm align-middle">{item.day}</span>}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1.5 mt-1 truncate">
                          <Mic className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" /> {item.host || "Spiritans Sound"}
                        </p>
                      </div>
                      <div className="shrink-0 pt-2 sm:pt-0">
                        <span className={`text-[9px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full border ${typeColor}`}>
                          {item.type || "Talk"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Podcast Archive CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center relative z-10 mt-8 md:mt-12">
        <div className="p-6 md:p-10 rounded-2xl bg-linear-to-br from-red-950/20 to-red-900/20 border border-brand-primary/20 backdrop-blur-sm shadow-xl">
          <Music className="w-8 h-8 md:w-10 md:h-10 text-brand-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Missed a Broadcast?</h2>
          <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-2 md:px-0">
            Browse our archive of past programmes, homily, and sacred music recordings.
          </p>
          <a href="/homilies"
            className="inline-block px-6 py-3 md:px-8 bg-linear-to-r from-brand-primary to-red-700 text-white text-sm md:text-base font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl shadow-red-900/20">
            Browse Homily Archive
          </a>
        </div>
      </section>
    </main>
  );
}
