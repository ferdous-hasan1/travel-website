"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // <-- Imported useRouter
import { 
  Plane, 
  ArrowLeftRight, 
  Calendar as CalendarIcon, 
  Plus,
  Trash2,
  Users
} from "lucide-react";
import DestinationPopup from "./DestinationPopup";
import CalendarPopup from "./CalendarPopup";
import PassengerPopup from "./PassengerPopup";

// --- Helpers ---
const formatDisplayDate = (date: Date | null) => {
  if (!date) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
};

const formatApiDate = (dateStr: any) => {
  if (!dateStr) return "";
  if (dateStr instanceof Date) {
    const yyyy = dateStr.getFullYear();
    const mm = String(dateStr.getMonth() + 1).padStart(2, '0');
    const dd = String(dateStr.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  // It's a string like "11 Jun 26"
  const parts = typeof dateStr === 'string' ? dateStr.split(" ") : [];
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const monthMap: Record<string, string> = {
      "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
      "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    };
    const month = monthMap[parts[1]] || "01";
    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    return `${year}-${month}-${day}`;
  }
  return "";
};

export interface FlightSearchProps {
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

export default function FlightSearchWidget(props: FlightSearchProps) {
  const router = useRouter(); // <-- Initialize router
  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">(props.initialTripType || "round");
  
  // Standard Flight States
  const [fromValue, setFromValue] = useState(props.initialFrom || "New York (JFK)");
  const [toValue, setToValue] = useState(props.initialTo || "Dubai (DXB)");
  const [departDate, setDepartDate] = useState<Date | null>(props.initialDepartDate !== undefined ? props.initialDepartDate : new Date(2026, 5, 11)); 
  const [returnDate, setReturnDate] = useState<Date | null>(props.initialReturnDate !== undefined ? props.initialReturnDate : new Date(2026, 5, 12));

  // Multi-City States
  const [multiFlights, setMultiFlights] = useState<{id: number, from: string, to: string, date: Date | null}[]>([
    { id: 1, from: "New York (JFK)", to: "Dubai (DXB)", date: new Date(2026, 5, 11) },
    { id: 2, from: "Dubai (DXB)", to: "London (LHR)", date: new Date(2026, 5, 15) }
  ]);

  // Passenger State
  const [passengerState, setPassengerState] = useState({
    adults: props.initialAdults ?? 1,
    children: props.initialChildren ?? 0,
    infants: props.initialInfants ?? 0,
    travelClass: props.initialTravelClass || "Economy"
  });

  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- INTERACTION LOGIC ---
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
        if (!departDate || returnDate || date < departDate) {
          setDepartDate(date);
          setReturnDate(null); 
        } else {
          setReturnDate(date);
          setActivePopup(null); 
        }
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

  // Multi-City Modifiers
  const addMultiFlight = () => {
    if (multiFlights.length < 5) {
      const lastFlight = multiFlights[multiFlights.length - 1];
      setMultiFlights([...multiFlights, { id: Date.now(), from: lastFlight.to, to: "", date: null }]);
    }
  };
  const removeMultiFlight = (id: number) => setMultiFlights(multiFlights.filter(f => f.id !== id));
  const updateMultiFlight = (id: number, field: string, value: any) => {
    setMultiFlights(multiFlights.map(f => f.id === id ? { ...f, [field]: value } : f));
    if (field !== 'date') setActivePopup(null);
  };

  // --- REDIRECT TO FLIGHTS PAGE ---
  const handleSearch = () => {
    setIsSearching(true);
    
    // Extract IATA codes for the URL
    const extractIata = (str: string) => {
      const match = str.match(/\(([A-Z]{3})\)/);
      return match ? match[1] : str;
    };

    // Build query parameters to pass to the /flights page
    const queryParams = new URLSearchParams({
      tripType,
      adults: passengerState.adults.toString(),
      children: passengerState.children.toString(),
      infants: passengerState.infants.toString(),
      travelClass: passengerState.travelClass,
    });

    if (tripType === "multi") {
      // For multi-city, encode the array as JSON string
      const slices = multiFlights.map(f => ({
        origin: extractIata(f.from),
        destination: extractIata(f.to),
        date: formatApiDate(f.date)
      }));
      queryParams.append("slices", JSON.stringify(slices));
    } else {
      // For standard trips
      queryParams.append("origin", extractIata(fromValue));
      queryParams.append("destination", extractIata(toValue));
      queryParams.append("departDate", formatApiDate(departDate));
      if (tripType === "round" && returnDate) {
        queryParams.append("returnDate", formatApiDate(returnDate));
      }
    }

    // Redirect to the flights page with the query params
    router.push(`/flights?${queryParams.toString()}`);
  };

  // --- PASSENGER TEXT FORMATTERS ---
  const getTotalPassengers = () => passengerState.adults + passengerState.children + passengerState.infants;
  const getTravelClassText = () => passengerState.travelClass === "Economy/Premium Economy" ? "Economy" : passengerState.travelClass;
  const getDetailedPassengerText = () => {
    const parts = [];
    if (passengerState.adults > 0) parts.push(`${passengerState.adults} Adult${passengerState.adults > 1 ? 's' : ''}`);
    if (passengerState.children > 0) parts.push(`${passengerState.children} Child${passengerState.children > 1 ? 'ren' : ''}`);
    if (passengerState.infants > 0) parts.push(`${passengerState.infants} Infant${passengerState.infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  return (
    <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300" ref={widgetRef}>
      
      {/* Trip Type Radios */}
      <div className="flex items-center space-x-6 mb-6 text-sm text-gray-300">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "round"} onChange={() => handleTripTypeChange("round")} className="accent-[#ff6b00]" />
          <span className={tripType === "round" ? "text-white font-bold" : ""}>Round Trip</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "oneway"} onChange={() => handleTripTypeChange("oneway")} className="accent-[#ff6b00]" />
          <span className={tripType === "oneway" ? "text-white font-bold" : ""}>One Way</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "multi"} onChange={() => handleTripTypeChange("multi")} className="accent-[#ff6b00]" />
          <span className={tripType === "multi" ? "text-white font-bold" : ""}>Multi City</span>
        </label>
      </div>

      {tripType === "multi" ? (
        // --- MULTI CITY VIEW ---
        <div className="space-y-3 mb-6">
          {multiFlights.map((flight) => (
            <div key={flight.id} className="flex flex-col md:flex-row gap-2 relative">
              <div 
                className={`flex-1 bg-[#1e293b] p-3 rounded border transition relative cursor-pointer ${activePopup === `from-multi-${flight.id}` ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
                onClick={() => setActivePopup(`from-multi-${flight.id}`)}
              >
                <p className="text-xs text-gray-400">From</p>
                <input type="text" value={flight.from} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
                {activePopup === `from-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'from', val)} />}
              </div>

              <div 
                className={`flex-1 bg-[#1e293b] p-3 rounded border transition relative cursor-pointer ${activePopup === `to-multi-${flight.id}` ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
                onClick={() => setActivePopup(`to-multi-${flight.id}`)}
              >
                <p className="text-xs text-gray-400">To</p>
                <input type="text" value={flight.to} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
                {activePopup === `to-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'to', val)} />}
              </div>

              <div 
                className={`flex-1 bg-[#1e293b] p-3 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === `date-multi-${flight.id}` ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
                onClick={() => setActivePopup(`date-multi-${flight.id}`)}
              >
                <div>
                  <p className="text-xs text-gray-400">Depart</p>
                  <input type="text" value={formatDisplayDate(flight.date) || "Select Date"} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
                </div>
                <CalendarIcon size={16} className="text-gray-400"/>
                {activePopup === `date-multi-${flight.id}` && (
                  <CalendarPopup activePopup={activePopup} departDate={null} returnDate={null} tripType="multi" multiFlights={multiFlights} onSelect={handleCalendarSelect} />
                )}
              </div>

              {multiFlights.length > 2 && (
                <button onClick={() => removeMultiFlight(flight.id)} className="p-3 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition flex items-center justify-center">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}

          {multiFlights.length < 5 && (
            <button onClick={addMultiFlight} className="text-[#ff6b00] font-bold text-sm flex items-center space-x-1 hover:underline mt-2">
              <Plus size={16} /> <span>Add another flight</span>
            </button>
          )}
        </div>
      ) : (
        // --- ROUND TRIP & ONE WAY VIEW ---
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative">
          <div 
            className={`bg-[#1e293b] p-3 rounded border transition relative cursor-pointer ${activePopup === 'from-main' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
            onClick={() => setActivePopup("from-main")}
          >
            <p className="text-xs text-gray-400">From</p>
            <input type="text" value={fromValue} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
            {activePopup === "from-main" && <DestinationPopup onSelect={(val) => { setFromValue(val); setActivePopup(null); }} />}
          </div>
          
          <div className="absolute left-1/2 top-[22%] -translate-x-1/2 -translate-y-1/2 bg-[#111827] border border-gray-700 rounded-full p-1 z-[50] hidden md:block text-gray-400 hover:text-white cursor-pointer hover:border-[#ff6b00] transition"
               onClick={(e) => { e.stopPropagation(); const temp = fromValue; setFromValue(toValue); setToValue(temp); }}>
            <ArrowLeftRight size={14} />
          </div>

          <div 
            className={`bg-[#1e293b] p-3 rounded border transition relative cursor-pointer ${activePopup === 'to-main' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
            onClick={() => setActivePopup("to-main")}
          >
            <p className="text-xs text-gray-400">To</p>
            <input type="text" value={toValue} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
            {activePopup === "to-main" && <DestinationPopup onSelect={(val) => { setToValue(val); setActivePopup(null); }} />}
          </div>

          <div 
            className={`bg-[#1e293b] p-3 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === 'depart' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
            onClick={() => setActivePopup("depart")}
          >
            <div>
              <p className="text-xs text-gray-400">Depart</p>
              <input type="text" value={formatDisplayDate(departDate) || "Select Date"} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
            </div>
            <CalendarIcon size={16} className="text-gray-400"/>
            {activePopup === "depart" && (
              <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
            )}
          </div>

          <div 
            className={`bg-[#1e293b] p-3 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === 'return' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
            onClick={() => setActivePopup("return")}
          >
            <div>
              <p className="text-xs text-gray-400">Return</p>
              <input 
                type="text" 
                value={formatDisplayDate(returnDate)} 
                placeholder={tripType === 'oneway' ? "Tap to add return date" : "Select Date"} 
                readOnly 
                className={`w-full bg-transparent font-semibold outline-none mt-1 pointer-events-none ${!returnDate ? 'text-gray-500' : 'text-white'}`} 
              />
            </div>
            <CalendarIcon size={16} className="text-gray-400"/>
            {activePopup === "return" && (
              <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
            )}
          </div>
        </div>
      )}

      {/* Dynamic Passenger & Class Input */}
      <div className="mb-6 relative">
        <div 
          className={`bg-[#1e293b] p-3 rounded border flex justify-between items-center transition cursor-pointer ${activePopup === 'passengers' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
          onClick={() => setActivePopup(activePopup === "passengers" ? null : "passengers")}
        >
          <div>
            <p className="text-xs text-gray-400">Travellers & Class</p>
            <div className="mt-1 flex flex-col">
               <div className="flex items-baseline space-x-2">
                 <span className="text-white font-bold text-lg">{getTotalPassengers()}</span>
                 <span className="text-white font-semibold text-sm">Traveller{getTotalPassengers() > 1 ? 's' : ''}</span>
               </div>
               <span className="text-[#ff6b00] text-xs font-medium mt-0.5">
                 {getDetailedPassengerText()} • {getTravelClassText()}
               </span>
            </div>
          </div>
          <Users size={18} className="text-gray-400"/>
        </div>
        
        {activePopup === "passengers" && (
          <PassengerPopup 
            passengerState={passengerState} 
            setPassengerState={setPassengerState}
            onClose={() => setActivePopup(null)}
          />
        )}
      </div>

      <button 
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-md font-bold text-lg flex items-center justify-center space-x-2 transition mt-auto shadow-lg shadow-[#ff6b00]/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Plane size={20} className={isSearching ? "animate-pulse" : ""} /> 
        <span>{isSearching ? "SEARCHING FLIGHTS..." : "SEARCH FLIGHTS"}</span>
      </button>
    </div>
  );
}