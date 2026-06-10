"use client";
import { Briefcase, ChevronDown, Info } from "lucide-react";

// Mock Duffel Offer Type for the props
export interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  owner: { name: string; logo_symbol_url?: string };
  tags?: string[];
  slices: {
    duration: string;
    segments: {
      departing_at: string;
      arriving_at: string;
      origin: { iata_code: string };
      destination: { iata_code: string };
    }[];
  }[];
}

export default function FlightCard({ offer }: { offer: DuffelOffer }) {
  const slice = offer.slices[0];
  const firstSegment = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];

  // Formatting helpers
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const formatDuration = (pt: string) => {
    // Converts Duffel "PT2H20M" to "2h 20m"
    const hours = pt.match(/(\d+)H/);
    const minutes = pt.match(/(\d+)M/);
    return `${hours ? hours[1] + "h" : ""} ${minutes ? minutes[1] + "m" : ""}`.trim();
  };

  const isDirect = slice.segments.length === 1;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4 mb-4">
      {/* Top Tags */}
      {offer.tags && offer.tags.length > 0 && (
        <div className="flex gap-2 mb-4">
          {offer.tags.map((tag, idx) => (
            <span key={idx} className={`text-xs px-2 py-1 rounded font-medium ${tag.includes('Cheapest') ? 'bg-green-100 text-green-800' : 'bg-green-50 border border-green-200 text-green-700'}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        
        {/* Left Side: Flight Details */}
        <div className="flex flex-1 items-center w-full md:w-auto mb-4 md:mb-0">
          <div className="w-10 h-10 mr-4 bg-red-600 rounded-sm flex items-center justify-center text-white font-bold text-xs overflow-hidden">
            {/* Fallback logo if no URL provided */}
            {offer.owner.logo_symbol_url ? (
               <img src={offer.owner.logo_symbol_url} alt={offer.owner.name} className="w-full h-full object-cover" />
            ) : offer.owner.name.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="flex flex-1 items-center justify-between max-w-md">
            {/* Departure */}
            <div className="text-right flex-1">
              <h3 className="text-lg font-bold text-gray-900">{formatTime(firstSegment.departing_at)}</h3>
              <p className="text-sm text-gray-500">{firstSegment.origin.iata_code} · {formatDate(firstSegment.departing_at)}</p>
            </div>

            {/* Timeline Graphic */}
            <div className="px-4 flex flex-col items-center justify-center flex-1">
              <div className="flex items-center w-full relative">
                <div className="w-2 h-2 rounded-full border-2 border-gray-400 bg-white z-10"></div>
                <div className="flex-1 h-[2px] bg-gray-300"></div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded text-white absolute left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDirect ? 'bg-green-700' : 'bg-gray-600'}`}>
                  {isDirect ? 'Direct' : `${slice.segments.length - 1} Stop`}
                </div>
                <div className="flex-1 h-[2px] bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full border-2 border-gray-400 bg-white z-10"></div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{formatDuration(slice.duration)}</span>
            </div>

            {/* Arrival */}
            <div className="text-left flex-1">
              <h3 className="text-lg font-bold text-gray-900">{formatTime(lastSegment.arriving_at)}</h3>
              <p className="text-sm text-gray-500">{lastSegment.destination.iata_code} · {formatDate(lastSegment.arriving_at)}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Price & Actions */}
        <div className="w-full md:w-auto md:min-w-[200px] flex flex-col md:items-end border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
          <div className="flex items-center text-sm text-gray-600 mb-2 font-medium">
             Eco Value
          </div>
          {/* Baggage Icons */}
          <div className="flex gap-2 mb-2">
            <div className="relative">
              <Briefcase size={20} className="text-gray-700" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-gray-900">{offer.total_currency}{Number(offer.total_amount).toLocaleString()}</h2>
            <Info size={16} className="text-gray-400 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between w-full gap-4">
            <button className="text-blue-600 text-sm font-semibold flex items-center hover:underline">
              Fare options <ChevronDown size={16} className="ml-1" />
            </button>
            <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded transition">
              View details
            </button>
          </div>
        </div>

      </div>
      <p className="text-xs text-gray-500 mt-2 md:mt-0">{offer.owner.name}</p>
    </div>
  );
}