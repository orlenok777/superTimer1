// src/components/ui/select.js
import React from "react";

export const Select = ({ children, value, onValueChange }) => (
  <div className="select">
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  </div>
);

export const SelectTrigger = ({ children, className }) => (
  <div className={`select-trigger ${className}`}>{children}</div>
);

export const SelectValue = ({ placeholder }) => (
  <div className="select-value">{placeholder}</div>
);

export const SelectContent = ({ children }) => (
  <div className="select-content">{children}</div>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
