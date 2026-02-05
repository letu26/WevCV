import React, { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AutoTextarea } from "../AutoTextaera";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import "./cvbuilder.css";

type Experience = {
  id: string;
  position: string;
  company: string;
  start: string;
  end: string;
  description: string;
};

export default function ExperienceBlock({
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

  const rawJobs = block?.data?.jobs;
  const jobs = Array.isArray(rawJobs) ? (rawJobs as Experience[]) : [];

  useEffect(() => {
    if (!block) return;
    if (!Array.isArray(rawJobs) || jobs.length === 0) {
      updateBlockData(blockId, {
        jobs: [
          {
            id: crypto.randomUUID(),
            position: "",
            company: "",
            start: "",
            end: "",
            description: "",
          },
        ],
      });
    }
  }, [block, blockId, jobs.length, updateBlockData]);

  const addJob = () => {
    updateBlockData(blockId, {
      jobs: [
        ...jobs,
        {
          id: crypto.randomUUID(),
          position: "",
          company: "",
          start: "",
          end: "",
          description: "",
        },
      ],
    });
  };

  const removeJob = (id: string) => {
    updateBlockData(blockId, {
      jobs: jobs.filter((j) => j.id !== id),
    });
  };

  const update = (id: string, field: keyof Experience, value: string) => {
    updateBlockData(blockId, {
      jobs: jobs.map((job) =>
        job.id === id ? { ...job, [field]: value } : job
      ),
    });
  };

  return (
    <div className="cv-block cv-experience">
      {jobs.map((job) => (
        <div key={job.id} className="cv-item">
          {!readOnly && (
            <div data-cv-action className="cv-action-buttons">
              <button
                onClick={() => removeJob(job.id)}
                className="cv-action-button cv-action-button--remove"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={addJob}
                className="cv-action-button cv-action-button--add"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="cv-row cv-row--start">
            <AutoTextarea
              spellCheck={false}
              placeholder="Vị trí công việc"
              value={job.position}
              onChange={(e) => update(job.id, "position", e.target.value)}
              rows={1}
              readOnly={readOnly}
              className="cv-input cv-input-bold"
            />

            <div className="cv-inline">
              <input
                spellCheck={false}
                placeholder="Bắt đầu"
                value={job.start}
                onChange={(e) => update(job.id, "start", e.target.value)}
                readOnly={readOnly}
                className="cv-input cv-input-italic cv-input-date"
              />
              <span className="cv-muted">-</span>
              <input
                spellCheck={false}
                placeholder="Kết thúc"
                value={job.end}
                onChange={(e) => update(job.id, "end", e.target.value)}
                readOnly={readOnly}
                className="cv-input cv-input-italic cv-input-date"
                 style={{textAlign: "left"}}
              />
            </div>
          </div>

          <AutoTextarea
            spellCheck={false}
            placeholder="Tên công ty"
            value={job.company}
            onChange={(e) => update(job.id, "company", e.target.value)}
            rows={1}
            readOnly={readOnly}
            className="cv-input cv-section-input"
          />

          <AutoTextarea
            placeholder="Mô tả kinh nghiệm làm việc"
            value={job.description}
            onChange={(e) => update(job.id, "description", e.target.value)}
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
