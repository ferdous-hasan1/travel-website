"use client";

import Link from "next/link";
import { Plane, Building, Hotel, FileText } from "lucide-react";

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0b0f19] text-gray-400 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-3">
        <Link href="/flights" className="flex flex-col items-center text-[#ff6b00]">
          <Plane size={20} />
          <span className="text-xs mt-1 font-semibold">Flights</span>
        </Link>
        <Link href="/hajj-umrah" className="flex flex-col items-center hover:text-white transition">
          <Building size={20} />
          <span className="text-xs mt-1">Hajj</span>
        </Link>
        <Link href="/hotels" className="flex flex-col items-center hover:text-white transition">
          <Hotel size={20} />
          <span className="text-xs mt-1">Hotels</span>
        </Link>
        <Link href="/packages" className="flex flex-col items-center hover:text-white transition">
          <FileText size={20} />
          <span className="text-xs mt-1">Packages</span>
        </Link>
      </div>
    </div>
  );
}