import { useDroppable } from "@dnd-kit/core";
import { DropZone } from "@/types/cv";
import React from "react";
import "../../cv-builder/cvbuilder.css";

type Props = {
  id: DropZone;
  children: React.ReactNode;
};

export default function DropColumn({ id, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`drop-column ${isOver ? "drop-column--over" : ""}`}
    >
      {children}
    </div>
  );
}
