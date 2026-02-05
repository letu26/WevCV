import React from "react";
import { AutoTextarea } from "../AutoTextaera";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import "./cvbuilder.css";

export default function CareerObjectiveBlock({
  blockId,
  readOnly = false,
}: {
  blockId: string;
  readOnly?: boolean;
}) {
  const block = useCVLayoutStore((s) => {
    const all = [...s.layout.left, ...s.layout.right, ...s.layout.unused];
    return all.find((b) => b.id === blockId);
  });
  const updateBlockData = useCVLayoutStore((s) => s.updateBlockData);

  const shortTerm = (block?.data?.shortTerm as string) ?? "";
  const longTerm = (block?.data?.longTerm as string) ?? "";

  return (
    <div className="cv-block cv-career">
      <div>
        <div className="cv-career-title">Mục tiêu ngắn hạn:</div>

        <AutoTextarea
          placeholder="Nhập mục tiêu ngắn hạn ở đây"
          value={shortTerm}
          onChange={(e) =>
            updateBlockData(blockId, { shortTerm: e.target.value })
          }
          rows={2}
          readOnly={readOnly}
          className="cv-textarea cv-textarea-box"
        />
      </div>

      <div>
        <div className="cv-career-title">Mục tiêu dài hạn:</div>

        <AutoTextarea
          placeholder="Nhập mục tiêu dài hạn ở đây"
          value={longTerm}
          onChange={(e) =>
            updateBlockData(blockId, { longTerm: e.target.value })
          }
          rows={2}
          readOnly={readOnly}
          className="cv-textarea cv-textarea-box"
        />
      </div>

      <div className="cv-block-divider" />
    </div>
  );
}
