import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import "./cvbuilder.css";

const CLOUD_NAME = "dliautkra";
const UPLOAD_PRESET = "cvbuilder";

export default function AvatarUpload({
  blockId,
  readOnly = false,
}: {
  blockId: string;
  readOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const block = useCVLayoutStore((s) => {
    const all = [...s.layout.left, ...s.layout.right, ...s.layout.unused];
    return all.find((b) => b.id === blockId);
  });
  const updateBlockData = useCVLayoutStore((s) => s.updateBlockData);

  const image = (block?.data?.image as string | null) ?? null;

  const handleSelectImage = () => {
    if (readOnly) return;
    if (isUploading) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void uploadToCloudinary(file);
    e.target.value = "";
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: form }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = (await res.json()) as { secure_url?: string };
      if (data.secure_url) {
        updateBlockData(blockId, { image: data.secure_url });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="cv-avatar-wrap">
      <div onClick={handleSelectImage} className="cv-avatar">
        {image ? (
          <img src={image} alt="Avatar" className="cv-avatar-image" />
        ) : (
          <div className="cv-avatar-placeholder">
            <svg
              viewBox="0 0 24 24"
              className="cv-avatar-icon"
              fill="currentColor"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        )}

        {!readOnly && (
          <div className="cv-avatar-overlay">
            {isUploading ? (
              <span className="cv-avatar-overlay-text">Uploading...</span>
            ) : (
              <Camera className="cv-text-white" size={28} />
            )}
          </div>
        )}

        {!readOnly && (
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="cv-hidden"
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}
