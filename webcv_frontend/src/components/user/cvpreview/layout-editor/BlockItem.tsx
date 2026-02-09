import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CVBlock, DropZone } from "@/types/cv";
import React from "react";
import "../../cv-builder/cvbuilder.css";

type Props = {
  block: CVBlock;
  from: DropZone;
};

export default function BlockItem({ block, from }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
    data: { from },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="block-item"
    >
      {block.title}
    </div>
  );
}
