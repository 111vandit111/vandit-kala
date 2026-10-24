"use client";

import React from "react";
import type { FieldConfig } from "./resourceConfigs";

export type FieldValue = string | boolean | string[];

interface FieldInputProps {
  field: FieldConfig;
  value: FieldValue;
  error?: string;
  isReadOnly?: boolean;
  /** Slugs offered by multi-select fields (`pickFrom`). */
  options?: string[];
  isLoadingOptions?: boolean;
  onChange: (value: FieldValue) => void;
}

const INPUT_CLASS =
  "w-full rounded-md border-[0.5px] border-default-gray bg-transparent p-2 py-3 text-white outline-0 focus-visible:ring-2 focus-visible:ring-prime read-only:opacity-60";
const TEXTAREA_ROWS = 6;

const Counter = ({ length, max }: { length: number; max: number }) => (
  <span className={`text-xs ${length > max ? "text-alert-error" : "text-secondary-400"}`}>
    {length}/{max}
  </span>
);

const OptionPicker = ({ id, field, value, options, isLoading, onChange }: {
  id: string;
  field: FieldConfig;
  value: string[];
  options: string[];
  isLoading?: boolean;
  onChange: (value: string[]) => void;
}) => {
  const all = Array.from(new Set([...options, ...value]));
  if (isLoading) return <p className="text-sm text-secondary-400">Loading options...</p>;
  if (all.length === 0) return <p className="text-sm text-secondary-400">No options available</p>;
  const toggle = (slug: string) =>
    onChange(value.includes(slug) ? value.filter((item) => item !== slug) : [...value, slug]);
  return (
    <div id={id} role="group" aria-label={field.label} className="flex flex-wrap gap-2">
      {all.map((slug) => (
        <label key={slug} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-3 break-all">
          <input type="checkbox" checked={value.includes(slug)} onChange={() => toggle(slug)} className="h-4 w-4 accent-prime" />
          {slug}
        </label>
      ))}
    </div>
  );
};

const FieldInput = ({ field, value, error, isReadOnly, options = [], isLoadingOptions, onChange }: FieldInputProps) => {
  const id = `field-${field.name}`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;
  const text = typeof value === "string" ? value : "";

  const control = (() => {
    if (field.type === "boolean") {
      return (
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
            className="h-5 w-5 accent-prime"
          />
          <span className="font-semibold">{field.label}</span>
        </label>
      );
    }
    if (field.pickFrom && Array.isArray(value)) {
      return (
        <OptionPicker id={id} field={field} value={value} options={options} isLoading={isLoadingOptions} onChange={onChange} />
      );
    }
    if (field.type === "textarea" || field.type === "list") {
      return (
        <textarea
          id={id}
          rows={TEXTAREA_ROWS}
          value={text}
          readOnly={isReadOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={`${INPUT_CLASS} resize-y`}
        />
      );
    }
    const inputType = field.type === "url" ? "url" : field.type === "number" ? "number" : "text";
    return (
      <input
        id={id}
        type={inputType}
        inputMode={field.type === "number" ? "numeric" : undefined}
        value={text}
        readOnly={isReadOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={INPUT_CLASS}
      />
    );
  })();

  return (
    <div className="space-y-1">
      {field.type !== "boolean" && (
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={id} className="font-semibold">
            {field.label}
            {field.isOptional && <span className="ml-1 text-sm font-normal text-secondary-400">(optional)</span>}
          </label>
          {field.maxLength && field.type !== "url" && <Counter length={text.length} max={field.maxLength} />}
        </div>
      )}
      {control}
      {field.hint && <p className="text-xs text-secondary-400">{field.hint}</p>}
      {error && <p id={errorId} role="alert" className="text-sm text-alert-error">{error}</p>}
    </div>
  );
};

export default FieldInput;
