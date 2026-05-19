import React, { useState } from 'react';
import { usePageContext } from "../../context/PageContext";

const FLIGHTS_DATA = [
  { 
    id: 1, 
    from: { code: "DEL", city: "New Delhi", time: "06:15" }, 
    to: { code: "BOM", city: "Mumbai", time: "08:30" }, 
    price: "₹4,500", 
    date: "24 Apr", 
    airline: "IndiGo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/1200px-IndiGo_Airlines_logo.svg.png",
    duration: "2h 15m",
    stops: "Non-stop",
    class: "Economy",
    color: "#001b94"
  },
  { 
    id: 2, 
    from: { code: "BLR", city: "Bangalore", time: "14:20" }, 
    to: { code: "GOI", city: "Goa", time: "15:45" }, 
    price: "₹3,200", 
    date: "26 Apr", 
    airline: "Air India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Air_India_Logo.svg/1200px-Air_India_Logo.svg.png",
    duration: "1h 25m",
    stops: "Non-stop",
    class: "Economy",
    color: "#ed1c24"
  },
  { 
    id: 3, 
    from: { code: "BOM", city: "Mumbai", time: "22:00" }, 
    to: { code: "DXB", city: "Dubai", time: "23:45" }, 
    price: "₹18,900", 
    date: "02 May", 
    airline: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png",
    duration: "3h 15m",
    stops: "Non-stop",
    class: "Premium Economy",
    color: "#d71921"
  },
  { 
    id: 4, 
    from: { code: "MAA", city: "Chennai", time: "10:10" }, 
    to: { code: "SIN", city: "Singapore", time: "16:40" }, 
    price: "₹12,400", 
    date: "15 May", 
    airline: "Singapore Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png",
    duration: "4h 00m",
    stops: "Non-stop",
    class: "Economy",
    color: "#ffbd00"
  },
];

function FlightCard({ flight, themeColor, margin = 0 }) {
  const [imgError, setImgError] = useState(false);
  const color = themeColor || "#E8960C";

  // Calculate price with margin
  const basePrice = parseInt(flight.price.replace(/[^\d]/g, ''));
  const finalPrice = Math.round(basePrice * (1 + margin / 100));
  const displayPrice = `₹${finalPrice.toLocaleString('en-IN')}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-4 lg:p-6 transition-all hover:shadow-xl hover:border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        
        {/* Airline Info */}
        <div className="flex items-center gap-4 lg:w-48 shrink-0">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl p-2">
             {!imgError ? (
               <img 
                src={flight.logo} 
                alt={flight.airline} 
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
               />
             ) : (
               <span className="text-[10px] font-black" style={{ color: flight.color }}>{flight.airline[0]}</span>
             )}
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-bold text-gray-900 leading-tight">{flight.airline}</span>
             <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{flight.class}</span>
          </div>
        </div>

        {/* Timeline strip */}
        <div className="flex flex-1 items-center justify-between gap-4 lg:gap-10">
          <div className="flex flex-col min-w-[60px]">
             <span className="text-xl font-bold text-gray-900">{flight.from.time}</span>
             <span className="text-xs font-bold text-gray-400">{flight.from.code}</span>
          </div>

          <div className="flex flex-col flex-1 items-center relative">
             <span className="text-[10px] font-medium text-gray-400 mb-1">{flight.duration}</span>
             <div className="relative w-full flex items-center justify-center">
                <div className="h-[1px] bg-gray-200 w-full relative">
                   <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300" />
                   <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300" />
                   <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-gray-400">✈</div>
                </div>
             </div>
             <span className="text-[9px] font-bold text-green-600 mt-1 uppercase">{flight.stops}</span>
          </div>

          <div className="flex flex-col items-end min-w-[60px]">
             <span className="text-xl font-bold text-gray-900">{flight.to.time}</span>
             <span className="text-xs font-bold text-gray-400">{flight.to.code}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between lg:justify-end lg:gap-8 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-8">
          <div className="flex flex-col lg:items-end">
             <span className="text-2xl font-bold text-gray-900" style={{ color: color }}>{displayPrice}</span>
             <span className="text-[10px] text-gray-400 font-medium">per adult</span>
          </div>
          <button 
            className="px-6 py-2.5 rounded-xl font-bold text-white text-xs transition-all hover:brightness-110 active:scale-95 shadow-sm" 
            style={{ background: color }}
          >
             Book
          </button>
        </div>
      </div>

      {/* Subtle details bar */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4 text-[10px] text-gray-400 font-medium">
         <div className="flex items-center gap-1.5">
            <span>🍱</span> Meals
         </div>
         <div className="flex items-center gap-1.5">
            <span>🧳</span> 25KG
         </div>
         <div className="flex items-center gap-1.5 ml-auto text-orange-500 font-bold">
            Only 2 seats left!
         </div>
      </div>
    </div>
  );
}

export default function FlightSection({ themeColor, margin: propMargin }) {
  const context = usePageContext();
  const color = themeColor || "#E8960C";
  const margin = propMargin !== undefined ? propMargin : (context?.pageData?.flightMargin || 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Mini Search Summary */}
      <div className="mb-6 flex items-center justify-between bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
          <span className="flex items-center gap-1.5">📅 24 Apr 2026</span>
          <span className="w-px h-4 bg-gray-200" />
          <span className="flex items-center gap-1.5">👤 1 Traveler</span>
        </div>
        <button className="text-xs font-bold" style={{ color }}>Modify</button>
      </div>

      {/* Flight List */}
      <div className="flex flex-col gap-3">
        {FLIGHTS_DATA.map((flight) => (
          <FlightCard key={flight.id} flight={flight} themeColor={color} margin={margin} />
        ))}
      </div>
    </div>
  );
}