"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

export default function Destinations() {
  const destinations = [
    { name: "SAUDI ARABIA", location: "Mecca & Medina", rating: "9.8", reviews: "15K", price: "$699", img: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "DUBAI", location: "UAE City Center", rating: "9.4", reviews: "12K", price: "$589", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "BANGLADESH", location: "Dhaka & Sylhet", rating: "9.1", reviews: "4K", price: "$799", img: "https://plus.unsplash.com/premium_photo-1686310335921-38acc0679321?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "UNITED KINGDOM", location: "London & Edinburgh", rating: "8.9", reviews: "9K", price: "$499", img: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "USA DOMESTIC", location: "New York & LA", rating: "9.3", reviews: "22K", price: "$199", img: "https://plus.unsplash.com/premium_photo-1681803531285-75db948035d3?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "CANADA", location: "Toronto & Vancouver", rating: "9.0", reviews: "7K", price: "$599", img: "https://images.unsplash.com/photo-1588733103629-b77afe0425ce?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  return (
    <section className="bg-[#0b0f19] py-16 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <p className="text-[#ff6b00] text-sm font-bold tracking-widest uppercase mb-2">Popular Destinations</p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">Explore Top Destinations</h2>
          </div>
          <button className="border border-gray-600 px-6 py-2 rounded-full hover:border-[#ff6b00] transition">VIEW ALL DESTINATIONS →</button>
        </div>

        {/* 6-column Grid maintained */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest, i) => (
            <div key={i} className="relative h-80 rounded-2xl overflow-hidden border border-gray-800 group flex flex-col">
              {/* Image Area */}
              <div className="relative h-40 w-full">
                <Image 
                  src={dest.img} 
                  alt={dest.name} 
                  fill 
                  unoptimized 
                  className="object-cover group-hover:scale-110 transition duration-500" 
                  sizes="16vw"
                />
                <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full">
                  <Heart size={14} className="text-white" />
                </div>
              </div>

              {/* Detail Area - Fits within h-80 card dimensions */}
              <div className="p-3 flex flex-col flex-1 bg-[#111827]">
                <p className="font-bold text-[11px] uppercase tracking-wide truncate">{dest.name}</p>
                <p className="text-[10px] text-gray-400 mb-2">{dest.location}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="bg-[#ff6b00] text-[10px] font-bold px-1 rounded">{dest.rating}</span>
                    <span className="text-[9px] text-gray-500">{dest.reviews} reviews</span>
                  </div>
                  <p className="text-[#ff6b00] font-bold text-sm">FROM {dest.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}