import React, { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import { AutoTextarea } from "../AutoTextaera";
import "./cvbuilder.css";

type Certificate = {
  id: string;
  time: string;
  name: string;
};

export default function CertificateBlock({
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

  const rawCertificates = block?.data?.certificates;
  const certificates = Array.isArray(rawCertificates)
    ? (rawCertificates as Certificate[])
    : [];

  useEffect(() => {
    if (!block) return;
    if (!Array.isArray(rawCertificates) || certificates.length === 0) {
      updateBlockData(blockId, {
        certificates: [
          {
            id: crypto.randomUUID(),
            time: "",
            name: "",
          },
        ],
      });
    }
  }, [block, blockId, certificates.length, updateBlockData]);

  const addCertificate = () => {
    updateBlockData(blockId, {
      certificates: [
        ...certificates,
        {
          id: crypto.randomUUID(),
          time: "",
          name: "",
        },
      ],
    });
  };

  const removeCertificate = (id: string) => {
    updateBlockData(blockId, {
      certificates: certificates.filter((c) => c.id !== id),
    });
  };

  const updateCertificate = (
    id: string,
    field: keyof Certificate,
    value: string
  ) => {
    updateBlockData(blockId, {
      certificates: certificates.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  return (
    <div className="cv-block cv-certificate">
      {certificates.map((cert) => (
        <div key={cert.id} className="cv-certificate-item">
          {!readOnly && (
            <div data-cv-action className="cv-action-buttons cv-action-buttons--top1">
              <button
                onClick={() => removeCertificate(cert.id)}
                className="cv-action-button cv-action-button--remove"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={addCertificate}
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
              value={cert.time}
              onChange={(e) =>
                updateCertificate(cert.id, "time", e.target.value)
              }
              readOnly={readOnly}
              className="cv-input cv-input-italic cv-input-inline"
              style={{width: 114, height: 20}}
            />

            <AutoTextarea
              spellCheck={false}
              placeholder="Tên chứng chỉ"
              value={cert.name}
              onChange={(e) =>
                updateCertificate(cert.id, "name", e.target.value)
              }
              rows={1}
              readOnly={readOnly}
              className="cv-input"
              style={{width: 114, height: 20}}
            />
          </div>
        </div>
      ))}

      <div className="cv-block-divider" />
    </div>
  );
}
