// src/components/Calendar/calendar_theme/calendarsecond.jsx
import React, { useState, useMemo, useEffect } from "react";
import { ALL_HOLIDAYS, MONTHS, DAYS, COUNTRY_OPTIONS, getFlagUrl } from "../../../data/holidays";

const fmt = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function SoftCalendar({ 
  selectedCountries = ["india"], 
  isAdmin = false,
  viewDate: propViewDate,
  setViewDate: propSetViewDate,
  hostCountry: propHostCountry,
  themeColor = "#10b981" // Default Emerald
}) {
  const [internalViewDate, setInternalViewDate] = useState(new Date());
  const viewDate = propViewDate || internalViewDate;
  const setViewDate = propSetViewDate || setInternalViewDate;

  const [dynamicHolidays, setDynamicHolidays] = useState({});
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const [hostCountry, setInternalHostCountry] = useState(selectedCountries[0] || "india");
  const [visitCountries, setInternalVisitCountries] = useState(selectedCountries.slice(1, 2).length > 0 ? [selectedCountries[1]] : []);

  const activeCountries = Array.from(new Set([hostCountry, ...visitCountries]));

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoadingHolidays(true);
      try {
        const countriesParam = activeCountries.join(",");
        const response = await fetch(`${API_BASE_URL}/calendar/holidays?countries=${countriesParam}&year=${year}`);
        const data = await response.json();
        if (response.ok && data.holidays) {
          setDynamicHolidays(data.holidays);
        }
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
      }
      setLoadingHolidays(false);
    };

    if (activeCountries.length > 0) fetchHolidays();
  }, [JSON.stringify(activeCountries), year]);

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const tempCells = [];
    for (let i = firstDay - 1; i >= 0; i--)
      tempCells.push({ day: prevMonthDays - i, current: false, dateStr: fmt(year, month - 1, prevMonthDays - i) });
    for (let d = 1; d <= daysInMonth; d++)
      tempCells.push({ day: d, current: true, dateStr: fmt(year, month, d) });
    const remaining = 7 - (tempCells.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++)
        tempCells.push({ day: i, current: false, dateStr: fmt(year, month + 1, i) });
    }
    return tempCells;
  }, [year, month]);

  const todayStr = fmt(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const isOffDay = (dateStr, countryKey) => {
    const holiday = dynamicHolidays[countryKey]?.[dateStr] || ALL_HOLIDAYS[countryKey]?.[dateStr];
    return { holiday };
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
      {/* Soft Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: themeColor }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{MONTHS[month]} {year}</h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Global Travel Planner</p>
          </div>
        </div>

        <div className="flex gap-2">
           <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-white hover:text-emerald-500 hover:shadow-md transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
           </button>
           <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-white hover:text-emerald-500 hover:shadow-md transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
           </button>
        </div>
      </div>

      <div className={`grid gap-8 ${activeCountries.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        {activeCountries.map((ck) => {
          const co = COUNTRY_OPTIONS.find((c) => c.key === String(ck).toLowerCase());
          return (
            <div key={ck} className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xl">{getFlagUrl(co?.code) ? <img src={getFlagUrl(co?.code)} className="w-5 h-5 inline" /> : "🏳️"}</span>
                <span className="text-sm font-black text-gray-700 uppercase tracking-widest">{co?.label}</span>
                {ck === hostCountry && <span className="text-[9px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">HOST</span>}
              </div>

              <div className="bg-gray-50/50 rounded-3xl p-4 border border-gray-100">
                <div className="grid grid-cols-7 mb-3">
                  {["S","M","T","W","T","F","S"].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-gray-300">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {cells.map((cell, idx) => {
                    const { holiday } = isOffDay(cell.dateStr, ck);
                    const isToday = cell.dateStr === todayStr && cell.current;
                    const isHovered = hoveredDate === cell.dateStr && cell.current;
                    
                    return (
                      <div 
                        key={idx}
                        onMouseEnter={() => cell.current && setHoveredDate(cell.dateStr)}
                        onMouseLeave={() => setHoveredDate(null)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all ${
                          !cell.current ? "opacity-0 pointer-events-none" :
                          isHovered ? "bg-white shadow-lg scale-110 text-emerald-600 ring-1 ring-gray-100" :
                          isToday ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" :
                          holiday ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        <span className="text-xs font-bold">{cell.day}</span>
                        {holiday && cell.current && (
                           <span className="absolute mt-5 w-1 h-1 rounded-full bg-emerald-400" />
                        )}
                        {isHovered && holiday && (
                          <div className="absolute -top-10 bg-white px-2 py-1 rounded shadow-lg border border-gray-50 text-[8px] font-black text-gray-800 z-10 whitespace-nowrap">
                            {holiday.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
