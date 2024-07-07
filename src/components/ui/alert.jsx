// src/components/ui/alert.js
import React from "react";

export const Alert = ({ children, className }) => (
  <div className={`alert ${className}`}>{children}</div>
);

export const AlertTitle = ({ children }) => (
  <div className="alert-title">{children}</div>
);

export const AlertDescription = ({ children }) => (
  <div className="alert-description">{children}</div>
);
