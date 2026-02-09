import React from "react";
import "../cv-builder/cvbuilder.css";

export default function CVPreview({ children }: { children?: React.ReactNode }) {
  return (
    <div id="cv-preview" className="cv-preview-page">
      {children}
    </div>
  );
}
