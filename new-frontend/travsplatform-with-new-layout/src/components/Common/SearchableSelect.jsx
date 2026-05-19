import React, { useState, useRef, useEffect } from "react";
import { getFlagUrl } from "../../data/holidays";

const SearchableSelect = ({ options, value, onChange, placeholder = "Search country...", compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  const selectedOption = options.find((opt) => opt.key === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative inline-block ${compact ? "w-28" : "w-44"}`} ref={wrapperRef}>
      <div
        className={`flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors focus-within:ring-2 focus-within:ring-orange-400/20 ${compact ? "px-1.5 py-1" : "px-2.5 py-1.5"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5">
          {selectedOption ? (
            <>
              {selectedOption.code ? (
                <img src={getFlagUrl(selectedOption.code)} alt={selectedOption.label} className="w-3.5 h-3.5 object-contain" />
              ) : (
                <span>{selectedOption.flag}</span>
              )}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <svg
          className={`w-3 h-3 ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto left-0">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
            <input
              type="text"
              className="w-full text-sm p-2 border border-gray-200 rounded md:focus:outline-none focus:ring-1 focus:ring-orange-400"
              placeholder="Type to filter..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.key}
                  className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-3 hover:bg-orange-50 ${
                    value === opt.key ? "bg-orange-100 font-bold text-orange-700" : "text-gray-700"
                  }`}
                  onClick={() => {
                    onChange(opt.key);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt.code ? (
                    <img src={getFlagUrl(opt.code)} alt={opt.label} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="text-lg">{opt.flag}</span>
                  )}
                  <span>{opt.label}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 italic">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
