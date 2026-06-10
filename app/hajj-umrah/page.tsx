import Header from "@/components/Header";
import PackageSearchWidget from "@/components/PackageSearchWidget";
import MobileNav from "@/components/MobileNav";
import { FileText, Plane, Building2, Bus, Users } from "lucide-react";

export default function HajjUmrahPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      
      {/* Majestic Hero Section */}
      <section 
        className="relative text-white pt-24 pb-40 px-4 md:px-12 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/90 via-[#0b0f19]/70 to-[#0b0f19]/90"></div>
        <div className="absolute inset-0 bg-[#d4af37]/10 mix-blend-overlay"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-8">
          <p className="text-[#d4af37] text-sm md:text-base font-bold tracking-widest uppercase mb-4 flex items-center justify-center">
            <span className="w-8 h-px bg-[#d4af37] mr-3"></span>
            Sacred Journeys
            <span className="w-8 h-px bg-[#d4af37] ml-3"></span>
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-wide leading-tight drop-shadow-2xl">
            Your Spiritual Journey,<br className="hidden md:block" />
            <span className="text-white font-light italic font-serif tracking-normal">Perfected.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 px-4 leading-relaxed font-light">
            Experience profound peace of mind with our meticulously crafted, fully guided, and premium all-inclusive packages.
          </p>
        </div>
      </section>

      {/* Custom Package Search Widget */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative w-full mb-16">
        <PackageSearchWidget />
      </div>

      {/* The "All-Inclusive Guarantee" Bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24 w-full">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-extrabold text-[#0b0f19] uppercase tracking-wide">The SHARK SkyLINK+ Standard</h3>
          <p className="text-gray-500 mt-2">Every premium package includes our comprehensive guarantee.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { icon: FileText, title: "Visa Processing", desc: "Hassle-free approvals" },
            { icon: Plane, title: "Direct Flights", desc: "Premium airlines" },
            { icon: Building2, title: "5-Star Stays", desc: "Steps from the Haram" },
            { icon: Bus, title: "VIP Transport", desc: "High-speed rail & private cars" },
            { icon: Users, title: "Expert Guides", desc: "Scholars & dedicated staff" },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center hover:border-[#d4af37]/50 hover:shadow-lg transition-all">
                <div className="bg-[#fcfaf5] p-4 rounded-full text-[#d4af37] mb-4">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h4>
                <p className="text-[11px] text-gray-500 leading-tight px-2">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <MobileNav />
    </div>
  );
}