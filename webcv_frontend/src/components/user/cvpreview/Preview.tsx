import { useCVLayoutStore } from "@/store/cvLayoutStore";
import React from "react";
import { CVBlock } from "@/types/cv";
import PreviewBlockRenderer from "./PreviewBlockRenderer";
import "../cv-builder/cvbuilder.css";

type PreviewProps = {
  mode?: "editor" | "modal";
  readOnly?: boolean;
};

export default function Preview({ mode = "editor", readOnly = false }: PreviewProps) {
  const { left, right } = useCVLayoutStore((s) => s.layout);
  const isModal = mode === "modal";

  return (
    <div
      className={`cv-preview-wrapper ${
        isModal ? "cv-preview-wrapper--modal" : ""
      }`}
    >
      {/* A4 Preview */}
      <div id="cv-preview" className="cv-preview">
        <div className="cv-preview-body">
          {/* CỘT TRÁI */}
          <div className="cv-preview-column-left">
            {left.map((block) => (
              <PreviewBlock key={block.id} block={block} readOnly={readOnly} />
            ))}
          </div>

          {/* CỘT PHẢI */}
          <div className="cv-preview-column-right">
            {right.map((block) => (
              <PreviewBlock key={block.id} block={block} readOnly={readOnly} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBlock({ block, readOnly }: { block: CVBlock; readOnly: boolean }) {
  return (
    <div>
      {/* TITLE */}
      {block.title === "Danh thiếp" ? (
        <>
        </>
      ) : block.title === "Ảnh đại diện" ?(
      <>
      </>
      ): (
        <>
          <h3 className="cv-preview-block-title">
            {block.title}
          </h3>
        </>
      )}


      {/* CONTENT */}
      <div>
        <PreviewBlockRenderer block={block} readOnly={readOnly} />
      </div>
    </div>
  );
}
