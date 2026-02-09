import React, { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import { AutoTextarea } from "../AutoTextaera";
import "./cvbuilder.css";

type Award = {
  id: string;
  time: string;
  name: string;
};

export default function AwardBlock({
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

  const rawAwards = block?.data?.awards;
  const awards = Array.isArray(rawAwards) ? (rawAwards as Award[]) : [];

  useEffect(() => {
    if (!block) return;
    if (!Array.isArray(rawAwards) || awards.length === 0) {
      updateBlockData(blockId, {
        awards: [
          {
            id: crypto.randomUUID(),
            time: "",
            name: "",
          },
        ],
      });
    }
  }, [awards.length, block, blockId, updateBlockData]);

  const addAward = () => {
    updateBlockData(blockId, {
      awards: [
        ...awards,
        {
          id: crypto.randomUUID(),
          time: "",
          name: "",
        },
      ],
    });
  };

  const removeAward = (id: string) => {
    updateBlockData(blockId, {
      awards: awards.filter((a) => a.id !== id),
    });
  };

  const updateAward = (id: string, field: keyof Award, value: string) => {
    updateBlockData(blockId, {
      awards: awards.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    });
  };

  return (
    <div className="cv-block cv-award">
      {awards.map((award) => (
        <div key={award.id} className="cv-award-item">
          {!readOnly && (
            <div data-cv-action className="cv-action-buttons cv-action-buttons--top1">
              <button
                onClick={() => removeAward(award.id)}
                className="cv-action-button cv-action-button--remove"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={addAward}
                className="cv-action-button cv-action-button--add"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="cv-row">
            <input
              spellCheck={false}
              placeholder="Thời gian"
              value={award.time}
              onChange={(e) => updateAward(award.id, "time", e.target.value)}
              readOnly={readOnly}
              className="cv-input cv-input-italic cv-input-inline"
            />

            <AutoTextarea
              spellCheck={false}
              placeholder="Tên giải thưởng"
              value={award.name}
              onChange={(e) => updateAward(award.id, "name", e.target.value)}
              rows={1}
              readOnly={readOnly}
              className="cv-input"
            />
          </div>
        </div>
      ))}

      <div className="cv-block-divider" />
    </div>
  );
}
