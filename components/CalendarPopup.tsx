"use client";
import { useState, useRef, useEffect } from "react";
import { Plane, ArrowLeftRight, Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import DestinationPopup from "./DestinationPopup";
import CalendarPopup from "./CalendarPopup";

const formatDate = (date: Date | null) => {
  if (!date) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
};

export default function FlightSearchWidget() {
  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">("round");
  
  const [fromValue, setFromValue] = useState("New York (JFK)");
  const [toValue, setToValue] = useState("Dubai (DXB)");
  const [departDate, setDepartDate] = useState<Date | null>(new Date(2026, 5, 11));
  const [returnDate, setReturnDate] = useState<Date | null>(new Date(2026, 5, 12));

  const [multiFlights, setMultiFlights] = useState([
    { id: 1, from: "New York (JFK)", to: "Dubai (DXB)", date: new Date(2026, 5, 11) },
    { id: 2, from: "Dubai (DXB)", to: "London (LHR)", date: new Date(2026, 5, 15) }
  ]);

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
        if (tripType === "oneway") setTripType("round");
      }
    } else if (activePopup?.startsWith("date-multi-")) {
      const id = parseInt(activePopup.split("-")[2]);
      updateMultiFlight(id, "date", date);
      setActivePopup(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300" ref={widgetRef}>
      
      <div className="flex items-center space-x-6 mb-6 text-sm text-gray-300">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "round"} onChange={() => setTripType("round")} className="accent-[#ff6b00]" />
          <span className={tripType === "round" ? "text-white font-bold" : ""}>Round Trip</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "oneway"} onChange={() => { setTripType("oneway"); setReturnDate(null); }} className="accent-[#ff6b00]" />
          <span className={tripType === "oneway" ? "text-white font-bold" : ""}>One Way</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" checked={tripType === "multi"} onChange={() => setTripType("multi")} className="accent-[#ff6b00]" />
          <span className={tripType === "multi" ? "text-white font-bold" : ""}>Multi City</span>
        </label>
      </div>

      {tripType === "multi" ? (
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
                  <input type="text" value={formatDate(flight.date) || "Select Date"} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
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
              <input type="text" value={formatDate(departDate) || "Select Date"} readOnly className={`w-full bg-transparent font-semibold outline-none mt-1 cursor-pointer pointer-events-none ${!departDate ? 'text-gray-500' : 'text-white'}`} />
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
                value={formatDate(returnDate)} 
                placeholder="Add Return" 
                readOnly 
                className={`w-full bg-transparent font-semibold outline-none mt-1 cursor-pointer pointer-events-none ${!returnDate ? 'text-gray-500' : 'text-white'}`} 
              />
            </div>
            <CalendarIcon size={16} className="text-gray-400"/>
            {activePopup === "return" && (
              <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1e293b] p-3 rounded border border-gray-700 focus-within:border-[#ff6b00] transition">
          <p className="text-xs text-gray-400">Passengers</p>
          <select className="w-full bg-transparent text-white font-semibold outline-none mt-1 appearance-none cursor-pointer">
            <option className="bg-[#1e293b]">1 Passenger</option>
            <option className="bg-[#1e293b]">2 Passengers</option>
          </select>
        </div>
        <div className="bg-[#1e293b] p-3 rounded border border-gray-700 focus-within:border-[#ff6b00] transition">
          <p className="text-xs text-gray-400">Class</p>
          <select className="w-full bg-transparent text-white font-semibold outline-none mt-1 appearance-none cursor-pointer">
            <option className="bg-[#1e293b]">Economy</option>
            <option className="bg-[#1e293b]">Business</option>
          </select>
        </div>
      </div>

      <button className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-md font-bold text-lg flex items-center justify-center space-x-2 transition mt-auto shadow-lg shadow-[#ff6b00]/20">
        <Plane size={20} /> <span>SEARCH FLIGHTS</span>
      </button>
    </div>
  );
}