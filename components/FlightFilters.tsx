"use client";

export default function FlightFilters() {
  return (
    <div className="w-full">
      {/* Search Summary Box */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-gray-900 mb-1">Search summary</h3>
        <p className="text-sm text-gray-600 mb-4">Get a quick overview of how the number of stops affects prices for your search</p>
        <button className="w-full flex items-center justify-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded transition">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          View summary
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <p className="text-sm text-gray-500">Showing 101 results</p>
      </div>

      {/* Stops */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Stops</h3>
        <div className="space-y-4">
          <label className="flex items-start justify-between cursor-pointer group">
            <div className="flex items-center">
              <input type="radio" name="stops" defaultChecked className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Any</span>
                <span className="block text-sm text-gray-500">From INR6,932.00</span>
              </div>
            </div>
            <span className="text-sm text-gray-900">101</span>
          </label>
          <label className="flex items-start justify-between cursor-pointer group">
            <div className="flex items-center">
              <input type="radio" name="stops" className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Direct only</span>
                <span className="block text-sm text-gray-500">From INR7,016.42</span>
              </div>
            </div>
            <span className="text-sm text-gray-900">21</span>
          </label>
          <label className="flex items-start justify-between cursor-pointer group">
            <div className="flex items-center">
              <input type="radio" name="stops" className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">1 stop max</span>
                <span className="block text-sm text-gray-500">From INR6,932.00</span>
              </div>
            </div>
            <span className="text-sm text-gray-900">95</span>
          </label>
        </div>
      </div>

      {/* Airlines */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Airlines</h3>
        <div className="space-y-4">
          {[
            { name: "IndiGo", count: 43 },
            { name: "Air India", count: 51 },
            { name: "Akasa Air", count: 10 },
            { name: "Air India Express", count: 12 },
          ].map((airline, i) => (
            <label key={i} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-3 text-sm font-medium text-gray-900">{airline.name}</span>
              </div>
              <span className="text-sm text-gray-900">{airline.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Flight Times */}
      <div className="mb-8">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Flight times</h3>
        
        <p className="font-bold text-sm text-gray-900 mb-3">Departs Netaji Subhash Chandra Bose International Airport</p>
        <div className="space-y-3 mb-6">
          {[
            { time: "12:00 AM–5:59 AM", count: 3 },
            { time: "6:00 AM–11:59 AM", count: 37 },
            { time: "12:00 PM–5:59 PM", count: 38 },
            { time: "6:00 PM–11:59 PM", count: 23 },
          ].map((slot, i) => (
            <label key={i} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-3 text-sm font-medium text-gray-900">{slot.time}</span>
              </div>
              <span className="text-sm text-gray-900">{slot.count}</span>
            </label>
          ))}
        </div>

        <p className="font-bold text-sm text-gray-900 mb-3">Arrives to Delhi International Airport</p>
        <div className="space-y-3">
          {[
            { time: "12:00 AM–5:59 AM", count: 7 },
            { time: "6:00 AM–11:59 AM", count: 17 },
            { time: "12:00 PM–5:59 PM", count: 37 },
            { time: "6:00 PM–11:59 PM", count: 40 },
          ].map((slot, i) => (
            <label key={i} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-3 text-sm font-medium text-gray-900">{slot.time}</span>
              </div>
              <span className="text-sm text-gray-900">{slot.count}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}