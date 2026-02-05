import React, { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import { AutoTextarea } from "../AutoTextaera";
import "./cvbuilder.css";

type Skill = {
  id: string;
  name: string;
  description: string;
};

export default function SkillBlock({
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

  const rawSkills = block?.data?.skills;
  const skills = Array.isArray(rawSkills) ? (rawSkills as Skill[]) : [];

  useEffect(() => {
    if (!block) return;
    if (!Array.isArray(rawSkills) || skills.length === 0) {
      updateBlockData(blockId, {
        skills: [
          {
            id: crypto.randomUUID(),
            name: "",
            description: "",
          },
        ],
      });
    }
  }, [block, blockId, skills.length, updateBlockData]);

  const addSkill = () => {
    updateBlockData(blockId, {
      skills: [
        ...skills,
        {
          id: crypto.randomUUID(),
          name: "",
          description: "",
        },
      ],
    });
  };

  const removeSkill = (id: string) => {
    updateBlockData(blockId, {
      skills: skills.filter((s) => s.id !== id),
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    updateBlockData(blockId, {
      skills: skills.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  return (
    <div className="cv-block cv-skill">
      {skills.map((skill) => (
        <div key={skill.id} className="cv-item cv-skill-item">
          {!readOnly && (
            <div data-cv-action className="cv-action-buttons">
              <button
                onClick={() => removeSkill(skill.id)}
                className="cv-action-button cv-action-button--remove"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={addSkill}
                className="cv-action-button cv-action-button--add"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          <AutoTextarea
            placeholder="Tên kỹ năng"
            value={skill.name}
            onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
            rows={1}
            readOnly={readOnly}
            className="cv-input cv-input-bold"
          />

          <AutoTextarea
            placeholder="Mô tả kỹ năng"
            value={skill.description}
            onChange={(e) =>
              updateSkill(skill.id, "description", e.target.value)
            }
            rows={1}
            readOnly={readOnly}
            className="cv-textarea"
          />
        </div>
      ))}

      <div className="cv-block-divider" />
    </div>
  );
}
