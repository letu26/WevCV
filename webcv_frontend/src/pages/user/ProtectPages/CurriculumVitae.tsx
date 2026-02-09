import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import { CVBlock, CVLayout, CVSavePayload, DropZone } from "@/types/cv";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { Save } from "lucide-react";
import LayoutEditor from "@/components/user/cvpreview/layout-editor/LayoutEditor";
import Preview from "@/components/user/cvpreview/Preview";
import { createAndUpdateCv } from "@/services/usersservices/CvsServices";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const isDropZone = (value: unknown): value is DropZone => {
  return value === "left" || value === "right" || value === "unused";
};

export default function CurriculumVitae() {
  const { layout, moveBlock, reorderBlock, setLayout, resetLayout } = useCVLayoutStore();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cvTitle, setCvTitle] = useState("");
  const [cvId, setCvId] = useState<string | null>(null);
  const [lastSavedPayload, setLastSavedPayload] = useState("");
  const initSavedRef = useRef(false);
  const location = useLocation();

  const navState = location.state as
    | { mode?: "view" | "edit" | "create"; cv?: CVSavePayload }
    | null;
  const isReadOnly = navState?.mode === "view";

  const parseMaybeJson = <T,>(value: T | string | undefined): T | undefined => {
    if (typeof value !== "string") return value as T | undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  };

  const buildLayoutFromPayload = (payload: CVSavePayload): CVLayout => {
    const parsedLayout = parseMaybeJson<CVSavePayload["layout"]>(payload.layout);
    const parsedBlocks =
      parseMaybeJson<CVSavePayload["blocks"]>(payload.blocks) ?? [];

    const blockMap = new Map<string, CVBlock>();
    for (const block of parsedBlocks) {
      if (!block?.id) continue;
      blockMap.set(block.id, {
        id: block.id,
        type: block.type,
        title: block.title,
        data: block.data ?? {},
      });
    }

    const mapIds = (ids?: string[]) =>
      (ids ?? [])
        .map((id) => blockMap.get(id))
        .filter(Boolean) as CVBlock[];

    const left = mapIds(parsedLayout?.left);
    const right = mapIds(parsedLayout?.right);
    const unused = mapIds(parsedLayout?.unused);
    const usedIds = new Set(
      [...left, ...right, ...unused].map((block) => block.id)
    );
    const extras = Array.from(blockMap.values()).filter(
      (block) => !usedIds.has(block.id)
    );

    return {
      left,
      right,
      unused: [...unused, ...extras],
    };
  };

  const activeBlock = useMemo(() => {
    if (!activeId) return null;
    const all = [...layout.left, ...layout.right, ...layout.unused];
    return all.find((b) => b.id === activeId) ?? null;
  }, [activeId, layout.left, layout.right, layout.unused]);

  const savePayload = useMemo<CVSavePayload>(() => {
    const allBlocks = [...layout.left, ...layout.right, ...layout.unused];

    return {
      id: cvId,
      title: cvTitle,
      layout: {
        left: layout.left.map((b) => b.id),
        right: layout.right.map((b) => b.id),
        unused: layout.unused.map((b) => b.id),
      },
      blocks: allBlocks.map((b) => ({
        id: b.id,
        type: b.type,
        title: b.title,
        data: b.data,
      })),
    };
  }, [cvId, cvTitle, layout.left, layout.right, layout.unused]);

  const payloadString = useMemo(
    () => JSON.stringify(savePayload),
    [savePayload]
  );

  useEffect(() => {
    if (!initSavedRef.current) {
      setLastSavedPayload(payloadString);
      initSavedRef.current = true;
    }
  }, [payloadString]);

  const hasUnsavedChanges = payloadString !== lastSavedPayload;

  useEffect(() => {
    if (!navState?.cv) {
      resetLayout();
      setCvId(null);
      setCvTitle("");
      initSavedRef.current = false;
      return;
    }

    const incomingLayout = buildLayoutFromPayload(navState.cv);
    setLayout(incomingLayout);
    setCvId(navState.cv.id ?? null);
    setCvTitle(navState.cv.title ?? "");
    initSavedRef.current = true;
    setLastSavedPayload(
      JSON.stringify({
        id: navState.cv.id ?? null,
        title: navState.cv.title ?? "",
        layout: {
          left: incomingLayout.left.map((b) => b.id),
          right: incomingLayout.right.map((b) => b.id),
          unused: incomingLayout.unused.map((b) => b.id),
        },
        blocks: [...incomingLayout.left, ...incomingLayout.right, ...incomingLayout.unused].map(
          (b) => ({
            id: b.id,
            type: b.type,
            title: b.title,
            data: b.data,
          })
        ),
      })
    );
  }, [navState?.cv, resetLayout, setLayout]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  const isBlockUsed = (type: string) =>
    layout.left.some((b) => b.type === type) ||
    layout.right.some((b) => b.type === type);

  const getBlockData = (type: string) =>
    savePayload.blocks.find((b) => b.type === type)?.data as
    | Record<string, unknown>
    | undefined;

  const validateProfile = () => {
    if (!isBlockUsed("profile")) return true;
    const data = getBlockData("profile") ?? {};

    const dob = String(data.dob ?? "").trim();
    const gender = String(data.gender ?? "").trim();
    const phone = String(data.phone ?? "").trim();
    const email = String(data.email ?? "").trim();
    const address = String(data.address ?? "").trim();

    if (!dob || !gender || !phone || !email || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân!");
      return false;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast.error("Email không hợp lệ.");
      return false;
    }

    return true;
  };

  const validateSkills = () => {
    if (!isBlockUsed("skill")) return true;
    const skills = (getBlockData("skill") as {
      skills?: Array<{ name?: string }>;
    })?.skills;

    if (!skills || skills.length === 0) return true;

    const hasEmpty = skills.some(
      (s) => !String(s.name ?? "").trim()
    );
    if (hasEmpty) {
      toast.error("Vui nhập đủ thông tin kỹ năng!");
      return false;
    }

    return true;
  };

  const validateBusinessCard = () => {
    if (!isBlockUsed("businesscard")) return true;
    const data = getBlockData("businesscard") ?? {};
    const fullName = String(data.fullName ?? "").trim();
    if (!fullName) {
      toast.error("Vui lòng nhập họ tên!.");
      return false;
    }
    return true;
  };

  const validateAvatar = () => {
    if (!isBlockUsed("avatar")) return true;
    const data = getBlockData("avatar") ?? {};
    const image = String(data.image ?? "").trim();
    if (!image) {
      toast.error("Vui lòng chọn ảnh đại diện!");
      return false;
    }
    return true;
  };

  const validateCareer = () => {
    if (!isBlockUsed("career")) return true;
    const data = getBlockData("career") ?? {};
    const shortTerm = String(data.shortTerm ?? "").trim();
    const longTerm = String(data.longTerm ?? "").trim();
    if (!shortTerm || !longTerm) {
      toast.error("Vui lòng nhập thông tin mục tiêu nghề nghiệp!");
      return false;
    }
    return true;
  };

  const validateEducation = () => {
    if (!isBlockUsed("education")) return true;
    const educations = (getBlockData("education") as {
      educations?: Array<{
        school?: string;
        major?: string;
        start?: string;
        end?: string;
      }>;
    })?.educations;
    if (!educations || educations.length === 0) return true;
    const hasEmpty = educations.some(
      (e) =>
        !String(e.school ?? "").trim() ||
        !String(e.major ?? "").trim() ||
        !String(e.start ?? "").trim() ||
        !String(e.end ?? "").trim()
    );
    if (hasEmpty) {
      toast.error("Vui lòng nhập thông tin học vấn!.");
      return false;
    }
    return true;
  };

  const validateExperience = () => {
    if (!isBlockUsed("experience")) return true;
    const jobs = (getBlockData("experience") as {
      jobs?: Array<{
        position?: string;
        company?: string;
        start?: string;
        end?: string;
      }>;
    })?.jobs;
    if (!jobs || jobs.length === 0) return true;
    const hasEmpty = jobs.some(
      (j) =>
        !String(j.position ?? "").trim() ||
        !String(j.company ?? "").trim() ||
        !String(j.start ?? "").trim() ||
        !String(j.end ?? "").trim()
    );
    if (hasEmpty) {
      toast.error("Vui lòng nhập thông tin kinh nghiệm!");
      return false;
    }
    return true;
  };

  const validateActivity = () => {
    if (!isBlockUsed("activity")) return true;
    const activities = (getBlockData("activity") as {
      activities?: Array<{
        role?: string;
        organization?: string;
        start?: string;
        end?: string;
      }>;
    })?.activities;
    if (!activities || activities.length === 0) return true;
    const hasEmpty = activities.some(
      (a) =>
        !String(a.role ?? "").trim() ||
        !String(a.organization ?? "").trim() ||
        !String(a.start ?? "").trim() ||
        !String(a.end ?? "").trim()
    );
    if (hasEmpty) {
      toast.error("Vui lòng nhập thông tin hoạt động!");
      return false;
    }
    return true;
  };

  const validateAward = () => {
    if (!isBlockUsed("award")) return true;
    const awards = (getBlockData("award") as {
      awards?: Array<{ time?: string; name?: string }>;
    })?.awards;
    if (!awards || awards.length === 0) return true;
    const hasEmpty = awards.some(
      (a) =>
        !String(a.time ?? "").trim() ||
        !String(a.name ?? "").trim()
    );
    if (hasEmpty) {
      toast.error("Vui lòng nhập thông tin giải thưởng!");
      return false;
    }
    return true;
  };

  const validateCertificate = () => {
    if (!isBlockUsed("certificate")) return true;
    const certificates = (getBlockData("certificate") as {
      certificates?: Array<{ time?: string; name?: string }>;
    })?.certificates;
    if (!certificates || certificates.length === 0) return true;
    const hasEmpty = certificates.some(
      (c) =>
        !String(c.time ?? "").trim() ||
        !String(c.name ?? "").trim()
    );
    if (hasEmpty) {
      toast.error("Vui lòng nhập thông tin chứng chỉ!");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    console.log("[CV SAVE PAYLOAD]", savePayload);
    if (!validateProfile()) return;
    if (!validateSkills()) return;
    if (!validateBusinessCard()) return;
    if (!validateAvatar()) return;
    if (!validateCareer()) return;
    if (!validateEducation()) return;
    if (!validateExperience()) return;
    if (!validateActivity()) return;
    if (!validateAward()) return;
    if (!validateCertificate()) return;
    try {
      const res = await createAndUpdateCv(savePayload);
      if (res.code === "200") {
        toast.success("Lưu cv thành công!");
        navigate("/profile");
      }
      else {
        toast.success("Cập nhật cv thành công!");
        navigate("/profile");
      }
      setLastSavedPayload(payloadString);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Lỗi không xác định";
      toast.error(message);
    }
  };


  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeZone = active.data.current?.zone as DropZone | undefined;
    if (!activeZone) return;

    const overZone = isDropZone(over.id)
      ? (over.id as DropZone)
      : (over.data.current?.zone as DropZone | undefined);
    if (!overZone) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeZone === overZone) {
      if (activeId !== overId) {
        reorderBlock(activeZone, activeId, overId);
      }
      return;
    }

    const overIndex = layout[overZone].findIndex((b) => b.id === overId);
    const toIndex = overIndex >= 0 ? overIndex : undefined;
    moveBlock(activeId, activeZone, overZone, toIndex);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      collisionDetection={closestCenter}
    >
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6">
        <div className="fixed top-20.5 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-white border-b z-40">
          <div className="flex items-center justify-between px-6 py-3">
            <input
              spellCheck={false}
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
              readOnly={isReadOnly}
              placeholder="Tiêu đề CV"
              className="w-80 font-semibold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-gray-300"
            />

            <div className="flex items-center justify-evenly gap-3">
              {!isReadOnly && (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 transition"
                >
                  <Save size={16} />
                  Lưu CV
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex px-6 py-4 pt-20">
          <div className={isReadOnly ? "pointer-events-none" : undefined}>
            <LayoutEditor />
          </div>
          <div className={isReadOnly ? "flex-1 pointer-events-none" : "flex-1"}>
            <Preview />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeBlock ? <DragOverlayBlock block={activeBlock} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function DragOverlayBlock({ block }: { block: CVBlock }) {
  return (
    <div className="p-2 bg-white border border-orange-300 rounded shadow cursor-grabbing">
      {block.title}
    </div>
  );
}
