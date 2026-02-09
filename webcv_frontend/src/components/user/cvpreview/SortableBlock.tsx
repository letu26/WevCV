import {
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CVBlock, DropZone } from "@/types/cv";
import React from "react";
import "../cv-builder/cvbuilder.css";

export default function SortableBlock({
  block,
  zone,
  selected,
  onSelect,
}: {
  block: CVBlock;
  zone: DropZone;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: block.id,
      data: { zone },
      animateLayoutChanges: (args) =>
        defaultAnimateLayoutChanges({
          ...args,
          wasDragging: true,
        }),
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? "transform 200ms ease",
        willChange: "transform",
      }}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(block.id)}
      className={`sortable-block ${selected ? "sortable-block--selected" : ""}`}
    >
      {block.title}
    </div>
  );
}
