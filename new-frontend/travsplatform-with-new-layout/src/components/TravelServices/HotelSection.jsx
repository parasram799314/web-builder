import React from 'react';
import { usePageContext } from "../../context/PageContext";

const HOTELS_DATA = [
  { id: 1, name: "Luxury Palms Resort", location: "Goa", price: "₹8,500/night", rating: "4.8", img: "/assets/dest-beach.jpg" },
  { id: 2, name: "Mountain View Lodge", location: "Manali", price: "₹5,200/night", rating: "4.6", img: "/assets/dest-mountains.jpg" },
  { id: 3, name: "The Heritage Inn", location: "Udaipur", price: "₹12,000/night", rating: "4.9", img: "/assets/dest-culture.jpg" },
  { id: 4, name: "Azure Bay Hotel", location: "Andaman", price: "₹7,800/night", rating: "4.7", img: "/assets/gokarna.jpg" },
];

export default function HotelSection({ themeColor, margin: propMargin }) {
  const context = usePageContext();
  const color = themeColor || "#E8960C";
  const margin = propMargin !== undefined ? propMargin : (context?.pageData?.hotelMargin || 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Popular Hotels</h3>
          <p className="text-sm text-gray-500">Handpicked stays for you</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: color }}>
          Explore Stays
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOTELS_DATA.map((hotel) => {
          // Calculate price with margin
          const basePrice = parseInt(hotel.price.replace(/[^\d]/g, ''));
          const finalPrice = Math.round(basePrice * (1 + margin / 100));
          const displayPrice = `₹${finalPrice.toLocaleString('en-IN')}/night`;

          return (
            <div key={hotel.id} className="group flex flex-col rounded-xl overflow-hidden border border-gray-100 hover:border-orange-100 hover:shadow-lg transition-all">
              <div className="h-32 relative">
                <img src={hotel.img} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                  ⭐ {hotel.rating}
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-gray-800 text-sm">{hotel.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{hotel.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-black" style={{ color }}>{displayPrice}</span>
                  <button className="text-[10px] font-black text-white px-3 py-1.5 rounded-md transition-all" style={{ background: color }}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
