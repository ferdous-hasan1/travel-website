"use client";
import { useState, useRef, useEffect } from "react";
import { Calendar, Star, Users, Search, ChevronDown, Check, Minus, Plus } from "lucide-react";

const months = [
  "Ramadan 2026", "Shawwal 2026", "Dhul Qadah 2026", "Hajj 2026", "Muharram 2026"
];

const packages = [
  { name: "Executive VIP", desc: "5-Star, Steps from Haram" },
  { name: "Premium", desc: "5-Star, Shuttle to Haram" },
  { name: "Economy", desc: "4-Star, Standard Transport" }
];

export default function PackageSearchWidget() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("Ramadan 2026");
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [pilgrims, setPilgrims] = useState(2);
  
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

  return (
    <div className="bg-white text-black p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-5xl mx-auto -mt-12 relative z-20 border border-gray-100" ref={widgetRef}>
      
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center space-x-3">
          <div className="bg-[#d4af37]/10 p-2.5 rounded-xl border border-[#d4af37]/20">
            <Star className="text-[#d4af37]" size={20} fill="#d4af37" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0b0f19] leading-tight">Find Your Package</h2>
            <p className="text-xs text-gray-500 font-medium">All-inclusive Visa, Flight, & Hotel</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-300 rounded-xl shadow-sm bg-white">
        
        {/* Travel Month */}
        <div 
          className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer rounded-tl-xl rounded-tr-xl md:rounded-tr-none md:rounded-bl-xl transition ${activePopup === 'month' ? 'bg-amber-50/50' : 'hover:bg-amber-50/30'}`}
          onClick={() => setActivePopup(activePopup === 'month' ? null : 'month')}
        >
          <p className="text-sm text-gray-500 font-medium">Travel Period</p>
          <div className="flex items-center mt-1">
            <h3 className="text-xl font-bold text-[#0b0f19] truncate flex-1">{selectedMonth}</h3>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
          
          {activePopup === 'month' && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2">
              {months.map(m => (
                <button key={m} onClick={() => setSelectedMonth(m)} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${selectedMonth === m ? 'bg-[#d4af37]/10 text-[#b8962d]' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {m}
                  {selectedMonth === m && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Package Tier */}
        <div 
          className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer transition ${activePopup === 'tier' ? 'bg-amber-50/50' : 'hover:bg-amber-50/30'}`}
          onClick={() => setActivePopup(activePopup === 'tier' ? null : 'tier')}
        >
          <p className="text-sm text-gray-500 font-medium">Package Tier</p>
          <div className="flex items-center mt-1">
            <h3 className="text-xl font-bold text-[#0b0f19] truncate flex-1">{selectedPackage.name}</h3>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">{selectedPackage.desc}</p>

          {activePopup === 'tier' && (
            <div className="absolute top-full left-0 mt-2 w-full md:w-[300px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2">
              {packages.map(p => (
                <button key={p.name} onClick={() => setSelectedPackage(p)} className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedPackage.name === p.name ? 'bg-[#d4af37]/10 border border-[#d4af37]/20' : 'hover:bg-gray-50'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-sm ${selectedPackage.name === p.name ? 'text-[#b8962d]' : 'text-gray-800'}`}>{p.name}</span>
                    {selectedPackage.name === p.name && <Check size={16} className="text-[#b8962d]" />}
                  </div>
                  <span className="text-xs text-gray-500 block mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pilgrims */}
        <div 
          className={`p-4 relative cursor-pointer rounded-bl-xl rounded-br-xl md:rounded-bl-none transition ${activePopup === 'pilgrims' ? 'bg-amber-50/50' : 'hover:bg-amber-50/30'}`}
          onClick={() => setActivePopup(activePopup === 'pilgrims' ? null : 'pilgrims')}
        >
          <p className="text-sm text-gray-500 font-medium">Pilgrims</p>
          <div className="flex items-center mt-1">
            <h3 className="text-xl font-bold text-[#0b0f19] truncate flex-1">{pilgrims} <span className="text-base font-normal">Person{pilgrims > 1 ? 's' : ''}</span></h3>
            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {activePopup === 'pilgrims' && (
            <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Total Pilgrims</h4>
                  <p className="text-[11px] text-gray-500">Includes all ages</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={(e) => { e.stopPropagation(); setPilgrims(Math.max(1, pilgrims - 1)); }} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"><Minus size={14}/></button>
                  <span className="font-bold text-lg w-4 text-center">{pilgrims}</span>
                  <button onClick={(e) => { e.stopPropagation(); setPilgrims(Math.min(20, pilgrims + 1)); }} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"><Plus size={14}/></button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="flex justify-center mt-8 -mb-10">
        <button className="bg-gradient-to-r from-[#d4af37] to-[#b8962d] text-white text-lg font-extrabold py-3.5 px-14 rounded-full shadow-xl shadow-[#d4af37]/30 transition-transform transform hover:-translate-y-1 uppercase tracking-wide border-4 border-white flex items-center space-x-2">
          <Search size={20} strokeWidth={2.5} />
          <span>View Packages</span>
        </button>
      </div>
    </div>
  );
}