"use client";
import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar as CalendarIcon, Users, Building, Search, Plus, Minus, X } from "lucide-react";
import CalendarPopup from "./CalendarPopup";

// --- Date Formatting Helpers ---
const formatDay = (date: Date | null) => (date ? date.getDate().toString() : "--");
const formatMonthYear = (date: Date | null) => {
  if (!date) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} '${date.getFullYear().toString().slice(2)}`;
};
const formatWeekday = (date: Date | null) => {
  if (!date) return "";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

const popularCities = [
  "Dubai, United Arab Emirates",
  "New York City, USA",
  "London, United Kingdom",
  "Paris, France",
  "Tokyo, Japan",
  "Malé, Maldives",
  "Bali, Indonesia",
  "Rome, Italy"
];

export default function HotelSearch() {
  const [destination, setDestination] = useState("Dubai, United Arab Emirates");
  const [checkIn, setCheckIn] = useState<Date | null>(new Date(2026, 5, 25)); 
  const [checkOut, setCheckOut] = useState<Date | null>(new Date(2026, 6, 2)); 
  
  const [guestState, setGuestState] = useState({ rooms: 1, adults: 2, children: 0 });
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- SEAMLESS CALENDAR LOGIC (Matched to Flights) ---
  const handleCalendarSelect = (date: Date) => {
    if (activePopup === "depart") { 
      // If no checkIn, OR both are selected, OR they pick a date before checkIn -> Start fresh
      if (!checkIn || (checkIn && checkOut) || date < checkIn) {
        setCheckIn(date);
        setCheckOut(null);
      } else {
        // Second click sets the checkout and closes the popup
        setCheckOut(date);
        setActivePopup(null);
      }
    } else if (activePopup === "return") {
      if (checkIn && date >= checkIn) {
        setCheckOut(date);
        setActivePopup(null);
      }
    }
  };

  const totalGuests = guestState.adults + guestState.children;

  // --- POPUPS ---
  const HotelDestinationPopup = () => {
    const [search, setSearch] = useState("");
    const filtered = popularCities.filter(c => c.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="absolute top-full left-0 mt-2 w-full md:w-[350px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] p-4 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-3">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search city or property..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-900 outline-none font-semibold placeholder-gray-400" 
            autoFocus 
          />
        </div>
        <div className="max-h-[250px] overflow-y-auto">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Popular Destinations</h4>
          {filtered.length > 0 ? filtered.map((city, idx) => (
            <button 
              key={idx}
              onClick={() => { setDestination(city); setActivePopup(null); }}
              className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 transition flex items-center"
            >
              <MapPin size={16} className="mr-2 text-gray-400" />
              {city}
            </button>
          )) : (
            <p className="text-sm text-gray-500 text-center py-4">No locations found</p>
          )}
        </div>
      </div>
    );
  };

  const HotelGuestPopup = () => {
    const updateCount = (field: keyof typeof guestState, delta: number) => {
      setGuestState(prev => {
        const newVal = prev[field] + delta;
        if (field === 'rooms' && newVal < 1) return prev;
        if (field === 'adults' && newVal < 1) return prev;
        if (field === 'children' && newVal < 0) return prev;
        if (newVal > 10) return prev;
        return { ...prev, [field]: newVal };
      });
    };

    const Counter = ({ label, desc, field }: { label: string, desc: string, field: keyof typeof guestState }) => (
      <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
        <div>
          <h4 className="font-bold text-gray-800 text-sm">{label}</h4>
          <p className="text-[11px] text-gray-500">{desc}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => updateCount(field, -1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"><Minus size={14}/></button>
          <span className="font-bold w-4 text-center text-gray-800">{guestState[field]}</span>
          <button onClick={() => updateCount(field, 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"><Plus size={14}/></button>
        </div>
      </div>
    );

    return (
      <div className="absolute top-full right-0 mt-2 w-full md:w-[320px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] p-5 animate-in fade-in zoom-in-95 duration-200 cursor-default" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-900">Rooms & Guests</h3>
          <button onClick={() => setActivePopup(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
        </div>
        <Counter label="Rooms" desc="Max 10 rooms" field="rooms" />
        <Counter label="Adults" desc="Ages 13 or above" field="adults" />
        <Counter label="Children" desc="Ages 0-12" field="children" />
        <button onClick={() => setActivePopup(null)} className="w-full mt-4 bg-[#0b0f19] text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition">
          Apply
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white text-black p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto -mt-10 relative z-10 border border-gray-100" ref={widgetRef}>
      <div className="flex items-center space-x-2 mb-6 px-2">
        <div className="bg-orange-50 p-2 rounded-lg">
          <Building className="text-[#ff6b00]" size={20} />
        </div>
        <h2 className="text-xl font-extrabold text-[#0b0f19]">Book Premium Stays</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-gray-300 rounded-xl shadow-sm">
        
        {/* Destination */}
        <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer rounded-tl-xl rounded-tr-xl md:rounded-tr-none md:rounded-bl-xl transition ${activePopup === 'dest' ? 'bg-blue-50' : 'hover:bg-blue-50'}`} onClick={() => setActivePopup('dest')}>
          <p className="text-sm text-gray-500 font-medium">City, Property, or Location</p>
          <div className="flex items-center mt-1">
            <h3 className="text-2xl font-bold truncate flex-1 text-[#0b0f19]">{destination.split(',')[0]}</h3>
          </div>
          <p className="text-xs text-gray-500 truncate mt-1">{destination.split(',')[1] || "Select Location"}</p>
          {activePopup === 'dest' && <HotelDestinationPopup />}
        </div>

        {/* Check-in */}
        <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer transition ${activePopup === 'depart' ? 'bg-blue-50' : 'hover:bg-blue-50'}`} onClick={() => setActivePopup('depart')}>
          <p className="text-sm text-gray-500 font-medium">Check-in</p>
          <div className="flex items-center mt-1">
            <h3 className="text-2xl font-bold text-[#0b0f19]">{formatDay(checkIn)} <span className="text-xl font-normal">{formatMonthYear(checkIn)}</span></h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">{formatWeekday(checkIn) || "Select Date"}</p>
          {activePopup === 'depart' && (
             <CalendarPopup activePopup={activePopup} departDate={checkIn} returnDate={checkOut} tripType="round" multiFlights={[]} onSelect={handleCalendarSelect} />
          )}
        </div>

        {/* Check-out */}
        <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer flex flex-col justify-center transition ${activePopup === 'return' ? 'bg-blue-50' : 'hover:bg-blue-50'}`} onClick={() => setActivePopup('return')}>
          <p className="text-sm text-gray-500 font-medium">Check-out</p>
          {!checkOut ? (
             <p className="text-sm text-gray-400 mt-2 leading-tight">Select check-out date</p>
          ) : (
             <>
               <div className="flex items-center mt-1">
                 <h3 className="text-2xl font-bold text-[#0b0f19]">{formatDay(checkOut)} <span className="text-xl font-normal">{formatMonthYear(checkOut)}</span></h3>
               </div>
               <p className="text-xs text-gray-500 mt-1">{formatWeekday(checkOut)}</p>
             </>
          )}
          {activePopup === 'return' && (
             <CalendarPopup activePopup={activePopup} departDate={checkIn} returnDate={checkOut} tripType="round" multiFlights={[]} onSelect={handleCalendarSelect} />
          )}
        </div>

        {/* Rooms & Guests */}
        <div className={`p-4 relative cursor-pointer rounded-bl-xl rounded-br-xl md:rounded-bl-none transition ${activePopup === 'guests' ? 'bg-blue-50' : 'hover:bg-blue-50'}`} onClick={() => setActivePopup('guests')}>
          <p className="text-sm text-gray-500 font-medium">Rooms & Guests</p>
          <div className="flex items-center mt-1">
            <h3 className="text-2xl font-bold text-[#0b0f19]">{totalGuests} <span className="text-xl font-normal">Guest{totalGuests > 1 ? 's' : ''}</span></h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">{guestState.rooms} Room{guestState.rooms > 1 ? 's' : ''}</p>
          {activePopup === 'guests' && <HotelGuestPopup />}
        </div>

      </div>

      {/* Search Button */}
      <div className="flex justify-center mt-8 -mb-12">
        <button className="bg-[#ff6b00] hover:bg-[#e66000] text-white text-lg md:text-xl font-extrabold py-3.5 px-12 md:px-16 rounded-full shadow-xl shadow-[#ff6b00]/30 transition-all uppercase tracking-wide border-4 border-white flex items-center space-x-2 transform hover:-translate-y-1">
          <Search size={20} strokeWidth={2.5} />
          <span>Search Hotels</span>
        </button>
      </div>
    </div>
  );
}