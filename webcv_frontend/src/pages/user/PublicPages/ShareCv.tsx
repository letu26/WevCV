import Preview from "@/components/user/cvpreview/Preview";
import { getSharedCvByToken } from "@/services/usersservices/CvsServices";
import { useCVLayoutStore } from "@/store/cvLayoutStore";
import type { CVBlock, CVLayout, CVSavePayload } from "@/types/cv";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ShareCv() {
  const { token } = useParams<{ token: string }>();
  const { setLayout, resetLayout } = useCVLayoutStore();

  const [cv, setCv] = useState<CVSavePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;

    const fetchSharedCv = async () => {
      if (!token) {
        setLoading(false);
        setError("Invalid share link.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await getSharedCvByToken(token);
        if (cancelled) return;

        const sharedCv = res.data;
        setCv(sharedCv);
        setLayout(buildLayoutFromPayload(sharedCv));
      } catch (error) {
        if (cancelled) return;

        if (axios.isAxiosError(error)) {
          const message =
            (error.response?.data as any)?.message ?? "Failed to load CV.";
          setError(String(message));
        } else {
          setError("Failed to load CV.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSharedCv();

    return () => {
      cancelled = true;
      resetLayout();
    };
  }, [resetLayout, setLayout, token]);

  const title = cv?.title?.trim() || "Shared CV";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">Read-only</p>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : error ? (
            <div className="rounded-xl border bg-white p-6 text-red-600">
              {error}
            </div>
          ) : (
            <div className="rounded-xl border bg-white overflow-auto">
              <div className="pointer-events-none select-none">
                <Preview mode="modal" readOnly />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}