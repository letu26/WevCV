import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { CVLayout, DropZone, CVBlock } from "@/types/cv";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultBlockData = (type: string): Record<string, unknown> => {
  switch (type) {
    case "education":
      return {
        educations: [
          {
            id: createId(),
            school: "",
            major: "",
            start: "",
            end: "",
            description: "",
          },
        ],
      };
    case "experience":
      return {
        jobs: [
          {
            id: createId(),
            position: "",
            company: "",
            start: "",
            end: "",
            description: "",
          },
        ],
      };
    case "award":
      return {
        awards: [
          {
            id: createId(),
            time: "",
            name: "",
          },
        ],
      };
    case "skill":
      return {
        skills: [
          {
            id: createId(),
            name: "",
            description: "",
          },
        ],
      };
    case "certificate":
      return {
        certificates: [
          {
            id: createId(),
            time: "",
            name: "",
          },
        ],
      };
    default:
      return {};
  }
};

const buildBlock = (id: string, type: string, title: string): CVBlock => ({
  id,
  type,
  title,
  data: defaultBlockData(type),
});

const initialUnusedBlocks: CVBlock[] = [
  buildBlock("career", "career", "Mục tiêu nghề nghiệp"),
  buildBlock("education", "education", "Học vấn"),
  buildBlock("experience", "experience", "Kinh nghiệm làm việc"),
  buildBlock("award", "award", "Giải thưởng"),
  buildBlock("activity", "activity", "Hoạt động"),
  buildBlock("businesscard", "businesscard", "Danh thiếp"),
  buildBlock("avatar", "avatar", "Ảnh đại diện"),
  buildBlock("profile", "profile", "Thông tin cá nhân"),
  buildBlock("skill", "skill", "Kỹ năng"),
  buildBlock("certificate", "certificate", "Chứng chỉ"),
];

const defaultRightBlocks: CVBlock[] = [
  buildBlock("career", "career", "Mục tiêu nghề nghiệp"),
  buildBlock("education", "education", "Học vấn"),
  buildBlock("experience", "experience", "Kinh nghiệm làm việc"),
  buildBlock("award", "award", "Giải thưởng"),
  buildBlock("activity", "activity", "Hoạt động"),
];

const defaultLeftBlocks: CVBlock[] = [
  buildBlock("businesscard", "businesscard", "Danh thiếp"),
  buildBlock("avatar", "avatar", "Ảnh đại diện"),
  buildBlock("profile", "profile", "Thông tin cá nhân"),
  buildBlock("skill", "skill", "Kỹ năng"),
  buildBlock("certificate", "certificate", "Chứng chỉ"),
];

const usedBlockIds = new Set(
  [...defaultLeftBlocks, ...defaultRightBlocks].map((b) => b.id)
);

const filteredUnusedBlocks = initialUnusedBlocks.filter(
  (b) => !usedBlockIds.has(b.id)
);

interface CVLayoutStore {
  layout: CVLayout;
  setLayout: (layout: CVLayout) => void;
  resetLayout: () => void;
  moveBlock: (
    id: string,
    from: DropZone,
    to: DropZone,
    toIndex?: number
  ) => void;
  reorderBlock: (zone: DropZone, activeId: string, overId: string) => void;
  updateBlockData: (id: string, data: Record<string, unknown>) => void;
  setBlockData: (id: string, data: Record<string, unknown>) => void;
}

const updateBlockInLayout = (
  layout: CVLayout,
  id: string,
  updater: (block: CVBlock) => CVBlock
): CVLayout => {
  const zones: DropZone[] = ["left", "right", "unused"];

  for (const zone of zones) {
    const index = layout[zone].findIndex((b) => b.id === id);
    if (index === -1) continue;

    const updatedZone = [...layout[zone]];
    updatedZone[index] = updater(updatedZone[index]);

    return {
      ...layout,
      [zone]: updatedZone,
    };
  }

  return layout;
};

export const useCVLayoutStore = create<CVLayoutStore>((set) => ({
  layout: {
    left: defaultLeftBlocks,
    right: defaultRightBlocks,
    unused: filteredUnusedBlocks,
  },
  setLayout: (layout) => set({ layout }),
  resetLayout: () =>
    set({
      layout: {
        left: defaultLeftBlocks,
        right: defaultRightBlocks,
        unused: filteredUnusedBlocks,
      },
    }),

  moveBlock: (id, from, to, toIndex) =>
    set((state) => {
      if (from === to) return state;

      const block = state.layout[from].find((b) => b.id === id);
      if (!block) return state;

      const newFrom = state.layout[from].filter((b) => b.id !== id);
      const newTo = [...state.layout[to]];

      if (
        typeof toIndex === "number" &&
        toIndex >= 0 &&
        toIndex <= newTo.length
      ) {
        newTo.splice(toIndex, 0, block);
      } else {
        newTo.push(block);
      }

      const newLayout = {
        ...state.layout,
        [from]: newFrom,
        [to]: newTo,
      };

      const usedIds = new Set(
        [...newLayout.left, ...newLayout.right].map((b) => b.id)
      );

      return {
        layout: {
          ...newLayout,
          unused: initialUnusedBlocks.filter((b) => !usedIds.has(b.id)),
        },
      };
    }),

  reorderBlock: (zone, activeId, overId) =>
    set((state) => {
      const list = state.layout[zone];
      const oldIndex = list.findIndex((b) => b.id === activeId);
      const newIndex = list.findIndex((b) => b.id === overId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return state;
      }

      return {
        layout: {
          ...state.layout,
          [zone]: arrayMove(list, oldIndex, newIndex),
        },
      };
    }),

  updateBlockData: (id, data) =>
    set((state) => ({
      layout: updateBlockInLayout(state.layout, id, (block) => ({
        ...block,
        data: {
          ...block.data,
          ...data,
        },
      })),
    })),

  setBlockData: (id, data) =>
    set((state) => ({
      layout: updateBlockInLayout(state.layout, id, (block) => ({
        ...block,
        data,
      })),
    })),
}));