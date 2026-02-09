import React from "react";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import { AutoTextarea } from "../AutoTextaera";
import "./cvbuilder.css";

export default function BusinessCard({
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

  const fullName = (block?.data?.fullName as string) ?? "";
  const position = (block?.data?.position as string) ?? "";

  return (
    <div className="cv-business-card cv-block">
      <AutoTextarea
        spellCheck={false}
        value={fullName}
        onChange={(e) =>
          updateBlockData(blockId, { fullName: e.target.value })
        }
        placeholder="Họ Tên"
        rows={1}
        readOnly={readOnly}
        className={`cv-business-name ${
          fullName ? "cv-business-name--filled" : "cv-business-name--empty"
        }`}
        style={{textAlign: "center"}}
      />

      <AutoTextarea
        spellCheck={false}
        placeholder="Vị trí ứng tuyển"
        value={position}
        onChange={(e) =>
          updateBlockData(blockId, { position: e.target.value })
        }
        rows={1}
        readOnly={readOnly}
        className="cv-business-position"
        style={{textAlign: "center"}}
      />
    </div>
  );
}
