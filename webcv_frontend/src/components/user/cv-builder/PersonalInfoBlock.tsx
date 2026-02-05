import {
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import React from "react";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import { AutoTextarea } from "../AutoTextaera";
import "./cvbuilder.css";

export default function PersonalInfo({
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

  const fields = [
    { key: "dob", icon: Calendar, placeholder: "DD/MM/YYYY" },
    { key: "gender", icon: User, placeholder: "Nam/Nữ" },
    { key: "phone", icon: Phone, placeholder: "0123 456 789" },
    { key: "email", icon: Mail, placeholder: "exemple@gmail.com" },
    { key: "address", icon: MapPin, placeholder: "Nhập địa chỉ ở đây" },
  ];

  return (
    <div className="cv-personal">
      {fields.map((field, index) => {
        const Icon = field.icon;
        const value = (block?.data?.[field.key] as string) ?? "";
        const isAddress = field.key === "address";

        return (
          <div
            key={index}
            className={`cv-personal-row ${isAddress ? "cv-personal-row--address" : ""}`}
          >
            <Icon className="cv-personal-icon" />

            {isAddress ? (
              <AutoTextarea
                spellCheck={false}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) =>
                  updateBlockData(blockId, {
                    [field.key]: e.target.value,
                  })
                }
                rows={1}
                readOnly={readOnly}
                className="cv-textarea"
              />
            ) : (
              <input
                spellCheck={false}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) =>
                  updateBlockData(blockId, {
                    [field.key]: e.target.value,
                  })
                }
                readOnly={readOnly}
                className="cv-input"
              />
            )}
          </div>
        );
      })}
      <div className="cv-block-divider" />
    </div>
  );
}
