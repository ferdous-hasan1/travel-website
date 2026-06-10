"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building, MapPin, Calendar as CalendarIcon, Users, Search, Plus, Minus, X } from "lucide-react";
import CalendarPopup from "./CalendarPopup"; 

// --- Helpers ---
const formatDisplayDate = (date: Date | null) => {
  if (!date) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
};

const formatApiDate = (dateStr: Date | null) => {
  if (!dateStr) return "";
  const yyyy = dateStr.getFullYear();
  const mm = String(dateStr.getMonth() + 1).padStart(2, '0');
  const dd = String(dateStr.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const popularCities = [
  "Dubai, United Arab Emirates",
  "New York City, USA",
  "London, United Kingdom",
  "Paris, France",
  "Tokyo, Japan",
  "Malé, Maldives",
  "Mecca, Saudi Arabia"
];

export default function HotelSearchWidget() {
  const router = useRouter();
  const [destination, setDestination] = useState("Dubai, United Arab Emirates");
  
  const [checkIn, setCheckIn] = useState<Date | null>(new Date(2026, 5, 11)); 
  const [checkOut, setCheckOut] = useState<Date | null>(new Date(2026, 5, 15));
  
  const [guestState, setGuestState] = useState({ rooms: 1, adults: 2, children: 0 });
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
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
      if (!checkIn || (checkIn && checkOut) || date < checkIn) {
        setCheckIn(date);
        setCheckOut(null);
      } else {
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

  const updateGuests = (field: keyof typeof guestState, delta: number) => {
    setGuestState(prev => {
      const newVal = prev[field] + delta;
      if (field === 'rooms' && newVal < 1) return prev;
      if (field === 'adults' && newVal < 1) return prev;
      if (field === 'children' && newVal < 0) return prev;
      if (newVal > 10) return prev;
      return { ...prev, [field]: newVal };
    });
  };

  const totalGuests = guestState.adults + guestState.children;

  const handleSearch = () => {
    setIsSearching(true);
    const queryParams = new URLSearchParams({
      dest: destination.split(',')[0].trim(),
      checkIn: formatApiDate(checkIn),
      checkOut: formatApiDate(checkOut),
      rooms: guestState.rooms.toString(),
      adults: guestState.adults.toString(),
      children: guestState.children.toString(),
    });
    router.push(`/hotels?${queryParams.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300 h-full" ref={widgetRef}>
      
      <div className="h-6 mb-6"></div>

      <div className="space-y-4 mb-6 relative">
        
        {/* Destination Input */}
        <div 
          className={`bg-[#1e293b] p-3 rounded border transition relative cursor-pointer ${activePopup === 'dest' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
          onClick={() => setActivePopup(activePopup === 'dest' ? null : 'dest')}
        >
          <p className="text-xs text-gray-400">City, Property, or Location</p>
          <div className="flex justify-between items-center mt-1">
            <input type="text" value={destination} readOnly className="w-full bg-transparent text-white font-semibold outline-none cursor-pointer pointer-events-none truncate" />
            <MapPin size={16} className="text-gray-400 shrink-0 ml-2" />
          </div>

          {activePopup === "dest" && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#1e293b] border border-gray-600 rounded-xl shadow-2xl z-[60] p-3 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="flex items-center space-x-2 border-b border-gray-600 pb-3 mb-3">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Where are you going?" 
                  className="w-full bg-transparent text-white outline-none font-semibold placeholder-gray-500" 
                  autoFocus 
                />
              </div>
              <h4 className="text-white font-bold text-xs mb-3 px-2">POPULAR DESTINATIONS</h4>
              <div className="max-h-[200px] overflow-y-auto hide-scrollbar">
                {popularCities.map((city, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setDestination(city); setActivePopup(null); }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#111827] hover:text-[#ff6b00] rounded-lg text-sm font-semibold text-gray-300 transition flex items-center"
                  >
                    <MapPin size={14} className="mr-2" /> {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Check-in / Check-out Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`bg-[#1e293b] p-3 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === 'depart' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
            onClick={() => setActivePopup("depart")}
          >
            <div className="w-full">
              <p className="text-xs text-gray-400">Check-in</p>
              <input type="text" value={formatDisplayDate(checkIn) || "Select Date"} readOnly className={`w-full bg-transparent font-semibold outline-none mt-1 cursor-pointer pointer-events-none ${!checkIn ? 'text-gray-500' : 'text-white'}`} />
            </div>
            <CalendarIcon size={16} className="text-gray-400 shrink-0"/>
            
            {activePopup === "depart" && (
              <CalendarPopup activePopup={activePopup} departDate={checkIn} returnDate={checkOut} tripType="round" multiFlights={[]} onSelect={handleCalendarSelect} />
            )}
          </div>

          <div 
            className={`bg-[#1e293b] p-3 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === 'return' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
            onClick={() => setActivePopup("return")}
          >
            <div className="w-full">
              <p className="text-xs text-gray-400">Check-out</p>
              <input 
                type="text" 
                value={formatDisplayDate(checkOut)} 
                placeholder="Select Date"
                readOnly 
                className={`w-full bg-transparent font-semibold outline-none mt-1 cursor-pointer pointer-events-none ${!checkOut ? 'text-gray-500' : 'text-white'}`} 
              />
            </div>
            <CalendarIcon size={16} className="text-gray-400 shrink-0"/>
            
            {activePopup === "return" && (
              <CalendarPopup activePopup={activePopup} departDate={checkIn} returnDate={checkOut} tripType="round" multiFlights={[]} onSelect={handleCalendarSelect} />
            )}
          </div>
        </div>

        {/* Guests & Rooms */}
        <div 
          className={`bg-[#1e293b] p-3 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === 'guests' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
          onClick={() => setActivePopup(activePopup === 'guests' ? null : 'guests')}
        >
          <div className="w-full">
            <p className="text-xs text-gray-400">Rooms & Guests</p>
            <input type="text" value={`${guestState.rooms} Room, ${totalGuests} Guest${totalGuests > 1 ? 's' : ''}`} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
          </div>
          <Users size={16} className="text-gray-400 shrink-0"/>

          {activePopup === "guests" && (
            <div className="absolute top-full right-0 mt-2 w-full md:w-[300px] bg-[#1e293b] border border-gray-600 rounded-xl shadow-2xl z-[60] p-4 animate-in fade-in zoom-in-95 cursor-default" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                <h3 className="font-bold text-white text-sm">Guests Allocation</h3>
                <button onClick={() => setActivePopup(null)} className="text-gray-400 hover:text-white"><X size={16}/></button>
              </div>
              
              {(['rooms', 'adults', 'children'] as const).map((field) => (
                <div key={field} className="flex justify-between items-center py-2">
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm capitalize">{field}</h4>
                    <p className="text-[10px] text-gray-500">{field === 'rooms' ? 'Max 10' : field === 'adults' ? 'Ages 13+' : 'Ages 0-12'}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => updateGuests(field, -1)} className="w-7 h-7 rounded border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition"><Minus size={14}/></button>
                    <span className="font-bold w-4 text-center text-white">{guestState[field]}</span>
                    <button onClick={() => updateGuests(field, 1)} className="w-7 h-7 rounded border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition"><Plus size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-md font-bold text-lg flex items-center justify-center space-x-2 transition mt-auto shadow-lg shadow-[#ff6b00]/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Building size={20} className={isSearching ? "animate-pulse" : ""} /> 
        <span>{isSearching ? "SEARCHING HOTELS..." : "SEARCH HOTELS"}</span>
      </button>
    </div>
  );
}