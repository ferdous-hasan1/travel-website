"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plane, ArrowLeftRight, Calendar as CalendarIcon, Users, Plus, Trash2, ChevronDown } from "lucide-react";
import DestinationPopup from "./DestinationPopup";
import CalendarPopup from "./CalendarPopup";
import PassengerPopup from "./PassengerPopup";

// --- Helpers ---
const formatShortDate = (date: Date | null) => {
  if (!date) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

const formatApiDate = (date: Date | null) => {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getCityName = (val: string) => val.split(" (")[0] || val;
const getAirportCode = (val: string) => val.includes("(") ? val.split(" (")[1].replace(")", "") : val;

export interface FlightSearchBarProps {
  initialTripType?: "round" | "oneway" | "multi";
  initialFrom?: string;
  initialTo?: string;
  initialDepartDate?: Date | null;
  initialReturnDate?: Date | null;
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
  initialTravelClass?: string;
}

export default function FlightSearchBar(props: FlightSearchBarProps) {
  const router = useRouter();
  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">(props.initialTripType || "round");
  
  const [fromValue, setFromValue] = useState(props.initialFrom || "New York (JFK)");
  const [toValue, setToValue] = useState(props.initialTo || "Dubai (DXB)");
  const [departDate, setDepartDate] = useState<Date | null>(props.initialDepartDate !== undefined ? props.initialDepartDate : new Date(2026, 5, 11)); 
  const [returnDate, setReturnDate] = useState<Date | null>(props.initialReturnDate !== undefined ? props.initialReturnDate : new Date(2026, 5, 12));

  const [multiFlights, setMultiFlights] = useState<{id: number, from: string, to: string, date: Date | null}[]>([
    { id: 1, from: "New York (JFK)", to: "Dubai (DXB)", date: new Date(2026, 5, 11) },
    { id: 2, from: "Dubai (DXB)", to: "London (LHR)", date: new Date(2026, 5, 15) }
  ]);

  const [passengerState, setPassengerState] = useState({
    adults: props.initialAdults ?? 1,
    children: props.initialChildren ?? 0,
    infants: props.initialInfants ?? 0,
    travelClass: props.initialTravelClass || "Economy"
  });

  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) setActivePopup(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC ---
  const handleTripTypeChange = (type: "round" | "oneway" | "multi") => {
    setTripType(type);
    if (type === "oneway") setReturnDate(null);
  };

  const handleCalendarSelect = (date: Date) => {
    if (activePopup === "depart") {
      if (tripType === "oneway") {
        setDepartDate(date);
        setActivePopup(null); 
      } else {
        // Round Trip: Keep calendar open, shift focus to return date
        setDepartDate(date);
        setReturnDate(null);
        setActivePopup("return"); 
      }
    } else if (activePopup === "return") {
      if (departDate && date >= departDate) {
        setReturnDate(date);
        setActivePopup(null); 
        if (tripType === "oneway") setTripType("round");
      }
    } else if (activePopup?.startsWith("date-multi-")) {
      const id = parseInt(activePopup.split("-")[2]);
      updateMultiFlight(id, "date", date);
      setActivePopup(null);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    const extractIata = (str: string) => str.match(/\(([A-Z]{3})\)/)?.[1] || str;

    const queryParams = new URLSearchParams({
      tripType,
      adults: passengerState.adults.toString(),
      children: passengerState.children.toString(),
      infants: passengerState.infants.toString(),
      travelClass: passengerState.travelClass,
    });

    if (tripType === "multi") {
      const slices = multiFlights.map(f => ({ origin: extractIata(f.from), destination: extractIata(f.to), date: formatApiDate(f.date) }));
      queryParams.append("slices", JSON.stringify(slices));
    } else {
      queryParams.append("origin", extractIata(fromValue));
      queryParams.append("destination", extractIata(toValue));
      queryParams.append("departDate", formatApiDate(departDate));
      if (tripType === "round" && returnDate) queryParams.append("returnDate", formatApiDate(returnDate));
    }

    router.push(`/flights?${queryParams.toString()}`);
    setIsSearching(false);
  };

  const getTotalPassengers = () => passengerState.adults + passengerState.children + passengerState.infants;

  return (
    <div className="w-full relative z-20" ref={widgetRef}>
      
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center space-x-6 mb-3 text-sm font-medium text-white">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "round"} onChange={() => handleTripTypeChange("round")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
          <span>Round-trip</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "oneway"} onChange={() => handleTripTypeChange("oneway")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
          <span>One-way</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "multi"} onChange={() => handleTripTypeChange("multi")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
          <span>Multi-city</span>
        </label>
        <div className="relative">
          <button className="flex items-center space-x-1 hover:text-gray-200 transition" onClick={() => setActivePopup(activePopup === "class" ? null : "class")}>
            <span>{passengerState.travelClass}</span>
            <ChevronDown size={14} />
          </button>
          {activePopup === "class" && (
            <div className="absolute top-full left-0 mt-2 bg-white text-black border rounded shadow-xl overflow-hidden w-48 z-50">
               {["Economy/Premium Economy", "Premium Economy", "Business", "First Class"].map(cls => (
                 <div key={cls} onClick={() => { setPassengerState({...passengerState, travelClass: cls}); setActivePopup(null); }} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm">
                   {cls}
                 </div>
               ))}
            </div>
          )}
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          <span>Direct flights only</span>
        </label>
      </div>

      {/* Main Input Row (Yellow Border Wrapper) */}
      {tripType !== "multi" ? (
        <div className="bg-[#ffb700] p-1 rounded flex flex-col lg:flex-row gap-1 shadow-md">
          
          {/* FROM */}
          <div 
            className="flex-1 bg-white p-2.5 rounded-l flex items-center relative cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setActivePopup("from-main")}
          >
            <Plane className="text-gray-400 mr-3" size={24} />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] text-gray-500 leading-tight">Leaving from</span>
              <span className="font-bold text-gray-900 text-sm truncate">
                {getAirportCode(fromValue)} <span className="font-normal">{getCityName(fromValue)}</span>
              </span>
            </div>
            
            {/* Swap Button overlaps inputs */}
            <div 
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1.5 z-10 hover:bg-gray-50 shadow-sm hidden lg:block"
              onClick={(e) => { e.stopPropagation(); const temp = fromValue; setFromValue(toValue); setToValue(temp); }}
            >
              <ArrowLeftRight size={16} className="text-blue-600" />
            </div>

            {activePopup === "from-main" && <DestinationPopup onSelect={(val) => { setFromValue(val); setActivePopup(null); }} />}
          </div>

          {/* TO */}
          <div 
            className="flex-1 bg-white p-2.5 flex items-center relative cursor-pointer hover:bg-gray-50 transition pl-4 lg:pl-6"
            onClick={() => setActivePopup("to-main")}
          >
            <Plane className="text-gray-400 mr-3 transform rotate-90" size={24} />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] text-gray-500 leading-tight">Going to</span>
              <span className="font-bold text-gray-900 text-sm truncate">
                {getAirportCode(toValue)} <span className="font-normal">{getCityName(toValue)}</span>
              </span>
            </div>
            {activePopup === "to-main" && <DestinationPopup onSelect={(val) => { setToValue(val); setActivePopup(null); }} />}
          </div>

          {/* DATES (Unified Box) */}
          <div 
            className="flex-1 bg-white p-2.5 flex items-center relative cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setActivePopup(departDate && !returnDate ? "return" : "depart")}
          >
            <CalendarIcon className="text-gray-400 mr-3" size={24} />
            <div className="flex flex-col overflow-hidden w-full">
              <span className="text-[11px] text-gray-500 leading-tight">Travel date</span>
              <span className="font-bold text-gray-900 text-sm truncate">
                {tripType === "oneway" 
                  ? formatShortDate(departDate) || "Select Date"
                  : `${formatShortDate(departDate)} — ${returnDate ? formatShortDate(returnDate) : "Return"}`
                }
              </span>
            </div>
            {(activePopup === "depart" || activePopup === "return") && (
              <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
            )}
          </div>

          {/* PASSENGERS */}
          <div 
            className="flex-1 bg-white p-2.5 flex items-center relative cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setActivePopup("passengers")}
          >
            <Users className="text-gray-400 mr-3" size={24} />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] text-gray-500 leading-tight">Travelers</span>
              <span className="font-bold text-gray-900 text-sm truncate">
                {getTotalPassengers()} adult{getTotalPassengers() > 1 ? 's' : ''}
              </span>
            </div>
            {activePopup === "passengers" && (
              <PassengerPopup passengerState={passengerState} setPassengerState={setPassengerState} onClose={() => setActivePopup(null)} />
            )}
          </div>

          {/* SEARCH BUTTON */}
          <button 
            onClick={handleSearch}
            className="bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold px-8 py-3 rounded-r text-lg transition shadow-inner"
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>
      ) : (
        // Multi-City Vertical Stacking (to fit the yellow container logic)
        <div className="bg-[#ffb700] p-1 rounded shadow-md space-y-1">
           {multiFlights.map((flight) => (
             <div key={flight.id} className="flex flex-col lg:flex-row gap-1">
                <div className="flex-1 bg-white p-2.5 flex items-center relative cursor-pointer" onClick={() => setActivePopup(`from-multi-${flight.id}`)}>
                  <Plane className="text-gray-400 mr-2" size={20} />
                  <div className="flex flex-col"><span className="text-[11px] text-gray-500">From</span><span className="font-bold text-sm">{flight.from}</span></div>
                  {activePopup === `from-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'from', val)} />}
                </div>
                <div className="flex-1 bg-white p-2.5 flex items-center relative cursor-pointer" onClick={() => setActivePopup(`to-multi-${flight.id}`)}>
                  <Plane className="text-gray-400 mr-2" size={20} />
                  <div className="flex flex-col"><span className="text-[11px] text-gray-500">To</span><span className="font-bold text-sm">{flight.to}</span></div>
                  {activePopup === `to-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'to', val)} />}
                </div>
                <div className="flex-1 bg-white p-2.5 flex items-center relative cursor-pointer" onClick={() => setActivePopup(`date-multi-${flight.id}`)}>
                  <CalendarIcon className="text-gray-400 mr-2" size={20} />
                  <div className="flex flex-col"><span className="text-[11px] text-gray-500">Depart</span><span className="font-bold text-sm">{formatShortDate(flight.date)}</span></div>
                  {activePopup === `date-multi-${flight.id}` && <CalendarPopup activePopup={activePopup} departDate={null} returnDate={null} tripType="multi" multiFlights={multiFlights} onSelect={handleCalendarSelect} /> }
                </div>
                {multiFlights.length > 2 && (
                  <button onClick={() => removeMultiFlight(flight.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 flex items-center justify-center">
                    <Trash2 size={20} />
                  </button>
                )}
             </div>
           ))}
           <div className="flex flex-col lg:flex-row gap-1">
             <div className="flex-1 bg-white p-2.5 flex items-center relative cursor-pointer" onClick={() => setActivePopup("passengers")}>
                <Users className="text-gray-400 mr-3" size={24} />
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 leading-tight">Travelers & Class</span>
                  <span className="font-bold text-gray-900 text-sm">{getTotalPassengers()} travelers • {passengerState.travelClass}</span>
                </div>
                {activePopup === "passengers" && <PassengerPopup passengerState={passengerState} setPassengerState={setPassengerState} onClose={() => setActivePopup(null)} />}
             </div>
             <div className="flex gap-1">
               {multiFlights.length < 5 && (
                  <button onClick={addMultiFlight} className="bg-white hover:bg-blue-50 text-blue-600 font-bold px-6 flex items-center">
                    <Plus size={18} className="mr-1"/> Add flight
                  </button>
                )}
               <button onClick={handleSearch} className="bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold px-8 py-3 text-lg">
                 Search
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}