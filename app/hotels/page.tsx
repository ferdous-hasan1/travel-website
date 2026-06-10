import Header from "@/components/Header";
import HotelSearch from "@/components/HotelSearch";
import MobileNav from "@/components/MobileNav";
import { Star, MapPin, ArrowRight, ShieldCheck, Clock, Sparkles, Wifi, Coffee, Waves } from "lucide-react";
import Image from "next/image";

export default function HotelsPage() {
  const featuredStays = [
    { 
      name: "Atlantis The Royal", 
      location: "Palm Jumeirah, Dubai", 
      rating: 4.9, 
      reviews: "2.4K", 
      price: "$850", 
      badge: "Guest Favorite",
      amenities: ["Pool", "Spa", "Free WiFi"],
      img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop" 
    },
    { 
      name: "The Plaza New York", 
      location: "5th Avenue, USA", 
      rating: 4.8, 
      reviews: "5.1K", 
      price: "$650", 
      badge: "Luxury",
      amenities: ["City View", "Gym", "Bar"],
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      name: "Fairmont Le Château", 
      location: "Quebec City, Canada", 
      rating: 4.7, 
      reviews: "3.8K", 
      price: "$420", 
      badge: "Historic",
      amenities: ["Breakfast", "Spa", "Parking"],
      img: "https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      name: "Shangri-La The Shard", 
      location: "London, UK", 
      rating: 4.9, 
      reviews: "1.9K", 
      price: "$780", 
      badge: "Trending",
      amenities: ["Pool", "Restaurant", "WiFi"],
      img: "https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=2070&auto=format&fit=crop" 
    },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      
      {/* 1. Enhanced Hero Section */}
      <section 
        className="relative bg-[#0f172a] text-white pt-20 pb-36 px-4 md:px-12 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2089&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#f8f9fa]"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center mt-4">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold tracking-wider mb-4 uppercase">
            Exclusive Accommodations
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-wide leading-tight drop-shadow-lg">
            A New Standard of <br className="hidden md:block" />
            <span className="text-[#ff6b00]">Luxury Stays</span>
          </h1>
        </div>
      </section>

      {/* 2. Hotel Search Widget */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-20 w-full mb-12 -mt-16 md:-mt-24">
        <HotelSearch />
      </div>

      {/* 3. Trust Signals / Perks (New) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-50 p-3 rounded-full text-[#ff6b00] shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Price Match Guarantee</h4>
              <p className="text-sm text-gray-500 mt-1">Find a lower price? We'll match it and give you an extra discount.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-50 p-3 rounded-full text-[#ff6b00] shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">VIP Perks & Upgrades</h4>
              <p className="text-sm text-gray-500 mt-1">Enjoy complimentary room upgrades and late checkouts on select stays.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-50 p-3 rounded-full text-[#ff6b00] shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">24/7 Concierge</h4>
              <p className="text-sm text-gray-500 mt-1">Our dedicated travel experts are always available to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Browse by Vibe (New) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-12 w-full">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#0b0f19] mb-4">Explore by Style</h2>
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
          {['Beachfront Resorts', 'City Center Penthouses', 'Boutique Villas', 'Nature Retreats', 'Business Hotels'].map((style, i) => (
            <button key={i} className="snap-start shrink-0 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors shadow-sm">
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Premium Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24 w-full flex-1">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[#ff6b00] text-xs md:text-sm font-bold tracking-widest uppercase mb-1">Handpicked Collection</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b0f19] uppercase tracking-wide">Featured Premium Stays</h2>
          </div>
          <button className="hidden md:flex items-center text-sm font-bold text-[#0b0f19] border-b-2 border-transparent hover:border-[#ff6b00] pb-1 transition-all">
            View all properties <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredStays.map((stay, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 group cursor-pointer flex flex-col relative">
              
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 bg-[#0b0f19] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-md">
                {stay.badge}
              </div>

              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image 
                  src={stay.img} 
                  alt={stay.name} 
                  fill 
                  unoptimized
                  className="object-cover group-hover:scale-105 transition duration-700 ease-in-out" 
                />
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-lg text-gray-900">
                  <Star size={14} className="text-[#ff6b00] fill-[#ff6b00] mr-1.5" /> {stay.rating} 
                  <span className="text-gray-500 font-normal ml-1">({stay.reviews})</span>
                </div>
              </div>
              
              {/* Details */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-extrabold text-lg md:text-xl text-gray-900 truncate mb-1.5 group-hover:text-[#ff6b00] transition-colors">{stay.name}</h3>
                <p className="text-xs text-gray-500 flex items-center mb-4 font-medium">
                  <MapPin size={14} className="mr-1.5 text-gray-400" /> {stay.location}
                </p>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {stay.amenities.map((amenity, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-semibold flex items-center">
                      {amenity === "Pool" && <Waves size={10} className="mr-1"/>}
                      {amenity === "Free WiFi" || amenity === "WiFi" ? <Wifi size={10} className="mr-1"/> : null}
                      {amenity === "Breakfast" && <Coffee size={10} className="mr-1"/>}
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Starting From</p>
                    <p className="text-[#0b0f19] font-extrabold text-2xl">{stay.price} <span className="text-xs font-medium text-gray-500 block sm:inline">/ night</span></p>
                  </div>
                  <button className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md shadow-[#ff6b00]/20">
                    Book
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
        
        <button className="md:hidden w-full mt-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold flex justify-center items-center shadow-lg">
          View all properties <ArrowRight size={16} className="ml-2" />
        </button>
      </section>

      <MobileNav />
    </div>
  );
}