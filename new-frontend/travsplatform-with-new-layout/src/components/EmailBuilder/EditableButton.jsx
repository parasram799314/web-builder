import React, { useState, useRef, useEffect } from "react";

export default function EditableButton({ 
  text, 
  link, 
  onSave, 
  isAdmin, 
  style = {}, 
  className = "" 
}) {
  if (!isAdmin) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" style={style} className={className}>
        {text}
      </a>
    );
  }

  return (
    <EditableButtonInner 
      text={text}
      link={link}
      onSave={onSave}
      style={style}
      className={className}
    />
  );
}

function EditableButtonInner({ text, link, onSave, style, className }) {
  const [showPopup, setShowPopup] = useState(false);
  const [tempText, setTempText] = useState(text);
  const [tempLink, setTempLink] = useState(link);
  const popupRef = useRef(null);

  useEffect(() => {
    setTempText(text);
    setTempLink(link);
  }, [text, link]);

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
    onSave({ text: tempText, link: tempLink });
    setShowPopup(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', zIndex: showPopup ? 100 : 1 }}>
      <button 
        onClick={() => setShowPopup(!showPopup)}
        style={{ ...style, cursor: 'pointer', border: 'none' }}
        className={className}
      >
        {text}
        <span style={{ 
          position: 'absolute', 
          top: '-8px', 
          right: '-8px', 
          background: '#f97316', 
          color: 'white', 
          fontSize: '10px', 
          padding: '2px 5px', 
          borderRadius: '4px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>EDIT</span>
      </button>

      {showPopup && (
        <div 
          ref={popupRef}
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            width: '260px',
            textAlign: 'left'
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>Button Text</label>
            <input 
              type="text" 
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
              placeholder="e.g. View Details"
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>Redirect URL</label>
            <input 
              type="text" 
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
              placeholder="https://..."
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleSave}
              style={{ flex: 1, background: '#0f172a', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Apply Changes
            </button>
            <button 
              onClick={() => setShowPopup(false)}
              style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
