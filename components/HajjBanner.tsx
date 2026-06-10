"use client";

export default function HajjBanner() {
  return (
    <section className="bg-[#0b0f19] px-6 md:px-12 pb-16">
      <div className="max-w-7xl mx-auto border border-[#d4af37] rounded-2xl p-8 md:p-12 text-center bg-black relative overflow-hidden">
        <p className="text-[#d4af37] font-bold tracking-widest uppercase mb-2">Special</p>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 uppercase">Hajj & Umrah Packages 2026</h2>
        <p className="text-gray-400 mb-6">Comfortable Stay • Best Service • Affordable Price</p>
        <button className="bg-[#d4af37] text-black font-bold px-8 py-3 rounded-full hover:bg-[#b8962d] transition">
          VIEW PACKAGES
        </button>
      </div>
    </section>
  );
}