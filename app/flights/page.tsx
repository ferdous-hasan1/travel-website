"use client";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Plane, Info, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import FlightCard, { DuffelOffer } from "@/components/FlightCard";
import FlightFilters from "@/components/FlightFilters";
import FlightSearchBar from "@/components/FlightSearchBar";
import Header from "@/components/Header";

// --- UTILITY: Parse Duffel Duration ("PT2H20M") to total minutes ---
const parseDurationToMinutes = (ptString: string) => {
  if (!ptString) return 0;
  const match = ptString.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
};

// Calculate total duration across all slices in an offer
const getTotalDuration = (offer: DuffelOffer) => {
  return offer.slices.reduce((sum, slice) => sum + parseDurationToMinutes(slice.duration), 0);
};

function FlightsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("Best");
  const [offers, setOffers] = useState<DuffelOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const tripType = searchParams.get("tripType");
        const origin = searchParams.get("origin");
        const destination = searchParams.get("destination");
        const departDate = searchParams.get("departDate");
        const returnDate = searchParams.get("returnDate");
        const adults = parseInt(searchParams.get("adults") || "1");
        const children = parseInt(searchParams.get("children") || "0");
        const infants = parseInt(searchParams.get("infants") || "0");
        const travelClass = searchParams.get("travelClass") || "Economy";

        let cabinClass = "economy";
        if (travelClass === "Premium Economy") cabinClass = "premium_economy";
        if (travelClass === "Business") cabinClass = "business";
        if (travelClass === "First Class") cabinClass = "first";

        const slices = [];
        
        if (tripType === "multi") {
          const slicesParam = searchParams.get("slices");
          if (slicesParam) {
            try {
              const decodedSlices = JSON.parse(slicesParam);
              slices.push(...decodedSlices.map((s: any) => ({
                origin: s.origin,
                destination: s.destination,
                departure_date: s.date
              })));
            } catch (e) { console.error(e) }
          }
        } else {
          if (origin && destination && departDate) {
            slices.push({
              origin,
              destination,
              departure_date: departDate
            });
            if (tripType === "round" && returnDate) {
              slices.push({
                origin: destination,
                destination: origin,
                departure_date: returnDate
              });
            }
          }
        }

        const passengers = [];
        for (let i = 0; i < adults; i++) passengers.push({ type: "adult" });
        for (let i = 0; i < children; i++) passengers.push({ type: "child" });
        for (let i = 0; i < infants; i++) passengers.push({ type: "infant_without_seat" });

        if (slices.length === 0) {
          setIsLoading(false);
          return;
        }

        const payload = {
          data: {
            slices,
            passengers,
            cabin_class: cabinClass
          }
        };

        const res = await fetch("/api/duffel/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch offers");
        }

        const json = await res.json();
        if (json.data && json.data.offers) {
          setOffers(json.data.offers);
        } else {
          setOffers([]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [searchParams]);

  // Reset pagination when tab or offers change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, offers]);

  // --- SORTING LOGIC ---
  const sortedOffers = useMemo(() => {
    if (!offers || offers.length === 0) return [];

    const offersCopy = [...offers];

    if (activeTab === "Cheapest") {
      return offersCopy.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
    }

    if (activeTab === "Fastest") {
      return offersCopy.sort((a, b) => getTotalDuration(a) - getTotalDuration(b));
    }

    if (activeTab === "Best") {
      // Calculate min values to normalize the score
      const minPrice = Math.min(...offersCopy.map(o => parseFloat(o.total_amount)));
      const minDuration = Math.min(...offersCopy.map(o => getTotalDuration(o)));

      return offersCopy.sort((a, b) => {
        const priceA = parseFloat(a.total_amount);
        const durA = getTotalDuration(a);
        const scoreA = (priceA / (minPrice || 1)) + (durA / (minDuration || 1));

        const priceB = parseFloat(b.total_amount);
        const durB = getTotalDuration(b);
        const scoreB = (priceB / (minPrice || 1)) + (durB / (minDuration || 1));

        return scoreA - scoreB;
      });
    }

    return offersCopy;
  }, [offers, activeTab]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(sortedOffers.length / ITEMS_PER_PAGE);
  const currentOffers = sortedOffers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const parseDateString = (dateStr: string | null) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return null;
  };

  const initialProps = {
    initialTripType: (searchParams.get("tripType") as "round" | "oneway" | "multi") || "round",
    initialFrom: searchParams.get("origin") || "New York (JFK)",
    initialTo: searchParams.get("destination") || "Dubai (DXB)",
    initialDepartDate: parseDateString(searchParams.get("departDate")),
    initialReturnDate: parseDateString(searchParams.get("returnDate")),
    initialAdults: parseInt(searchParams.get("adults") || "1"),
    initialChildren: parseInt(searchParams.get("children") || "0"),
    initialInfants: parseInt(searchParams.get("infants") || "0"),
    initialTravelClass: searchParams.get("travelClass") || "Economy"
  };

  return (
    <>
      {/* Search Bar Container (Blue Banner Background) */}
      <div className="bg-[#003b95] pb-8 pt-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <FlightSearchBar {...initialProps} />
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 lg:px-12 py-8 flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* Left Sidebar: Filters */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <FlightFilters />
        </aside>

        {/* Right Section: Sorting & Results */}
        <section className="w-full lg:w-3/4">
          
          {/* Sorting Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg flex overflow-hidden mb-4 shadow-sm">
            {["Best", "Cheapest", "Fastest"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-semibold transition flex justify-center items-center ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {tab} {tab === "Best" && <Info size={16} className="ml-1 text-gray-400" />}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
                <Loader2 className="animate-spin text-[#006ce4] mb-4" size={48} />
                <p className="text-gray-500 font-medium">Searching hundreds of airlines...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-200">
                <p className="font-bold text-lg mb-2">Oops! Something went wrong.</p>
                <p>{error}</p>
              </div>
            ) : currentOffers.length === 0 ? (
              <div className="bg-white p-12 rounded-lg text-center border border-gray-200 shadow-sm">
                <Plane className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-500">We couldn't find any flights matching your criteria. Try adjusting your dates or destinations.</p>
              </div>
            ) : (
              <>
                {currentOffers.map((offer) => (
                  <FlightCard key={offer.id} offer={offer} />
                ))}

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4 mt-8 pb-8">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <span className="text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Reusing your global header */}
      <Header />
      
      <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
        <FlightsContent />
      </Suspense>
    </div>
  );
}