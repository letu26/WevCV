import { useCVLayoutStore } from "@/store/cvLayoutStore";
import React, { useState } from "react";
import LayoutColumn from "./LayoutColumn";
import "../../cv-builder/cvbuilder.css";

export default function LayoutEditor() {
  const { layout } = useCVLayoutStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="layout-editor">
      <div className="layout-editor-scroll">
        <LayoutColumn
          id="left"
          title="Cột trái"
          blocks={layout.left}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <LayoutColumn
          id="right"
          title="Cột phải"
          blocks={layout.right}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <LayoutColumn
          id="unused"
          title="Mục chưa sử dụng"
          blocks={layout.unused}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
