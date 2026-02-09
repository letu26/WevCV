import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CVBlock, DropZone } from "@/types/cv";
import React from "react";
import SortableBlock from "../SortableBlock";
import DropColumn from "./DropColumn";
import "../../cv-builder/cvbuilder.css";

type Props = {
  id: DropZone;
  title: string;
  blocks: CVBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function LayoutColumn({
  id,
  title,
  blocks,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="layout-column">
      <h3 className="layout-column-title">{title}</h3>

      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <DropColumn id={id}>
          <div className="layout-column-list">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                zone={id}
                selected={selectedId === block.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </DropColumn>
      </SortableContext>
    </div>
  );
}
