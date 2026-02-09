import { useDroppable } from "@dnd-kit/core";
import { CVBlock, DropZone } from "@/types/cv";
import React from "react";
import "../cv-builder/cvbuilder.css";

type Props = {
  id: DropZone;
  title: string;
  blocks: CVBlock[];
};

export default function Column({ id, title, blocks }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`cv-column ${isOver ? "cv-column--over" : ""}`}
    >
      <h3 className="cv-column-title">{title}</h3>

      <div className="cv-column-list">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="cv-column-item"
          >
            {block.title}
          </div>
        ))}
      </div>
    </div>
  );
}
