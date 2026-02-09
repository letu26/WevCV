import React, { useLayoutEffect, useRef } from "react";
import "./cv-builder/cvbuilder.css";

export function AutoTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { className, onInput, value, readOnly, ...rest } = props;
  const minRows = rest.rows ?? 1;

  const resize = () => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto"; // reset
    const computedStyle = window.getComputedStyle(el);
    const rawLineHeight = computedStyle.lineHeight || "0";
    let lineHeight = Number.parseFloat(rawLineHeight);
    if (Number.isNaN(lineHeight)) {
      const fontSize = Number.parseFloat(computedStyle.fontSize || "0");
      lineHeight = fontSize > 0 ? fontSize * 1.4 : 0;
    }
    const minHeight =
      lineHeight > 0 ? Math.ceil(lineHeight * minRows) : 0;
    const nextHeight = Math.max(el.scrollHeight, minHeight);
    el.style.height = nextHeight + "px"; // set theo nội dung
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    onInput?.(event);
    resize();
  };

  useLayoutEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      spellCheck={false}
      ref={ref}
      rows={minRows}
      onInput={handleInput}
      className={`cv-textarea ${className ?? ""}`}
      value={value}
      readOnly={readOnly}
      {...rest}
    />
  );
}
