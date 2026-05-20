// src/components/Calendar/Calendar.jsx
import React, { useState, useMemo, useEffect } from "react";
import { usePageContext } from "../../context/PageContext";
import { ALL_HOLIDAYS, MONTHS, DAYS, COUNTRY_OPTIONS, getFlagUrl } from "../../data/holidays";
import SearchableSelect from "../Common/SearchableSelect";

import ProfessionalCalendar from "./calendar_theme/calendarfirst";
import SoftCalendar from "./calendar_theme/calendarsecond";

const fmt = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const API_BASE_URL = process.env.REACT_APP_API_URL;

export function ClassicCalendar({ 
  selectedCountries: propCountries, 
  themeColor: propColor,
  isAdmin = false,
  viewDate: propViewDate,
  setViewDate: propSetViewDate,
  visitCountry: propVisitCountry,
  setVisitCountry: propSetVisitCountry,
  calendarTheme: propCalendarTheme
}) {
  const ctx = usePageContext?.();
  const pageData = ctx?.pageData || {};
  
  const countries = propCountries || pageData?.countries || ["india"];
  const themeColor = propColor || pageData?.themeColor || "#E8960C";

  const [internalViewDate, setInternalViewDate] = useState(new Date());
  const viewDate = propViewDate || internalViewDate;
  const setViewDate = propSetViewDate || setInternalViewDate;

  const [hostCountry, setHostCountry] = useState(countries[0] || "india");
  const [visitCountries, setVisitCountries] = useState(countries.slice(1, 2).length > 0 ? [countries[1]] : []);

  const [dynamicHolidays, setDynamicHolidays] = useState({});
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [hoveredDate, setHoveredDate] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = MONTHS[month];

  const activeCountries = Array.from(new Set([hostCountry, ...visitCountries]));
  const selectedCalendars = pageData?.selectedCalendars || ["full", "long"];

  const addVisitCountry = () => {
    if (visitCountries.length < 4) {
      const nextAvailable = COUNTRY_OPTIONS.find(c => !activeCountries.includes(c.key));
      if (nextAvailable) setVisitCountries([...visitCountries, nextAvailable.key]);
    }
  };

  const removeVisitCountry = (index) => {
    setVisitCountries(visitCountries.filter((_, i) => i !== index));
  };

  const updateVisitCountry = (index, val) => {
    const next = [...visitCountries];
    next[index] = val;
    setVisitCountries(next);
  };

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
        if (isOff) currentStreak.push({ date: d, dateStr: dStr, holiday });
        else {
          if (currentStreak.length >= 3) streaks.push([...currentStreak]);
          currentStreak = [];
        }
      }
      if (currentStreak.length >= 3) streaks.push(currentStreak);
      if (streaks.length > 0) monthsWithBreaks.push({ monthIdx: m, monthName: MONTHS[m], streaks });
    }
    return monthsWithBreaks;
  }, [hostCountry, year, dynamicHolidays]);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm min-h-min flex flex-col">
      <div className="flex flex-wrap items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100 shadow-sm">
            <select
              value={month}
              onChange={(e) => setViewDate(new Date(year, parseInt(e.target.value), 1))}
              className="bg-transparent text-[10px] font-black text-gray-800 uppercase tracking-tighter cursor-pointer focus:outline-none py-0.5"
            >
              {MONTHS.map((name, idx) => (
                <option key={name} value={idx}>{name.slice(0, 3)}</option>
              ))}
            </select>
            <div className="w-px h-3 bg-gray-200 mx-0.5" />
            <select
              value={year}
              onChange={(e) => setViewDate(new Date(parseInt(e.target.value), month, 1))}
              className="bg-transparent text-[10px] font-black text-gray-800 uppercase tracking-tighter cursor-pointer focus:outline-none py-0.5"
            >
              {[2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setViewDate(new Date())} className="px-2 py-1.5 rounded-lg border border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 hover:text-gray-600 transition-all shrink-0">Today</button>
        </div>
        <div className="hidden sm:block w-px h-6 bg-gray-200" />
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-yellow-50/80 pl-2 pr-1 py-1 rounded-lg border border-yellow-200 shadow-sm">
            <span className="text-[9px] font-black text-yellow-600 uppercase">H:</span>
            <SearchableSelect options={COUNTRY_OPTIONS.filter(opt => !visitCountries.includes(opt.key))} value={hostCountry} onChange={setHostCountry} compact={true} />
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 pl-2 pr-1 py-1 rounded-lg border border-gray-100">
            <span className="text-[9px] font-black text-gray-400 uppercase">V:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {visitCountries.map((vKey, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white pl-1.5 pr-1 py-0.5 rounded-md border border-gray-200 shadow-sm shrink-0">
                  <SearchableSelect options={COUNTRY_OPTIONS.filter(opt => opt.key !== hostCountry && !visitCountries.filter((_, i) => i !== idx).includes(opt.key))} value={vKey} onChange={(val) => updateVisitCountry(idx, val)} compact={true} />
                  <button onClick={() => removeVisitCountry(idx)} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {visitCountries.length < 4 && (
                <button onClick={addVisitCountry} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-dashed border-gray-300 text-orange-500 hover:border-orange-500 hover:bg-orange-50 transition-all">+ </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {selectedCalendars.length > 1 && (
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab("calendar")} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-tight rounded-md transition-all ${activeTab === "calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}>Calendar</button>
              <button onClick={() => setActiveTab("long")} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-tight rounded-md transition-all ${activeTab === "long" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}>Long Breaks</button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "calendar" ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.slice(0, 3)}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {cells.map((cell, idx) => {
              const { isOff, holiday } = isOffDay(cell.dateStr, hostCountry);
              const visitHolidays = visitCountries.map(v => ({ key: v, holiday: isOffDay(cell.dateStr, v).holiday })).filter(h => h.holiday);
              return (
                <div key={idx} className={`relative min-h-[60px] p-1.5 rounded-xl transition-all border ${cell.current ? "bg-white" : "bg-gray-50/30 opacity-30"} ${isOff ? "border-orange-100" : "border-gray-50"}`}>
                  <span className={`text-xs font-bold ${cell.current ? (isOff ? "text-orange-600" : "text-gray-900") : "text-gray-300"}`}>{cell.day}</span>
                  {cell.current && (
                    <div className="mt-1 space-y-1">
                      {holiday && <div className="text-[8px] font-black text-orange-600 leading-tight uppercase line-clamp-2">{holiday.name}</div>}
                      {visitHolidays.map((v, i) => <div key={i} className="text-[7px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded leading-tight truncate">{v.holiday.name}</div>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-6 py-2">
            {yearlyBreaks.map(m => (
              <div key={m.monthIdx}>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-gray-200" />{m.monthName}
                </h4>
                <div className="grid gap-3">
                  {m.streaks.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200">{s.length} Days Break</span>
                        <span className="text-[9px] font-bold text-gray-400 italic">{s[0].date} {m.monthName.slice(0,3)} - {s[s.length-1].date} {m.monthName.slice(0,3)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.filter(day => day.holiday).map((day, hidx) => <span key={hidx} className="text-[9px] font-bold py-0.5 px-1.5 rounded bg-orange-100 text-orange-700">{day.holiday.name}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Calendar(props) {
  const ctx = usePageContext?.();
  const theme = props.calendarTheme || ctx?.pageData?.calendarTheme || "classic";
  if (theme === "professional") return <ProfessionalCalendar {...props} />;
  if (theme === "soft") return <SoftCalendar {...props} />;
  return <ClassicCalendar {...props} />;
}
