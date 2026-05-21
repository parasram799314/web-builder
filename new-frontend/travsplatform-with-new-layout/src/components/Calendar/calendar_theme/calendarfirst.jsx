import React, { useState, useMemo, useEffect } from "react";
import { usePageContext } from "../../../context/PageContext";
import { ALL_HOLIDAYS, MONTHS, DAYS, COUNTRY_OPTIONS, getFlagUrl } from "../../../data/holidays";
import SearchableSelect from "../../Common/SearchableSelect";
import heroTravel from "../../../assets/hero-bg.webp";

const fmt = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function ProfessionalCalendar({ 
  selectedCountries = ["india"], 
  isAdmin = false,
  viewDate: propViewDate,
  setViewDate: propSetViewDate,
}) {
  const ctx = usePageContext?.();
  const pageData = ctx?.pageData || {};
  const themeColor = pageData.themeColor || "#E8960C";

  const [internalViewDate, setInternalViewDate] = useState(new Date());
  const viewDate = propViewDate || internalViewDate;
  const setViewDate = propSetViewDate || setInternalViewDate;

  const [dynamicHolidays, setDynamicHolidays] = useState({});
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [hoveredDate, setHoveredDate] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const countries = isAdmin && ctx ? ctx.pageData?.countries || ["india"] : selectedCountries;
  const [hostCountry, setHostCountry] = useState(countries[0] || "india");
  const [visitCountries, setVisitCountries] = useState(
    countries.slice(1, 2).length > 0 ? [countries[1]] : []
  );

  const activeCountries = Array.from(new Set([hostCountry, ...visitCountries]));
  const selectedCalendars = pageData?.selectedCalendars || ["full", "long"];
  const COUNTRY_COLORS = ["#E8960C", "#3B82F6", "#10B981", "#8B5CF6", "#F43F5E"];

  const todayStr = fmt(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // Fetch holidays from Backend
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
        console.error("Failed to fetch holidays from API:", err);
      }
      setLoadingHolidays(false);
    };

    if (activeCountries.length > 0) {
      fetchHolidays();
    }
  }, [JSON.stringify(activeCountries), year]);

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const tempCells = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--)
      tempCells.push({
        day: prevMonthDays - i,
        current: false,
        dateStr: fmt(year, month - 1, prevMonthDays - i),
      });
    
    // Current month's days
    for (let d = 1; d <= daysInMonth; d++)
      tempCells.push({ day: d, current: true, dateStr: fmt(year, month, d) });
    
    // Next month's leading days
    const remaining = 7 - (tempCells.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++)
        tempCells.push({ day: i, current: false, dateStr: fmt(year, month + 1, i) });
    }

    return tempCells;
  }, [year, month]);

  const isOffDay = (dateStr, countryKey) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const holiday = dynamicHolidays[countryKey]?.[dateStr] || ALL_HOLIDAYS[countryKey]?.[dateStr];
    return { isOff: isWeekend || !!holiday, holiday };
  };

  const yearlyBreaks = useMemo(() => {
    const monthsWithBreaks = [];
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      let streaks = [];
      let currentStreak = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = fmt(year, m, d);
        const { isOff, holiday } = isOffDay(dStr, hostCountry);
        if (isOff) {
          currentStreak.push({ date: d, dateStr: dStr, holiday });
        } else {
          if (currentStreak.length >= 3) streaks.push([...currentStreak]);
          currentStreak = [];
        }
      }
      if (currentStreak.length >= 3) streaks.push(currentStreak);
      
      if (streaks.length > 0) {
        monthsWithBreaks.push({
          monthIdx: m,
          monthName: MONTHS[m],
          streaks
        });
      }
    }
    return monthsWithBreaks;
  }, [hostCountry, year, dynamicHolidays]);

  return (
    <div className="flex flex-col items-center gap-0">
      {/* === CONTROLS BAR (Moved to Top) === */}
      <div className="w-full bg-white border border-gray-200 rounded-t-xl px-4 py-2.5 flex flex-wrap items-center gap-3 border-b-0"
        style={{ borderTop: `4px solid ${themeColor}` }}>
        
        {/* Month + Year + Today */}
        <div className="flex items-center gap-2">
          <select value={month} onChange={e => setViewDate(new Date(year, +e.target.value, 1))}
            className="text-[11px] font-medium bg-gray-50 border border-gray-200 rounded-md px-2 py-1 cursor-pointer focus:outline-none">
            {MONTHS.map((mn, i) => <option key={mn} value={i}>{mn.slice(0,3)}</option>)}
          </select>
          <select value={year} onChange={e => setViewDate(new Date(+e.target.value, month, 1))}
            className="text-[11px] font-medium bg-gray-50 border border-gray-200 rounded-md px-2 py-1 cursor-pointer focus:outline-none">
            {[2026,2027,2028].map(y => <option key={y}>{y}</option>)}
          </select>
          <button onClick={() => setViewDate(new Date())}
            className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all">
            Today
          </button>
        </div>

        <div className="w-px h-5 bg-gray-200" />

        {/* Host Country */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: themeColor }}>Host</span>
          <SearchableSelect options={COUNTRY_OPTIONS.filter(o => !visitCountries.includes(o.key))}
            value={hostCountry} onChange={setHostCountry} compact />
        </div>

        <div className="w-px h-5 bg-gray-200" />

        {/* Visit Countries */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Visit</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {visitCountries.map((vk, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md pl-1.5 pr-1 py-0.5">
                <SearchableSelect options={COUNTRY_OPTIONS.filter(o => o.key !== hostCountry && !visitCountries.filter((_,j)=>j!==i).includes(o.key))}
                  value={vk} onChange={val => { const n=[...visitCountries]; n[i]=val; setVisitCountries(n); }} compact />
                <button onClick={() => setVisitCountries(visitCountries.filter((_,j)=>j!==i))}
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm leading-none">×</button>
              </div>
            ))}
            {visitCountries.length < 4 && (
              <button onClick={() => {
                const av = COUNTRY_OPTIONS.find(o => !activeCountries.includes(o.key));
                if(av) setVisitCountries([...visitCountries, av.key]);
              }}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 text-lg font-light transition-all">+</button>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Tab Switcher + Loader */}
        {loadingHolidays && <div className="w-3.5 h-3.5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />}
        {selectedCalendars.length > 1 && (
          <div className="flex bg-gray-100 p-0.5 rounded-lg">
            {[["calendar","Calendar"],["long","Breaks"]].map(([t,l]) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wide rounded-md transition-all ${
                  activeTab === t ? "text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
                style={activeTab===t ? { background: themeColor } : {}}>
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* === DESK CALENDAR CARD === */}
      <div className="w-full rounded-b-xl overflow-hidden border border-gray-200 bg-gray-100">
        
        {/* Spiral Row */}
        <div className="flex items-center justify-center gap-[18px] h-5 bg-gray-200 border-b border-gray-300">
          {Array(14).fill(0).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-white border border-gray-300" />
          ))}
        </div>

        {/* Top: Travel Agent Banner Style Photo Area */}
        <div className="flex bg-white" style={{ minHeight: 160 }}>
          {/* Main Hero: Family/Traveler */}
          <div className="flex-[2] relative overflow-hidden group">
            <img 
              src="/assets/hero-travel.webp" 
              alt="Happy Family Travel" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-end p-4">
              <div className="text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-orange-400">Your Trusted Partner</p>
                <h3 className="text-xl font-black leading-none uppercase italic">Explore the World</h3>
              </div>
            </div>
          </div>

          {/* Side Thumbnails: Destinations */}
          <div className="flex-1 flex flex-col border-l border-white">
            <div className="flex-1 relative overflow-hidden border-b border-white">
              <img src="/assets/dest-beach.webp" alt="Beach" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex-1 relative overflow-hidden">
              <img src="/assets/dest-mountains.webp" alt="Mountains" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

          {/* Month Highlight */}
          <div className="w-32 flex flex-col items-center justify-center gap-1 px-3"
            style={{ background: themeColor }}>
            <span className="text-white text-lg font-black uppercase tracking-widest">
              {MONTHS[month].slice(0,3)}
            </span>
            <span className="text-white font-black leading-none" style={{ fontSize: 44 }}>
              {String(month + 1).padStart(2, "0")}
            </span>
            <div className="w-10 h-0.5 bg-white/50 my-1" />
            <span className="text-white/80 font-bold text-xs tracking-wide">{year}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        {activeTab === "calendar" && (
          <div className="bg-white px-4 pb-4 pt-2"
            style={{ borderTop: `2px solid ${themeColor}` }}>
            <div className={`grid gap-6 ${
              activeCountries.length === 1 ? "grid-cols-1" :
              activeCountries.length === 2 ? "grid-cols-2" : "grid-cols-2"
            }`}>
              {activeCountries.map((ck, cIdx) => {
                const co = COUNTRY_OPTIONS.find(c => c.key === String(ck).toLowerCase());
                const flagUrl = getFlagUrl(co?.code);
                const cColor = COUNTRY_COLORS[cIdx] || themeColor;
                
                // User Request: Separate countries with bg change or distinct look
                const bgStyle = cIdx % 2 === 0 
                  ? { background: `linear-gradient(to bottom, white, ${cColor}08)` }
                  : { background: `linear-gradient(to bottom, white, #f8fafc)` };

                return (
                  <div key={ck} className="rounded-xl border border-gray-100 shadow-sm p-4 transition-all hover:shadow-md"
                    style={bgStyle}>
                    {/* Country Header */}
                    <div className="flex items-center gap-1.5 mb-3 pb-2"
                      style={{ borderBottom: `2.5px solid ${cColor}40` }}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-gray-50">
                        {flagUrl ? (
                          <img src={flagUrl} className="w-5 h-5 object-contain" alt="" />
                        ) : (
                          <span className="text-sm">🏳️</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-[0.15em] leading-none mb-1"
                          style={{ color: cColor }}>{co?.label || ck}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Monthly Holiday View</span>
                      </div>
                      <div className="flex-1" />
                      {ck === hostCountry && (
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700 uppercase tracking-tighter">Host</span>
                      )}
                    </div>
                    {/* Day Labels */}
                    <div className="grid grid-cols-7 mb-2 bg-gray-50/50 rounded-lg py-1">
                      {["S","M","T","W","T","F","S"].map((d, i) => (
                        <div key={i} className="text-center text-[9px] font-black uppercase tracking-tighter"
                          style={{ color: i===0||i===6 ? cColor : "#9ca3af" }}>{d}</div>
                      ))}
                    </div>
                    {/* Cells */}
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((cell, idx) => {
                        const holiday = dynamicHolidays[ck]?.[cell.dateStr] || ALL_HOLIDAYS[ck]?.[cell.dateStr];
                        const isToday = cell.dateStr === todayStr && cell.current;
                        const isHovered = hoveredDate === cell.dateStr && cell.current;
                        const isWknd = [0,6].includes(new Date(cell.dateStr).getDay());
                        return (
                          <div key={idx}
                            onMouseEnter={() => cell.current && setHoveredDate(cell.dateStr)}
                            onMouseLeave={() => setHoveredDate(null)}
                            className={`flex flex-col items-center justify-start min-h-[38px] rounded-md p-0.5 cursor-pointer transition-all ${
                              !cell.current ? "opacity-25" : isHovered ? "bg-orange-50" : ""
                            }`}>
                            <span className="flex w-6 h-6 items-center justify-center rounded-full text-[11px] font-semibold"
                              style={{
                                background: isToday ? cColor : holiday && cell.current ? `${cColor}22` : "transparent",
                                color: isToday ? "#fff" : holiday && cell.current ? cColor : isWknd && cell.current ? cColor : "#374151"
                              }}>
                              {cell.day}
                            </span>
                            {holiday && cell.current && (
                              <span className="text-[7px] text-center leading-tight mt-0.5 text-gray-400 line-clamp-2 w-full px-0.5">
                                {holiday.name}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Breaks Tab */}
        {activeTab === "long" && (
          <div className="bg-white px-4 pb-4 pt-3" style={{ borderTop: `2px solid ${themeColor}` }}>
             <div 
              className="overflow-y-auto pr-2 space-y-6" 
              style={{ 
                maxHeight: '400px', 
              }}
            >
              {yearlyBreaks.length > 0 ? yearlyBreaks.map((monthData, midx) => (
                <div key={midx} className="space-y-3">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] border-l-2 pl-2" style={{ borderColor: themeColor }}>
                    {monthData.monthName}
                  </h4>
                  <div className="grid gap-3">
                    {monthData.streaks.map((streak, i) => (
                      <div key={i} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col gap-2 hover:border-orange-200 transition-colors group">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200 uppercase tracking-tighter">
                            {streak.length} Days Break
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 italic">
                            {streak[0].date} {monthData.monthName.slice(0,3)} - {streak[streak.length-1].date} {monthData.monthName.slice(0,3)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                           {streak.filter(s => s.holiday).map((s, hidx) => (
                             <span key={hidx} className="text-[9px] font-bold py-0.5 px-1.5 rounded bg-orange-100 text-orange-700">
                                {s.holiday.name}
                             </span>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                   <p className="text-sm text-gray-400 font-medium italic">No long breaks (3+ days) found for this year.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
