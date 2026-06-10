"use client";
import { useState } from "react";
import { 
  Plane, 
  Building, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  MessageCircle
} from "lucide-react";
import FlightSearchWidget from "./FlightSearchWidget";
import HotelSearchWidget from "./HotelSearchWidget"; // <-- Added this import

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"flights" | "hotels">("flights");

  return (
    <section className="relative bg-[#0f172a] text-white pt-16 pb-24 px-6 md:px-12 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')" }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Headlines */}
        <div>
          <div className="inline-block border border-[#ff6b00] text-[#ff6b00] px-3 py-1 text-xs font-bold mb-4 rounded uppercase tracking-wider bg-black/30 backdrop-blur-sm">
            Explore More
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-2">
            EXCEPTIONAL<br />
            <span className="text-[#ff6b00]">PREMIUM TRAVEL</span><br />
            MADE SIMPLE
          </h1>
          <p className="text-lg text-gray-300 mb-8 mt-4 max-w-md">
            Seamless corporate and leisure bookings from your trusted USA partner.
          </p>

          {/* Badges */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-xs font-semibold text-gray-300">
            <div className="flex items-center space-x-2 bg-black/30 w-fit px-3 py-2 rounded-md backdrop-blur-sm">
              <CheckCircle size={16} className="text-[#ff6b00]" /> <span>Best Price Guarantee</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 w-fit px-3 py-2 rounded-md backdrop-blur-sm">
              <Clock size={16} className="text-[#ff6b00]" /> <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 w-fit px-3 py-2 rounded-md backdrop-blur-sm">
              <ShieldCheck size={16} className="text-[#ff6b00]" /> <span>Trusted & Secure</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 w-fit px-3 py-2 rounded-md backdrop-blur-sm">
              <CheckCircle size={16} className="text-[#ff6b00]" /> <span>Easy Reservations</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-3 rounded-md font-bold flex items-center space-x-2 transition shadow-lg shadow-[#ff6b00]/30">
              <Plane size={18} /> <span>EXPLORE OPTIONS</span>
            </button>
            <button className="bg-black/40 backdrop-blur-sm border border-white/50 hover:bg-white hover:text-black text-white px-6 py-3 rounded-md font-bold flex items-center space-x-2 transition">
              <MessageCircle size={18} /> <span>WhatsApp Now</span>
            </button>
          </div>
        </div>

        {/* Right Side: Dark Booking Widget */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-2xl min-h-[500px] flex flex-col relative z-20">
          
          {/* Tabs */}
          <div className="flex rounded-lg overflow-hidden border border-gray-700 mb-6">
            <button 
              onClick={() => setActiveTab("flights")}
              className={`flex-1 py-3 flex justify-center items-center space-x-2 font-semibold transition ${
                activeTab === "flights" ? "bg-[#ff6b00] text-white" : "bg-transparent hover:bg-gray-800 text-gray-300"
              }`}
            >
              <Plane size={18} /> <span>Flights</span>
            </button>
            <button 
              onClick={() => setActiveTab("hotels")}
              className={`flex-1 py-3 flex justify-center items-center space-x-2 font-semibold transition border-l border-gray-700 ${
                activeTab === "hotels" ? "bg-[#ff6b00] text-white" : "bg-transparent hover:bg-gray-800 text-gray-300"
              }`}
            >
              <Building size={18} /> <span>Hotels</span>
            </button>
          </div>

          {/* Render Active Component */}
          {activeTab === "flights" ? (
            <FlightSearchWidget />
          ) : (
            <HotelSearchWidget /> /* <-- This triggers your new, fully functional component! */
          )}

          <div className="text-center mt-4 text-xs text-gray-500">
            Powered by <span className="font-bold text-white">travelpayouts</span>
          </div>
        </div>
      </div>
    </section>
  );
}