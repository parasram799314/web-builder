import React from "react";

export default function LibrarySelector({ packages, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-black text-gray-800">Add from Library</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Your Saved Packages</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {packages.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400 italic">No packages found in your library.</p>
            </div>
          ) : (
            packages.map((pkg, idx) => (
              <button
                key={idx}
                onClick={() => { onSelect(pkg); onClose(); }}
                className="w-full group flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-orange-400 hover:bg-orange-50/50 transition-all text-left"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-0.5">{pkg.country}</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{pkg.title}</p>
                  <p className="text-[10px] text-gray-400 truncate">{pkg.description || pkg.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all">
                  +
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select a package to add it to your email</p>
        </div>
      </div>
    </div>
  );
}
