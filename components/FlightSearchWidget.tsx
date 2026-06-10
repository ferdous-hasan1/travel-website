"use client";
import { useState, useRef, useEffect } from "react";
import { 
  Plane, 
  ArrowLeftRight, 
  Calendar as CalendarIcon, 
  Search,
  Plus,
  Trash2,
  Users
} from "lucide-react";
import DestinationPopup from "./DestinationPopup";
import CalendarPopup from "./CalendarPopup";
import PassengerPopup from "./PassengerPopup";

// Generated list of 200 Popular Airports
const airportData = [
  "Kolkata Netaji Subhash Chandra Bose Airport (CCU)",
  "New Delhi Indira Gandhi International Airport (DEL)",
  "Mumbai Chhatrapati Shivaji Maharaj International Airport (BOM)",
  "Bengaluru Kempegowda International Airport (BLR)",
  "Chennai International Airport (MAA)",
  "Hyderabad Rajiv Gandhi International Airport (HYD)",
  "Ahmedabad Sardar Vallabhbhai Patel International Airport (AMD)",
  "Pune International Airport (PNQ)",
  "Goa Dabolim Airport (GOI)",
  "Goa Manohar International Airport (GOX)",
  "Kochi Cochin International Airport (COK)",
  "Thiruvananthapuram International Airport (TRV)",
  "Lucknow Chaudhary Charan Singh Airport (LKO)",
  "Jaipur International Airport (JAI)",
  "Guwahati Lokpriya Gopinath Bordoloi Airport (GAU)",
  "Bhubaneswar Biju Patnaik Airport (BBI)",
  "Patna Jay Prakash Narayan Airport (PAT)",
  "Chandigarh International Airport (IXC)",
  "Amritsar Sri Guru Ram Dass Jee International Airport (ATQ)",
  "Srinagar Sheikh ul-Alam International Airport (SXR)",
  "New York John F. Kennedy International Airport (JFK)",
  "New York LaGuardia Airport (LGA)",
  "Newark Liberty International Airport (EWR)",
  "Atlanta Hartsfield-Jackson International Airport (ATL)",
  "Los Angeles International Airport (LAX)",
  "Chicago O'Hare International Airport (ORD)",
  "Chicago Midway International Airport (MDW)",
  "Dallas/Fort Worth International Airport (DFW)",
  "Denver International Airport (DEN)",
  "San Francisco International Airport (SFO)",
  "Seattle-Tacoma International Airport (SEA)",
  "Las Vegas Harry Reid International Airport (LAS)",
  "Orlando International Airport (MCO)",
  "Miami International Airport (MIA)",
  "Charlotte Douglas International Airport (CLT)",
  "Phoenix Sky Harbor International Airport (PHX)",
  "Houston George Bush Intercontinental Airport (IAH)",
  "Houston William P. Hobby Airport (HOU)",
  "Boston Logan International Airport (BOS)",
  "Minneapolis-Saint Paul International Airport (MSP)",
  "Fort Lauderdale-Hollywood International Airport (FLL)",
  "Detroit Metropolitan Wayne County Airport (DTW)",
  "Philadelphia International Airport (PHL)",
  "Salt Lake City International Airport (SLC)",
  "Washington Dulles International Airport (IAD)",
  "Washington Ronald Reagan National Airport (DCA)",
  "Baltimore/Washington International Airport (BWI)",
  "San Diego International Airport (SAN)",
  "Tampa International Airport (TPA)",
  "Honolulu Daniel K. Inouye International Airport (HNL)",
  "Portland International Airport (PDX)",
  "Austin-Bergstrom International Airport (AUS)",
  "Dallas Love Field (DAL)",
  "Nashville International Airport (BNA)",
  "San Jose International Airport (SJC)",
  "St. Louis Lambert International Airport (STL)",
  "Raleigh-Durham International Airport (RDU)",
  "Sacramento International Airport (SMF)",
  "London Heathrow Airport (LHR)",
  "London Gatwick Airport (LGW)",
  "London Stansted Airport (STN)",
  "London Luton Airport (LTN)",
  "Paris Charles de Gaulle Airport (CDG)",
  "Paris Orly Airport (ORY)",
  "Amsterdam Airport Schiphol (AMS)",
  "Frankfurt Airport (FRA)",
  "Munich Airport (MUC)",
  "Berlin Brandenburg Airport (BER)",
  "Istanbul Airport (IST)",
  "Istanbul Sabiha Gökçen International Airport (SAW)",
  "Madrid Adolfo Suárez Madrid-Barajas Airport (MAD)",
  "Barcelona El Prat Airport (BCN)",
  "Rome Leonardo da Vinci-Fiumicino Airport (FCO)",
  "Milan Malpensa Airport (MXP)",
  "Zurich Airport (ZRH)",
  "Geneva Airport (GVA)",
  "Vienna International Airport (VIE)",
  "Dublin Airport (DUB)",
  "Copenhagen Airport (CPH)",
  "Oslo Gardermoen Airport (OSL)",
  "Stockholm Arlanda Airport (ARN)",
  "Helsinki-Vantaa Airport (HEL)",
  "Lisbon Portela Airport (LIS)",
  "Athens International Airport (ATH)",
  "Brussels Airport (BRU)",
  "Warsaw Chopin Airport (WAW)",
  "Prague Václav Havel Airport (PRG)",
  "Budapest Ferenc Liszt International Airport (BUD)",
  "Moscow Sheremetyevo International Airport (SVO)",
  "Moscow Domodedovo International Airport (DME)",
  "Moscow Vnukovo International Airport (VKO)",
  "Saint Petersburg Pulkovo Airport (LED)",
  "Dubai International Airport (DXB)",
  "Dubai Al Maktoum International Airport (DWC)",
  "Abu Dhabi International Airport (AUH)",
  "Doha Hamad International Airport (DOH)",
  "Riyadh King Khalid International Airport (RUH)",
  "Jeddah King Abdulaziz International Airport (JED)",
  "Muscat International Airport (MCT)",
  "Kuwait International Airport (KWI)",
  "Bahrain International Airport (BAH)",
  "Tokyo Haneda Airport (HND)",
  "Tokyo Narita International Airport (NRT)",
  "Osaka Kansai International Airport (KIX)",
  "Osaka Itami Airport (ITM)",
  "Nagoya Chubu Centrair International Airport (NGO)",
  "Fukuoka Airport (FUK)",
  "Sapporo New Chitose Airport (CTS)",
  "Beijing Capital International Airport (PEK)",
  "Beijing Daxing International Airport (PKX)",
  "Shanghai Pudong International Airport (PVG)",
  "Shanghai Hongqiao International Airport (SHA)",
  "Guangzhou Baiyun International Airport (CAN)",
  "Shenzhen Bao'an International Airport (SZX)",
  "Chengdu Shuangliu International Airport (CTU)",
  "Chengdu Tianfu International Airport (TFU)",
  "Hong Kong International Airport (HKG)",
  "Macau International Airport (MFM)",
  "Taipei Taoyuan International Airport (TPE)",
  "Seoul Incheon International Airport (ICN)",
  "Seoul Gimpo International Airport (GMP)",
  "Singapore Changi Airport (SIN)",
  "Kuala Lumpur International Airport (KUL)",
  "Bangkok Suvarnabhumi Airport (BKK)",
  "Bangkok Don Mueang International Airport (DMK)",
  "Phuket International Airport (HKT)",
  "Jakarta Soekarno-Hatta International Airport (CGK)",
  "Bali Ngurah Rai International Airport (DPS)",
  "Manila Ninoy Aquino International Airport (MNL)",
  "Ho Chi Minh City Tân Sơn Nhất International Airport (SGN)",
  "Hanoi Nội Bài International Airport (HAN)",
  "Da Nang International Airport (DAD)",
  "Sydney Kingsford Smith Airport (SYD)",
  "Melbourne Airport (MEL)",
  "Brisbane Airport (BNE)",
  "Perth Airport (PER)",
  "Adelaide Airport (ADL)",
  "Gold Coast Airport (OOL)",
  "Auckland Airport (AKL)",
  "Wellington International Airport (WLG)",
  "Christchurch International Airport (CHC)",
  "Toronto Pearson International Airport (YYZ)",
  "Toronto Billy Bishop Airport (YTZ)",
  "Vancouver International Airport (YVR)",
  "Montreal Pierre Elliott Trudeau International Airport (YUL)",
  "Calgary International Airport (YYC)",
  "Edmonton International Airport (YEG)",
  "Ottawa Macdonald-Cartier International Airport (YOW)",
  "Halifax Stanfield International Airport (YHZ)",
  "Winnipeg James Armstrong Richardson International Airport (YWG)",
  "Mexico City International Airport (MEX)",
  "Cancún International Airport (CUN)",
  "Guadalajara International Airport (GDL)",
  "Monterrey International Airport (MTY)",
  "São Paulo Guarulhos International Airport (GRU)",
  "São Paulo Congonhas Airport (CGH)",
  "Rio de Janeiro Galeão International Airport (GIG)",
  "Rio de Janeiro Santos Dumont Airport (SDU)",
  "Brasília International Airport (BSB)",
  "Bogotá El Dorado International Airport (BOG)",
  "Lima Jorge Chávez International Airport (LIM)",
  "Santiago Arturo Merino Benítez International Airport (SCL)",
  "Buenos Aires Ministro Pistarini International Airport (EZE)",
  "Buenos Aires Jorge Newbery Airpark (AEP)",
  "Panama City Tocumen International Airport (PTY)",
  "San José Juan Santamaría International Airport (SJO)",
  "Quito Mariscal Sucre International Airport (UIO)",
  "Johannesburg O.R. Tambo International Airport (JNB)",
  "Cape Town International Airport (CPT)",
  "Durban King Shaka International Airport (DUR)",
  "Cairo International Airport (CAI)",
  "Casablanca Mohammed V International Airport (CMN)",
  "Marrakesh Menara Airport (RAK)",
  "Addis Ababa Bole International Airport (ADD)",
  "Nairobi Jomo Kenyatta International Airport (NBO)",
  "Lagos Murtala Muhammed International Airport (LOS)",
  "Accra Kotoka International Airport (ACC)",
  "Dakar Blaise Diagne International Airport (DSS)",
  "Algiers Houari Boumediene Airport (ALG)",
  "Tunis-Carthage International Airport (TUN)",
  "Mauritius Sir Seewoosagur Ramgoolam International Airport (MRU)",
  "Malé Velana International Airport (MLE)",
  "Colombo Bandaranaike International Airport (CMB)",
  "Kathmandu Tribhuvan International Airport (KTM)",
  "Dhaka Hazrat Shahjalal International Airport (DAC)",
  "Karachi Jinnah International Airport (KHI)",
  "Lahore Allama Iqbal International Airport (LHE)",
  "Islamabad International Airport (ISB)",
  "Kabul International Airport (KBL)",
  "Tashkent International Airport (TAS)",
  "Almaty International Airport (ALA)"
];

// Fallback suggestions when search is empty
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

export default function FlightSearchWidget() {
  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">("round");
  
  // Standard Flight States
  const [fromValue, setFromValue] = useState("New York (JFK)");
  const [toValue, setToValue] = useState("Dubai (DXB)");
  const [departDate, setDepartDate] = useState("11 Jun 26");
  const [returnDate, setReturnDate] = useState("12 Jun 26");

  // Passenger State
  const [passengerState, setPassengerState] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "Economy"
  });

  const getTotalPassengers = () => passengerState.adults + passengerState.children + passengerState.infants;
  
  const getTravelClassText = () => {
    if (passengerState.travelClass === "Economy/Premium Economy") return "Economy";
    return passengerState.travelClass;
  };

  const getDetailedPassengerText = () => {
    const parts = [];
    if (passengerState.adults > 0) parts.push(`${passengerState.adults} Adult${passengerState.adults > 1 ? 's' : ''}`);
    if (passengerState.children > 0) parts.push(`${passengerState.children} Child${passengerState.children > 1 ? 'ren' : ''}`);
    if (passengerState.infants > 0) parts.push(`${passengerState.infants} Infant${passengerState.infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  // Multi-City States
  const [multiFlights, setMultiFlights] = useState([
    { id: 1, from: "New York (JFK)", to: "Dubai (DXB)", date: "11 Jun 26" },
    { id: 2, from: "Dubai (DXB)", to: "London (LHR)", date: "15 Jun 26" }
  ]);

  const [activePopup, setActivePopup] = useState<string | null>(null);
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

  const handleReturnDateSelect = (date: string) => {
    setReturnDate(date);
    if (tripType === "oneway") {
      setTripType("round"); 
    }
    setActivePopup(null);
  };

  const addMultiFlight = () => {
    if (multiFlights.length < 5) {
      const lastFlight = multiFlights[multiFlights.length - 1];
      setMultiFlights([
        ...multiFlights, 
        { id: Date.now(), from: lastFlight.to, to: "", date: "" }
      ]);
    }
  };

  const removeMultiFlight = (id: number) => {
    setMultiFlights(multiFlights.filter(f => f.id !== id));
  };

  const updateMultiFlight = (id: number, field: string, value: string) => {
    setMultiFlights(multiFlights.map(f => f.id === id ? { ...f, [field]: value } : f));
    setActivePopup(null);
  };

  // --- REUSABLE POPUPS ---

  const DestinationPopup = ({ onSelect }: { onSelect: (val: string) => void }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter airport data based on input
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
            // User is typing -> Show filtered search results
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
            // Search is empty -> Show default suggestions categories
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
  };

  const CalendarPopup = ({ onSelect }: { onSelect: (val: string) => void }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 w-[340px] md:w-[600px] bg-white text-black border border-gray-300 rounded-xl shadow-2xl z-[60] p-4 animate-in fade-in zoom-in-95 duration-200 cursor-default">
      <div className="flex justify-between items-center mb-4 px-2">
        <h4 className="font-bold text-lg">June 2026</h4>
        <h4 className="font-bold text-lg hidden md:block">July 2026</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-semibold mb-2">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold">
            {[...Array(30)].map((_, i) => {
              const day = i + 1;
              const isSelected = day === 11 || day === 12;
              return (
                <button 
                  key={day} 
                  onClick={(e) => { e.stopPropagation(); onSelect(`${day} Jun 26`); }}
                  className={`py-2 rounded transition-colors ${isSelected ? 'bg-[#0071c2] text-white' : 'hover:bg-gray-100'}`}
                >
                  {day}
                  {isSelected && <span className="block text-[8px] font-normal">₹18k</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-semibold mb-2">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold">
             {[...Array(31)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); onSelect(`${i+1} Jul 26`); }}
                  className="py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  {i + 1}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER ---

  return (
    <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300" ref={widgetRef}>
      
      <div className="flex items-center space-x-6 mb-6 text-sm text-gray-300">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="tripType" checked={tripType === "round"} onChange={() => setTripType("round")} className="accent-[#ff6b00]" />
          <span className={tripType === "round" ? "text-white font-bold" : ""}>Round Trip</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="tripType" checked={tripType === "oneway"} onChange={() => { setTripType("oneway"); setReturnDate(""); }} className="accent-[#ff6b00]" />
          <span className={tripType === "oneway" ? "text-white font-bold" : ""}>One Way</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="tripType" checked={tripType === "multi"} onChange={() => setTripType("multi")} className="accent-[#ff6b00]" />
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
                  <input type="text" value={flight.date || "Select Date"} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
                </div>
                <CalendarIcon size={16} className="text-gray-400"/>
                {activePopup === `date-multi-${flight.id}` && <CalendarPopup onSelect={(val) => updateMultiFlight(flight.id, 'date', val)} />}
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
              <input type="text" value={departDate} readOnly className="w-full bg-transparent text-white font-semibold outline-none mt-1 cursor-pointer pointer-events-none" />
            </div>
            <CalendarIcon size={16} className="text-gray-400"/>
            {activePopup === "depart" && <CalendarPopup onSelect={(val) => { setDepartDate(val); setActivePopup(null); }} />}
          </div>

          <div 
            className={`bg-[#1e293b] p-3 rounded border flex justify-between items-center transition relative ${tripType === 'oneway' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${activePopup === 'return' ? 'border-[#ff6b00]' : 'border-gray-700 hover:border-gray-500'}`}
            onClick={() => tripType !== "oneway" && setActivePopup("return")}
          >
            <div>
              <p className="text-xs text-gray-400">Return</p>
              <input 
                type="text" 
                value={returnDate} 
                placeholder="Add Return" 
                readOnly 
                className={`w-full bg-transparent font-semibold outline-none mt-1 pointer-events-none ${!returnDate ? 'text-gray-500' : 'text-white'}`} 
              />
            </div>
            <CalendarIcon size={16} className="text-gray-400"/>
            {activePopup === "return" && tripType !== "oneway" && <CalendarPopup onSelect={handleReturnDateSelect} />}
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

      <button className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-md font-bold text-lg flex items-center justify-center space-x-2 transition mt-auto shadow-lg shadow-[#ff6b00]/20">
        <Plane size={20} /> <span>SEARCH FLIGHTS</span>
      </button>
    </div>
  );
}