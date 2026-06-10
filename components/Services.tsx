"use client";
import { Plane, Building, Hotel, FileText, Palmtree, Activity } from "lucide-react";

export default function Services() {
  const services = [
    { title: "AIR TICKETS", desc: "Domestic & International Flights", icon: Plane },
    { title: "HAJJ & UMRAH", desc: "Best Hajj & Umrah Packages", icon: Building },
    { title: "HOTEL BOOKING", desc: "Worldwide Hotel Reservations", icon: Hotel },
    { title: "VISA ASSISTANCE", desc: "Processing for All Countries", icon: FileText },
    { title: "TOUR PACKAGES", desc: "Amazing Holiday Packages", icon: Palmtree },
    { title: "MEDICAL TOURISM", desc: "World Class Medical Services", icon: Activity },
  ];

  return (
    <section className="bg-[#0b0f19] py-16 md:py-20 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="text-center mb-4 md:mb-6">
          <p className="text-[#ff6b00] text-sm font-bold mb-2 tracking-widest uppercase">Our Expertise</p>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
            Premium Travel Services
          </h2>
        </div>

        {/* Scroll Container */}
        <div className="flex flex-nowrap gap-4 md:gap-5 overflow-x-auto hide-scrollbar pt-12 pb-14 px-4 -mx-4 snap-x snap-mandatory">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="snap-center bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center hover:border-[#ff6b00]/50 hover:shadow-2xl hover:shadow-[#ff6b00]/20 hover:-translate-y-4 transition-all duration-300 group cursor-pointer flex-1 min-w-[240px] lg:min-w-0"
              >
                {/* Icon Container */}
                <div className="bg-[#1e293b] text-[#ff6b00] p-4 rounded-full mb-5 group-hover:scale-110 group-hover:bg-[#ff6b00] group-hover:text-white transition-all duration-300 shadow-inner">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                
                {/* Text */}
                <h3 className="font-extrabold text-sm md:text-base mb-2 group-hover:text-[#ff6b00] transition-colors leading-tight tracking-wide">
                  {service.title}
                </h3>
                <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed px-2">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}