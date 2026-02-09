import React, { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AutoTextarea } from "../AutoTextaera";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import "./cvbuilder.css";

type Education = {
  id: string;
  school: string;
  major: string;
  start: string;
  end: string;
  description: string;
};

export default function EducationBlock({
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

  const rawEducations = block?.data?.educations;
  const educations = Array.isArray(rawEducations)
    ? (rawEducations as Education[])
    : [];

  useEffect(() => {
    if (!block) return;
    if (!Array.isArray(rawEducations) || educations.length === 0) {
      updateBlockData(blockId, {
        educations: [
          {
            id: crypto.randomUUID(),
            school: "",
            major: "",
            start: "",
            end: "",
            description: "",
          },
        ],
      });
    }
  }, [block, blockId, educations.length, updateBlockData]);

  const addEducation = () => {
    updateBlockData(blockId, {
      educations: [
        ...educations,
        {
          id: crypto.randomUUID(),
          school: "",
          major: "",
          start: "",
          end: "",
          description: "",
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    updateBlockData(blockId, {
      educations: educations.filter((e) => e.id !== id),
    });
  };

  const update = (id: string, field: keyof Education, value: string) => {
    updateBlockData(blockId, {
      educations: educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  return (
    <div className="cv-block cv-education">
      {educations.map((edu) => (
        <div key={edu.id} className="cv-item">
          {!readOnly && (
            <div data-cv-action className="cv-action-buttons">
              <button
                onClick={() => removeEducation(edu.id)}
                className="cv-action-button cv-action-button--remove"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={addEducation}
                className="cv-action-button cv-action-button--add"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="cv-row cv-row--start">
            <AutoTextarea
              spellCheck={false}
              placeholder="Tên trường học"
              value={edu.school}
              onChange={(e) => update(edu.id, "school", e.target.value)}
              rows={1}
              readOnly={readOnly}
              className="cv-input cv-input-bold"
            />

            <div className="cv-inline">
              <input
                spellCheck={false}
                placeholder="Bắt đầu"
                value={edu.start}
                onChange={(e) => update(edu.id, "start", e.target.value)}
                readOnly={readOnly}
                className="cv-input cv-input-italic cv-input-date"
              />
              <span className="cv-muted">-</span>
              <input
                spellCheck={false}
                placeholder="Kết thúc"
                value={edu.end}
                onChange={(e) => update(edu.id, "end", e.target.value)}
                readOnly={readOnly}
                className="cv-input cv-input-italic cv-input-date"
                style={{textAlign: "left"}}
              />
            </div>
          </div>

          <AutoTextarea
            spellCheck={false}
            placeholder="Ngành học/ Môn học"
            value={edu.major}
            onChange={(e) => update(edu.id, "major", e.target.value)}
            rows={1}
            readOnly={readOnly}
            className="cv-input cv-section-input"
          />

          <AutoTextarea
            placeholder="Mô tả quá trình học tập hoặc thành tích của bạn"
            value={edu.description}
            onChange={(e) => update(edu.id, "description", e.target.value)}
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
