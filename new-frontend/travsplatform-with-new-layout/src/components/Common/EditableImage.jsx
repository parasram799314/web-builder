import React, { useState, useRef, useEffect } from "react";

export default function EditableImage({ 
  src, 
  onSave, 
  isAdmin, 
  style = {}, 
  className = "",
  alt = "Image",
  aspectRatio = "auto"
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [tempSrc, setTempSrc] = useState(src);
  const popupRef = useRef(null);

  useEffect(() => {
    setTempSrc(src);
  }, [src]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  if (!isAdmin) {
    return <img src={src} alt={alt} style={style} className={className} />;
  }

  const handleSave = () => {
    onSave(tempSrc);
    setShowPopup(false);
  };

  return (
    <div className={`relative group ${className}`} style={{ ...style, display: 'block' }}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        style={{ cursor: 'pointer' }}
      />
      
      <div 
        onClick={() => setShowPopup(!showPopup)}
        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[9px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1 backdrop-blur-sm z-10"
      >
        <span>📷</span> EDIT
      </div>

      {showPopup && (
        <div 
          ref={popupRef}
          className="absolute top-10 right-0 z-[100] bg-white p-4 rounded-xl shadow-2xl border border-gray-200 w-64 text-left"
        >
          <div className="mb-3">
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Image URL</label>
            <input 
              type="text" 
              value={tempSrc}
              onChange={(e) => setTempSrc(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="https://..."
              autoFocus
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="flex-1 bg-gray-900 text-white border-none py-2 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-black"
            >
              Update
            </button>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-gray-100 text-gray-500 border-none px-3 py-2 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
