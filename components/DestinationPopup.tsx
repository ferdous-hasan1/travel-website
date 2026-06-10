"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const airportData = [
  "Kolkata Netaji Subhash Chandra Bose Airport (CCU)",
  "New Delhi Indira Gandhi International Airport (DEL)",
  "Mumbai Chhatrapati Shivaji Maharaj International Airport (BOM)",
  "Bengaluru Kempegowda International Airport (BLR)",
  "Chennai International Airport (MAA)",
  "New York John F. Kennedy International Airport (JFK)",
  "London Heathrow Airport (LHR)",
  "Dubai International Airport (DXB)",
  "Tokyo Haneda Airport (HND)",
  "Paris Charles de Gaulle Airport (CDG)",
  "Manila Ninoy Aquino International Airport (MNL)",
  "Kuala Lumpur International Airport (KUL)",
  "Colombo Bandaranaike International Airport (CMB)",
  "Bali Ngurah Rai International Airport (DPS)",
  "Tbilisi International Airport (TBS)",
  // Add the rest of your 200 airports here...
];

const defaultSuggestions = [
  {
    category: "Popular Destinations",
    items: ["New York (JFK)", "Dubai (DXB)", "London (LHR)", "Tokyo (HND)", "Paris (CDG)"]
  },
  {
    category: "Visa-Free / E-Visa",
    items: ["Manila", "Male", "Kuala Lumpur", "Colombo", "Denpasar", "Tbilisi"]
  }
];

interface DestinationPopupProps {
  onSelect: (val: string) => void;
}

export default function DestinationPopup({ onSelect }: DestinationPopupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredAirports = airportData.filter((airport) =>
    airport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute top-full left-0 mt-2 w-[320px] bg-[#1e293b] border border-gray-600 rounded-xl shadow-2xl z-[60] p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center space-x-2 border-b border-gray-600 pb-3 mb-4">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search city or airport..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-white outline-none font-semibold placeholder-gray-500" 
          autoFocus 
        />
      </div>

      <div className="max-h-[250px] overflow-y-auto hide-scrollbar pr-1">
        {searchQuery.length > 0 ? (
          <div className="flex flex-col gap-2">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport, idx) => (
                <button 
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); onSelect(airport); }} 
                  className="bg-[#111827] border border-gray-700 hover:border-[#ff6b00] hover:text-[#ff6b00] text-gray-300 py-2 px-3 text-xs rounded-lg transition-colors text-left"
                >
                  {airport}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No airports found.</p>
            )}
          </div>
        ) : (
          defaultSuggestions.map((group, idx) => (
            <div key={idx} className="mb-5 last:mb-0">
              <h4 className="text-white font-bold text-sm mb-3">{group.category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item, itemIdx) => (
                  <button 
                    key={itemIdx} 
                    onClick={(e) => { e.stopPropagation(); onSelect(item); }} 
                    className="bg-[#111827] border border-gray-700 hover:border-[#ff6b00] hover:text-[#ff6b00] text-gray-300 py-2 px-2 text-xs rounded-lg transition-colors truncate text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}