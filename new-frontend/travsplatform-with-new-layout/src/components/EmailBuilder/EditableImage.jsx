import React, { useState, useRef, useEffect } from "react";

export default function EditableImage({ 
  src, 
  onSave, 
  isAdmin, 
  style = {}, 
  className = "",
  alt = "Image"
}) {
  if (!isAdmin) {
    return <img src={src} alt={alt} style={style} className={className} />;
  }

  return (
    <EditableImageInner 
      src={src}
      onSave={onSave}
      style={style}
      className={className}
      alt={alt}
    />
  );
}

function EditableImageInner({ src, onSave, style, className, alt }) {
  const [showPopup, setShowPopup] = useState(false);
  const [tempSrc, setTempSrc] = useState(src);
  const popupRef = useRef(null);

  useEffect(() => {
    setTempSrc(src);
  }, [src]);

  // Handle clicking outside the popup
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

  const handleSave = () => {
    onSave(tempSrc);
    setShowPopup(false);
  };

  return (
    <div style={{ position: 'relative', display: 'block', zIndex: showPopup ? 110 : 1 }}>
      <img 
        src={src} 
        alt={alt} 
        style={{ ...style, cursor: 'pointer' }} 
        className={className}
        onClick={() => setShowPopup(!showPopup)}
      />
      
      <div 
        onClick={() => setShowPopup(!showPopup)}
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.6)', 
          color: 'white', 
          fontSize: '10px', 
          padding: '4px 8px', 
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>📷</span> EDIT IMAGE
      </div>

      {showPopup && (
        <div 
          ref={popupRef}
          style={{
            position: 'absolute',
            top: '50px',
            right: '10px',
            zIndex: 1000,
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            width: '280px',
            textAlign: 'left'
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Image URL</label>
            <input 
              type="text" 
              value={tempSrc}
              onChange={(e) => setTempSrc(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', outline: 'none' }}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          
          {/* Quick Preview of the new URL */}
          {tempSrc && tempSrc !== src && (
            <div style={{ marginBottom: '12px' }}>
               <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px' }}>PREVIEW:</p>
               <img src={tempSrc} alt="Preview" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #f1f5f9' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleSave}
              style={{ flex: 1, background: '#0f172a', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Update Image
            </button>
            <button 
              onClick={() => setShowPopup(false)}
              style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
