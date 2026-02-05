import React from "react";
import CVPreview from "./CVPreview";
import "../cv-builder/cvbuilder.css";

export default function CVBuilder() {
  return (
    <div className="cv-builder">
      {/* LEFT PANEL (để trống – làm sau) */}
      <div className="cv-builder-sidebar" />

      {/* PREVIEW */}
      <div className="cv-builder-preview">
        <CVPreview />
      </div>
    </div>
  );
}
