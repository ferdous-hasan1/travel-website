"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import DestinationPopup from "./DestinationPopup";
import CalendarPopup from "./CalendarPopup";
import PassengerPopup from "./PassengerPopup";

// --- Date Formatting Helpers for the new UI ---
const formatDay = (date: Date | null) => (date ? date.getDate().toString() : "--");
const formatMonthYear = (date: Date | null) => {
  if (!date) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]}'${date.getFullYear().toString().slice(2)}`;
};
const formatWeekday = (date: Date | null) => {
  if (!date) return "";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

// --- City Formatting Helpers ---
const getCityName = (val: string) => val.split(" (")[0] || val;
const getAirportCode = (val: string) => val.includes("(") ? val.split(" (")[1].replace(")", "") : val;

export default function FlightSearch() {
  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">("oneway");

  const [fromValue, setFromValue] = useState("New Delhi (DEL)");
  const [toValue, setToValue] = useState("Bengaluru (BLR)");
  const [departDate, setDepartDate] = useState<Date | null>(new Date(2026, 5, 10)); // June 10, 2026
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const [passengerState, setPassengerState] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "Economy/Premium Economy"
  });

  const [multiFlights, setMultiFlights] = useState([
    { id: 1, from: "New Delhi (DEL)", to: "Bengaluru (BLR)", date: new Date(2026, 5, 10) },
    { id: 2, from: "Bengaluru (BLR)", to: "Dubai (DXB)", date: new Date(2026, 5, 15) }
  ]);

  const [activePopup, setActivePopup] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Click Outside logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trip Type Handlers
  const handleTripTypeChange = (type: "round" | "oneway" | "multi") => {
    setTripType(type);
    if (type === "oneway") setReturnDate(null);
  };

  // Multi-City Handlers
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

  // Calendar Logic
  const handleCalendarSelect = (date: Date) => {
    if (activePopup === "depart") {
      if (tripType === "oneway") {
        setDepartDate(date);
        setActivePopup(null);
      } else if (!departDate || (departDate && returnDate) || date < departDate) {
        setDepartDate(date);
        setReturnDate(null);
      } else {
        setReturnDate(date);
        setActivePopup(null);
      }
    } else if (activePopup === "return") {
      if (departDate && date >= departDate) {
        setReturnDate(date);
        setActivePopup(null);
        if (tripType === "oneway") setTripType("round"); // Auto-switch to round trip
      }
    } else if (activePopup?.startsWith("date-multi-")) {
      const id = parseInt(activePopup.split("-")[2]);
      updateMultiFlight(id, "date", date);
      setActivePopup(null);
    }
  };

  const getTotalPassengers = () => passengerState.adults + passengerState.children + passengerState.infants;

  return (
    <div className="bg-white text-black p-4 md:p-6 rounded-lg shadow-xl w-full max-w-6xl mx-auto -mt-10 relative z-10 border border-gray-200" ref={widgetRef}>
      
      {/* Trip Type Radio Buttons */}
      <div className="flex flex-wrap items-center space-x-6 mb-6 text-sm font-medium">
        <label className={`flex items-center space-x-2 cursor-pointer px-3 py-1 rounded-full transition ${tripType === "oneway" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-blue-500"}`}>
          <input type="radio" name="trip" checked={tripType === "oneway"} onChange={() => handleTripTypeChange("oneway")} className="accent-blue-600" />
          <span>One Way</span>
        </label>
        <label className={`flex items-center space-x-2 cursor-pointer px-3 py-1 rounded-full transition ${tripType === "round" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-blue-500"}`}>
          <input type="radio" name="trip" checked={tripType === "round"} onChange={() => handleTripTypeChange("round")} className="accent-blue-600" />
          <span>Round Trip</span>
        </label>
        <label className={`flex items-center space-x-2 cursor-pointer px-3 py-1 rounded-full transition ${tripType === "multi" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-blue-500"}`}>
          <input type="radio" name="trip" checked={tripType === "multi"} onChange={() => handleTripTypeChange("multi")} className="accent-blue-600" />
          <span>Multi City</span>
        </label>
        <div className="ml-auto text-gray-500 hidden md:block">
          Book International and Domestic Flights
        </div>
      </div>

      {/* Inputs Section */}
      {tripType === "multi" ? (
        // Multi-City View 
        <div className="space-y-4">
          {multiFlights.map((flight, index) => (
            <div key={flight.id} className="flex flex-col md:flex-row gap-0 border border-gray-300 rounded-lg relative">
              
              <div className={`flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer rounded-tl-lg rounded-bl-lg transition ${activePopup === `from-multi-${flight.id}` ? "bg-blue-50" : "hover:bg-gray-50"}`} onClick={() => setActivePopup(`from-multi-${flight.id}`)}>
                <p className="text-sm text-gray-500">From</p>
                <h3 className="text-2xl font-bold mt-1">{getCityName(flight.from)}</h3>
                <p className="text-xs text-gray-500 truncate mt-1">{getAirportCode(flight.from)} Airport</p>
                {activePopup === `from-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'from', val)} />}
              </div>

              <div className={`flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer transition ${activePopup === `to-multi-${flight.id}` ? "bg-blue-50" : "hover:bg-gray-50"}`} onClick={() => setActivePopup(`to-multi-${flight.id}`)}>
                <p className="text-sm text-gray-500">To</p>
                <h3 className="text-2xl font-bold mt-1">{getCityName(flight.to)}</h3>
                <p className="text-xs text-gray-500 truncate mt-1">{getAirportCode(flight.to)} Airport</p>
                {activePopup === `to-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'to', val)} />}
              </div>

              <div className={`flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer transition ${activePopup === `date-multi-${flight.id}` ? "bg-blue-50" : "hover:bg-gray-50"}`} onClick={() => setActivePopup(`date-multi-${flight.id}`)}>
                <p className="text-sm text-gray-500 flex items-center">Departure <ChevronDown className="ml-1" size={14}/></p>
                <h3 className="text-2xl font-bold mt-1">{formatDay(flight.date)} <span className="text-lg font-normal">{formatMonthYear(flight.date)}</span></h3>
                <p className="text-xs text-gray-500 mt-1">{formatWeekday(flight.date) || "Select Date"}</p>
                {activePopup === `date-multi-${flight.id}` && (
                  <CalendarPopup activePopup={activePopup} departDate={null} returnDate={null} tripType="multi" multiFlights={multiFlights} onSelect={handleCalendarSelect} />
                )}
              </div>

              {/* Remove Button for extra flights */}
              {multiFlights.length > 2 && (
                <div className="flex items-center justify-center p-4">
                  <button onClick={() => removeMultiFlight(flight.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Flight Button */}
          {multiFlights.length < 5 && (
            <button onClick={addMultiFlight} className="text-blue-600 font-bold text-sm flex items-center space-x-1 hover:underline mt-2">
              <Plus size={16} /> <span>Add another flight</span>
            </button>
          )}
        </div>
      ) : (
        // Main Inputs Grid (One Way & Round Trip)
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-gray-300 rounded-lg">
          
          {/* From */}
          <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer rounded-tl-lg rounded-bl-lg transition ${activePopup === "from-main" ? "bg-blue-50" : "hover:bg-blue-50"}`} onClick={() => setActivePopup("from-main")}>
            <p className="text-sm text-gray-500">From</p>
            <h3 className="text-3xl font-bold mt-1">{getCityName(fromValue)}</h3>
            <p className="text-xs text-gray-500 truncate mt-1">{getAirportCode(fromValue)} Airport</p>
            
            {/* Swap Button */}
            <div 
              className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 z-[40] hidden md:block shadow-sm text-blue-500 hover:bg-gray-50"
              onClick={(e) => { e.stopPropagation(); const temp = fromValue; setFromValue(toValue); setToValue(temp); }}
            >
              <ArrowLeftRight size={16} />
            </div>

            {activePopup === "from-main" && <DestinationPopup onSelect={(val) => { setFromValue(val); setActivePopup(null); }} />}
          </div>

          {/* To */}
          <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer transition ${activePopup === "to-main" ? "bg-blue-50" : "hover:bg-blue-50"}`} onClick={() => setActivePopup("to-main")}>
            <p className="text-sm text-gray-500">To</p>
            <h3 className="text-3xl font-bold mt-1">{getCityName(toValue)}</h3>
            <p className="text-xs text-gray-500 truncate mt-1">{getAirportCode(toValue)} Airport</p>
            {activePopup === "to-main" && <DestinationPopup onSelect={(val) => { setToValue(val); setActivePopup(null); }} />}
          </div>

          {/* Departure */}
          <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer transition ${activePopup === "depart" ? "bg-blue-50" : "hover:bg-blue-50"}`} onClick={() => setActivePopup("depart")}>
            <p className="text-sm text-gray-500 flex items-center">Departure <ChevronDown className="ml-1" size={14}/></p>
            <h3 className="text-3xl font-bold mt-1">{formatDay(departDate)} <span className="text-xl font-normal">{formatMonthYear(departDate)}</span></h3>
            <p className="text-xs text-gray-500 mt-1">{formatWeekday(departDate) || "Select Date"}</p>
            
            {activePopup === "depart" && (
              <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
            )}
          </div>

          {/* Return */}
          <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-300 relative cursor-pointer flex flex-col justify-center transition ${activePopup === "return" ? "bg-blue-50" : "hover:bg-blue-50"}`} onClick={() => setActivePopup("return")}>
            <p className="text-sm text-gray-500 flex items-center">Return <ChevronDown className="ml-1" size={14}/></p>
            
            {tripType === "oneway" || !returnDate ? (
               <p className="text-sm text-gray-400 mt-2 leading-tight">Tap to add a return date for bigger discounts</p>
            ) : (
               <>
                 <h3 className="text-3xl font-bold mt-1">{formatDay(returnDate)} <span className="text-xl font-normal">{formatMonthYear(returnDate)}</span></h3>
                 <p className="text-xs text-gray-500 mt-1">{formatWeekday(returnDate)}</p>
               </>
            )}

            {activePopup === "return" && (
              <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
            )}
          </div>

          {/* Travellers & Class */}
          <div className={`p-4 relative cursor-pointer rounded-tr-lg rounded-br-lg transition ${activePopup === "passengers" ? "bg-blue-50" : "hover:bg-blue-50"}`} onClick={() => setActivePopup("passengers")}>
            <p className="text-sm text-gray-500 flex items-center">Travellers & Class <ChevronDown className="ml-1" size={14}/></p>
            <h3 className="text-3xl font-bold mt-1">{getTotalPassengers()} <span className="text-xl font-normal">Traveller{getTotalPassengers() > 1 ? 's' : ''}</span></h3>
            <p className="text-xs text-gray-500 mt-1">{passengerState.travelClass}</p>

            {activePopup === "passengers" && (
              <PassengerPopup passengerState={passengerState} setPassengerState={setPassengerState} onClose={() => setActivePopup(null)} />
            )}
          </div>
        </div>
      )}

      {/* Special Fares */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold w-full md:w-auto mb-2 md:mb-0 mr-2">SPECIAL<br/>FARES</span>
        <button className="border border-blue-500 bg-blue-50 rounded px-3 py-2 text-left">
          <div className="text-sm font-semibold text-blue-600">Regular</div>
          <div className="text-xs text-gray-500">Regular fares</div>
        </button>
        <button className="border border-gray-300 rounded px-3 py-2 text-left hover:bg-gray-50">
          <div className="text-sm font-semibold">Student</div>
          <div className="text-xs text-gray-500">Extra discounts/baggage</div>
        </button>
        <button className="border border-gray-300 rounded px-3 py-2 text-left hover:bg-gray-50">
          <div className="text-sm font-semibold">Armed Forces</div>
          <div className="text-xs text-gray-500">Up to ₹ 600 off</div>
        </button>
        <button className="border border-gray-300 rounded px-3 py-2 text-left hover:bg-gray-50">
          <div className="text-sm font-semibold">Senior Citizen</div>
          <div className="text-xs text-gray-500">Up to ₹ 600 off</div>
        </button>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mt-8 -mb-10">
        <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xl font-bold py-3 px-16 rounded-full shadow-lg hover:shadow-xl transition-all uppercase tracking-wide border-4 border-white">
          Search
        </button>
      </div>
    </div>
  );
}

// Mini component for chevron
function ChevronDown({ className, size }: { className?: string; size: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}