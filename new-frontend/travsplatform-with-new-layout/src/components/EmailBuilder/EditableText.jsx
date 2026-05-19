import React, { useState, useEffect, useRef } from "react";

export default function EditableText({ value, onSave, isAdmin, style = {}, tag: Tag = "span", multiline = false, className = "" }) {
  if (!isAdmin) return <Tag className={className} style={style}>{value}</Tag>;

  return (
    <EditableTextInner 
      value={value} 
      onSave={onSave} 
      style={style} 
      Tag={Tag} 
      multiline={multiline} 
      className={className} 
    />
  );
}

function EditableTextInner({ value, onSave, style, Tag, multiline, className }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setTempValue(value); }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    const inputStyles = {
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      color: "inherit",
      background: "rgba(0,0,0,0.05)",
      border: "1px dashed rgba(0,0,0,0.2)",
      width: "100%",
      outline: "none",
      padding: "0",
      margin: "0",
      textAlign: style.textAlign || "inherit",
      ...style
    };

    return multiline ? (
      <textarea
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        style={inputStyles}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        onKeyDown={(e) => { if (e.key === "Enter") { setIsEditing(false); onSave(tempValue); } }}
        style={inputStyles}
      />
    );
  }

  return (
    <Tag
      className={className}
      style={{ 
        ...style, 
        cursor: "text",
        outline: "none"
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      {value || <span style={{ fontStyle: 'italic', opacity: 0.3 }}>(Empty)</span>}
    </Tag>
  );
}
