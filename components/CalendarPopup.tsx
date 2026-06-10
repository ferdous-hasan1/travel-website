"use client";

// Baseline Current Date (June 10, 2026)
const TODAY = new Date(2026, 5, 10);
TODAY.setHours(0, 0, 0, 0);

const isSameDay = (d1: Date | null, d2: Date | null) => {
  if (!d1 || !d2) return false;
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

const isBetween = (target: Date, start: Date | null, end: Date | null) => {
  if (!target || !start || !end) return false;
  return target > start && target < end;
};

interface Flight {
  id: number;
  from: string;
  to: string;
  date: Date | null;
}

interface CalendarPopupProps {
  activePopup: string | null;
  departDate: Date | null;
  returnDate: Date | null;
  tripType: "round" | "oneway" | "multi";
  multiFlights: Flight[];
  onSelect: (date: Date) => void;
}

export default function CalendarPopup({ 
  activePopup, 
  departDate, 
  returnDate, 
  tripType, 
  multiFlights, 
  onSelect 
}: CalendarPopupProps) {
  
  const generateMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const monthsData = [
    { label: "June 2026", days: generateMonthDays(2026, 5) },
    { label: "July 2026", days: generateMonthDays(2026, 6) }
  ];

  const getDayClasses = (date: Date) => {
    const multiDate = activePopup?.startsWith("date-multi-") 
      ? multiFlights.find(f => f.id === parseInt(activePopup.split("-")[2]))?.date 
      : null;

    // 1. Past Dates
    if (date < TODAY) return "text-gray-300 cursor-not-allowed bg-transparent";
    
    // 2. Invalid Return Dates (before departure)
    if (activePopup === "return" && departDate && date < departDate) {
      return "text-gray-300 cursor-not-allowed bg-transparent";
    }

    // 3. Selected Dates (Depart, Return, or Multi)
    if (isSameDay(date, departDate) || isSameDay(date, returnDate) || (multiDate && isSameDay(date, multiDate))) {
      return "bg-[#0071c2] text-white font-bold shadow-md rounded-full z-10 relative";
    }
    
    // 4. In-Between Dates (Round Trip ONLY)
    if (tripType === "round" && isBetween(date, departDate, returnDate)) {
      return "bg-[#0071c2]/10 text-[#0071c2] font-semibold rounded-none";
    }

    // 5. Default Hover State
    return "hover:bg-gray-100 text-gray-800 rounded-full";
  };

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 w-[340px] md:w-[600px] bg-white text-black border border-gray-300 rounded-xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200 cursor-default"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside calendar from bubbling up and closing it
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {monthsData.map((month, idx) => (
          <div key={idx} className={idx === 1 ? "hidden md:block" : ""}>
            <h4 className="font-bold text-lg mb-4 text-center">{month.label}</h4>
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-gray-500 font-bold mb-2 uppercase tracking-wider">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            {/* Added gap-y-1 to prevent the background hover/between colors from touching vertically */}
            <div className="grid grid-cols-7 text-center text-sm gap-y-1">
              {month.days.map((date, i) => {
                if (!date) return <div key={i} className="py-2"></div>;
                
                // Helper to check if a date is between depart and return (used for styling edges)
                const isMid = tripType === "round" && isBetween(date, departDate, returnDate);
                
                return (
                  <div key={i} className={`relative flex justify-center items-center ${isMid ? 'bg-[#0071c2]/10' : ''}`}>
                    <button 
                      disabled={date < TODAY || (activePopup === "return" && departDate !== null && date < departDate)}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(date); }}
                      className={`h-9 w-full flex items-center justify-center transition-colors ${getDayClasses(date)}`}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}