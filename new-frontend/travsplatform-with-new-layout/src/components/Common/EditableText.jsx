// src/components/Common/EditableText.jsx
import React, { useState, useEffect } from "react";

export default function EditableText({ value, onSave, isAdmin, className, tag: Tag = "span", multiline = false, style = {} }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => { setTempValue(value); }, [value]);

  if (!isAdmin) return <Tag className={className} style={style}>{value}</Tag>;

  if (isEditing) {
    const commonStyle = {
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      color: "inherit",
      background: "rgba(0,0,0,0.05)",
      border: "1px dashed rgba(0,0,0,0.2)",
      width: "100%",
      outline: "none",
      padding: "2px 4px",
      borderRadius: "4px",
      ...style
    };

    return multiline ? (
      <textarea
        autoFocus
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        className={className}
        style={commonStyle}
        rows={3}
      />
    ) : (
      <input
        autoFocus
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        onKeyDown={(e) => { if (e.key === "Enter") { setIsEditing(false); onSave(tempValue); } }}
        className={className}
        style={commonStyle}
      />
    );
  }

  return (
    <Tag
      className={`${className} cursor-text hover:bg-black/5 transition-colors rounded`}
      onDoubleClick={() => setIsEditing(true)}
      title="Double click to edit"
      style={style}
    >
      {value}
    </Tag>
  );
}
