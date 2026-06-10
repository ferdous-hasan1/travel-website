"use client";
import { useState } from "react";

interface PassengerState {
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
}

interface PassengerPopupProps {
  passengerState: PassengerState;
  setPassengerState: React.Dispatch<React.SetStateAction<PassengerState>>;
  onClose: () => void;
}

export default function PassengerPopup({ passengerState, setPassengerState, onClose }: PassengerPopupProps) {
  const [localState, setLocalState] = useState<PassengerState>(passengerState);

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPassengerState(localState);
    onClose();
  };

  const SelectionRow = ({ 
    title, 
    subtitle, 
    value, 
    type,
    options
  }: { 
    title: string, 
    subtitle: string, 
    value: number, 
    type: 'adults' | 'children' | 'infants',
    options: number[]
  }) => (
    <div className="mb-4">
      <div className="mb-1.5">
        <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
        <p className="text-[11px] text-gray-500 leading-tight">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((num) => (
          <button
            key={num}
            onClick={(e) => {
              e.stopPropagation();
              if (type === 'adults' && num === 0) return;
              if (type === 'infants' && num > localState.adults) return;
              setLocalState({ ...localState, [type]: num });
            }}
            className={`w-8 h-8 md:w-9 md:h-9 rounded border text-sm font-semibold flex items-center justify-center transition-colors
              ${value === num 
                ? 'bg-[#0071c2] text-white border-[#0071c2]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0071c2]'
              }`}
          >
            {num}
          </button>
        ))}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 md:w-9 md:h-9 rounded border border-gray-300 bg-white text-gray-700 text-sm font-semibold flex items-center justify-center cursor-not-allowed opacity-50"
        >
          {type === 'adults' ? '>9' : '>6'}
        </button>
      </div>
    </div>
  );

  const classes = ["Economy/Premium Economy", "Premium Economy", "Business", "First Class"];

  return (
    <div 
      className="absolute top-full right-0 mt-2 w-[340px] md:w-[560px] bg-white text-black border border-gray-300 rounded-xl shadow-2xl z-[60] p-5 animate-in fade-in zoom-in-95 duration-200 cursor-default"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <SelectionRow 
          title="ADULTS (12y +)" 
          subtitle="on the day of travel" 
          value={localState.adults} 
          type="adults"
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9]} 
        />
        
        <div className="hidden md:block"></div>

        <SelectionRow 
          title="CHILDREN (2y - 12y)" 
          subtitle="on the day of travel" 
          value={localState.children} 
          type="children"
          options={[0, 1, 2, 3, 4, 5, 6]} 
        />

        <SelectionRow 
          title="INFANTS (below 2y)" 
          subtitle="on the day of travel" 
          value={localState.infants} 
          type="infants"
          options={[0, 1, 2, 3, 4, 5, 6]} 
        />
      </div>

      <div className="mt-1 mb-5">
        <h4 className="font-bold text-gray-800 text-sm mb-2">CHOOSE TRAVEL CLASS</h4>
        <div className="flex flex-wrap border border-gray-300 rounded-md overflow-hidden w-fit shadow-sm">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={(e) => {
                e.stopPropagation();
                setLocalState({ ...localState, travelClass: cls });
              }}
              className={`py-1.5 px-3 text-[13px] font-semibold transition-colors border-r last:border-r-0 border-gray-300
                ${localState.travelClass === cls 
                  ? 'bg-[#0071c2] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleApply}
          className="bg-[#0071c2] hover:bg-[#005999] text-white text-sm font-bold py-2 px-8 rounded-full transition-colors shadow-md"
        >
          APPLY
        </button>
      </div>
    </div>
  );
}