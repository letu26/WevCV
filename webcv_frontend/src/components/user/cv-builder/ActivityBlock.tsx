import React, { useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AutoTextarea } from "../AutoTextaera";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import "./cvbuilder.css";

type Activity = {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  description: string;
};

type RawActivity = Activity & { time?: string };

const parseRange = (value?: string) => {
  if (!value) return { start: "", end: "" };
  const [start = "", end = ""] = value.split("-");
  return { start: start.trim(), end: end.trim() };
};

export default function ActivityBlock({
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

  const rawActivities =
    (block?.data?.activities as RawActivity[] | undefined) ?? [];

  const activities = useMemo<Activity[]>(
    () =>
      rawActivities.map((act) => {
        const safe = act as RawActivity;
        if ("start" in act || "end" in act) {
          return {
            id: safe.id,
            role: safe.role,
            organization: safe.organization,
            start: safe.start ?? "",
            end: safe.end ?? "",
            description: safe.description,
          };
        }

        const range = parseRange(safe.time);
        return {
          id: safe.id,
          role: safe.role,
          organization: safe.organization,
          start: range.start,
          end: range.end,
          description: safe.description,
        };
      }),
    [rawActivities]
  );

  useEffect(() => {
    if (!block) return;

    if (rawActivities.length === 0) {
      updateBlockData(blockId, {
        activities: [
          {
            id: crypto.randomUUID(),
            role: "",
            organization: "",
            start: "",
            end: "",
            description: "",
          },
        ],
      });
      return;
    }

    const needsMigration = rawActivities.some(
      (act) => "time" in act && !("start" in act) && !("end" in act)
    );

    if (needsMigration) {
      updateBlockData(blockId, {
        activities,
      });
    }
  }, [activities, block, blockId, rawActivities, updateBlockData]);

  const addActivity = () => {
    updateBlockData(blockId, {
      activities: [
        ...activities,
        {
          id: crypto.randomUUID(),
          role: "",
          organization: "",
          start: "",
          end: "",
          description: "",
        },
      ],
    });
  };

  const removeActivity = (id: string) => {
    updateBlockData(blockId, {
      activities: activities.filter((a) => a.id !== id),
    });
  };

  const updateActivity = (id: string, field: keyof Activity, value: string) => {
    updateBlockData(blockId, {
      activities: activities.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    });
  };

  return (
    <div className="cv-block cv-activity">
      {activities.map((act) => (
        <div key={act.id} className="cv-item">
          {!readOnly && (
            <div data-cv-action className="cv-action-buttons">
              <button
                onClick={() => removeActivity(act.id)}
                className="cv-action-button cv-action-button--remove"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={addActivity}
                className="cv-action-button cv-action-button--add"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="cv-row cv-row--start">
            <AutoTextarea
              spellCheck={false}
              placeholder="Vị trí của bạn"
              value={act.role}
              onChange={(e) => updateActivity(act.id, "role", e.target.value)}
              rows={1}
              readOnly={readOnly}
              className="cv-input cv-input-bold"
            />

            <div className="cv-inline">
              <input
                spellCheck={false}
                placeholder="Bắt đầu"
                value={act.start}
                onChange={(e) => updateActivity(act.id, "start", e.target.value)}
                readOnly={readOnly}
                className="cv-input cv-input-italic cv-input-date"
              />
              <span className="cv-muted">-</span>
              <input
                spellCheck={false}
                placeholder="Kết thúc"
                value={act.end}
                onChange={(e) => updateActivity(act.id, "end", e.target.value)}
                readOnly={readOnly}
                className="cv-input cv-input-italic cv-input-date--short"
                style={{ textAlign: "left" }}
              />
            </div>
          </div>

          <AutoTextarea
            spellCheck={false}
            placeholder="Tên tổ chức"
            value={act.organization}
            onChange={(e) =>
              updateActivity(act.id, "organization", e.target.value)
            }
            rows={1}
            readOnly={readOnly}
            className="cv-input cv-section-input"
          />

          <AutoTextarea
            placeholder="Mô tả hoạt động"
            value={act.description}
            onChange={(e) =>
              updateActivity(act.id, "description", e.target.value)
            }
            rows={2}
            readOnly={readOnly}
            className="cv-textarea cv-textarea-box"
          />
        </div>
      ))}

      <div className="cv-block-divider" />
    </div>
  );
}
