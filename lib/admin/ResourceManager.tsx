"use client";

import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button";
import { slugify } from "../server/slug";
import type { Resource } from "../server/limits";
import { adminFetch, AdminApiError } from "./adminFetch";
import FieldInput, { type FieldValue } from "./FieldInput";
import { resourceConfigs, type FieldConfig, type ResourceConfig } from "./resourceConfigs";

type Item = Record<string, unknown> & { _id: string };
type FormValues = Record<string, FieldValue>;
type FieldErrors = Record<string, string>;

interface ListResult {
  data: Item[];
  page: number;
  pageSize: number;
  total: number;
}

const PAGE_SIZE = 20;
const OPTIONS_PAGE_SIZE = 100;
const ACTION_CLASS = "min-h-11 min-w-11 rounded-lg px-4 font-semibold focus-visible:ring-2 focus-visible:ring-prime outline-none disabled:opacity-50";
const DEFAULT_VISIBLE = true;
const ORDER_FIELD = "order";

const initialValue = (field: FieldConfig, item?: Item): FieldValue => {
  const raw = item?.[field.name];
  if (field.type === "boolean") return item ? raw === true : field.name === "isVisible" ? DEFAULT_VISIBLE : false;
  if (field.pickFrom) return Array.isArray(raw) ? (raw as string[]) : [];
  if (field.type === "list") return Array.isArray(raw) ? (raw as string[]).join("\n") : "";
  if (field.type === "number") return raw === undefined || raw === null ? (item ? "" : "0") : String(raw);
  return typeof raw === "string" ? raw : "";
};

const buildValues = (config: ResourceConfig, item?: Item): FormValues =>
  Object.fromEntries(config.fields.map((field) => [field.name, initialValue(field, item)]));

const toPayloadValue = (field: FieldConfig, value: FieldValue): unknown => {
  if (field.type === "boolean" || field.pickFrom) return value;
  const text = String(value);
  if (field.type === "list") return text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (field.type === "number") return text.trim() === "" ? undefined : Number(text);
  return text.trim();
};

const buildPayload = (config: ResourceConfig, values: FormValues, isEditing: boolean): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};
  for (const field of config.fields) {
    if (isEditing && field.isLockedOnEdit) continue;
    const value = toPayloadValue(field, values[field.name]);
    if (value === undefined || (!isEditing && field.isOptional && value === "")) continue;
    payload[field.name] = value;
  }
  return payload;
};

const parseDetails = (details: unknown): FieldErrors => {
  const errors: FieldErrors = {};
  if (!Array.isArray(details)) return errors;
  for (const issue of details as { field?: unknown; message?: unknown }[]) {
    if (typeof issue?.field !== "string" || typeof issue.message !== "string") continue;
    const name = issue.field.split(".")[0];
    errors[name] = errors[name] ? `${errors[name]}; ${issue.message}` : issue.message;
  }
  return errors;
};

const itemTitle = (config: ResourceConfig, item: Item): string => {
  const title = item[config.titleField];
  return typeof title === "string" && title ? title : "(untitled)";
};

const Skeleton = () => (
  <div role="status" aria-label="Loading" className="animate-pulse space-y-3">
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index} className="h-16 rounded-xl bg-white/10" />
    ))}
  </div>
);

interface ResourceFormProps {
  resource: Resource;
  config: ResourceConfig;
  item?: Item;
  onSaved: (message: string) => void;
  onCancel: () => void;
}

const ResourceForm = ({ resource, config, item, onSaved, onCancel }: ResourceFormProps) => {
  const isEditing = Boolean(item);
  const [values, setValues] = useState<FormValues>(() => buildValues(config, item));
  const [isSlugTouched, setIsSlugTouched] = useState(isEditing);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const pickFields = config.fields.filter((field) => field.pickFrom);

  useEffect(() => {
    if (pickFields.length === 0) return;
    setIsLoadingOptions(true);
    Promise.all(
      pickFields.map(async (field) => {
        const body = await adminFetch<ListResult>(`/api/admin/${field.pickFrom}?page=1&pageSize=${OPTIONS_PAGE_SIZE}`);
        return [field.name, body.data.map((row) => String(row.slug))] as const;
      })
    )
      .then((entries) => setOptions(Object.fromEntries(entries)))
      .catch(() => setFormError("Could not load the list of related projects."))
      .finally(() => setIsLoadingOptions(false));
    // pickFields is derived from the static config
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const handleChange = (field: FieldConfig, value: FieldValue) => {
    setValues((current) => {
      const next = { ...current, [field.name]: value };
      if (field.name === "slug") return next;
      if (!isSlugTouched && config.slugSourceField === field.name && "slug" in current) {
        next.slug = slugify(String(value));
      }
      return next;
    });
    if (field.name === "slug") setIsSlugTouched(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setErrors({});
    setFormError("");
    const url = isEditing ? `/api/admin/${resource}/${item?._id}` : `/api/admin/${resource}`;
    try {
      await adminFetch(url, {
        method: isEditing ? "PATCH" : "POST",
        body: JSON.stringify(buildPayload(config, values, isEditing)),
      });
      onSaved(isEditing ? "Changes saved." : "Created.");
    } catch (err) {
      if (err instanceof AdminApiError) {
        setErrors(parseDetails(err.details));
        setFormError(err.message);
      } else {
        setFormError("Could not save. Please try again.");
      }
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl bg-white/5 p-4">
      <h2 className="text-xl font-bold">{isEditing ? `Edit ${config.label.toLowerCase()} item` : `Add to ${config.label.toLowerCase()}`}</h2>
      {config.fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={values[field.name]}
          error={errors[field.name]}
          isReadOnly={isEditing && field.isLockedOnEdit}
          options={options[field.name]}
          isLoadingOptions={isLoadingOptions}
          onChange={(value) => handleChange(field, value)}
        />
      ))}
      {formError && <p role="alert" className="text-sm text-alert-error">{formError}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="prime" className="min-h-11 px-4" disabled={isSaving}>
          {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create"}
        </Button>
        <button type="button" onClick={onCancel} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>
          Cancel
        </button>
      </div>
    </form>
  );
};

interface ItemRowProps {
  item: Item;
  config: ResourceConfig;
  isConfirming: boolean;
  isBusy: boolean;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}

const ItemRow = ({ item, config, isConfirming, isBusy, onEdit, onAskDelete, onCancelDelete, onDelete }: ItemRowProps) => {
  const hasVisibility = config.fields.some((field) => field.name === "isVisible");
  const hasOrder = config.fields.some((field) => field.name === ORDER_FIELD);
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl bg-white/5 p-4">
      <div className="min-w-0 flex-1 basis-48">
        <p className="break-words font-semibold">{itemTitle(config, item)}</p>
        <p className="text-sm text-secondary-400">
          {hasOrder && `Order ${String(item[ORDER_FIELD] ?? 0)}`}
          {hasVisibility && (item.isVisible === false ? " | Hidden" : " | Visible")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isConfirming ? (
          <>
            <span role="alert" className="text-sm text-alert-error">Delete this item?</span>
            <button type="button" disabled={isBusy} onClick={onDelete} className={`${ACTION_CLASS} bg-alert-error text-white`}>Yes, delete</button>
            <button type="button" onClick={onCancelDelete} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" onClick={onEdit} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>Edit</button>
            <button type="button" disabled={isBusy} onClick={onAskDelete} className={`${ACTION_CLASS} text-alert-error hover:bg-white/10`}>Delete</button>
          </>
        )}
      </div>
    </li>
  );
};

const ResourceManager = ({ resource }: { resource: Resource }) => {
  const config = resourceConfigs[resource];
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ListResult | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [confirmId, setConfirmId] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async (target: number) => {
    setIsLoading(true);
    setError("");
    try {
      setResult(await adminFetch<ListResult>(`/api/admin/${resource}?page=${target}&pageSize=${PAGE_SIZE}`));
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load items.");
    } finally {
      setIsLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const handleSaved = (message: string) => {
    setEditing(null);
    setNotice(message);
    load(page);
  };

  const handleDelete = async (item: Item) => {
    setBusyId(item._id);
    setActionError("");
    try {
      await adminFetch(`/api/admin/${resource}/${item._id}`, { method: "DELETE" });
      setConfirmId("");
      setNotice("Deleted.");
      if ((result?.data.length ?? 0) <= 1 && page > 1) setPage(page - 1);
      else await load(page);
    } catch (err) {
      setActionError(err instanceof AdminApiError ? err.message : "Could not delete the item.");
    } finally {
      setBusyId("");
    }
  };

  const startEditing = (target: Item | "new") => {
    setNotice("");
    setConfirmId("");
    setEditing(target);
  };

  const items = result?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{config.label}</h1>
        {!editing && (
          <Button variant="prime" className="min-h-11 px-4" onClick={() => startEditing("new")}>Add new</Button>
        )}
      </div>

      {notice && <p role="status" className="rounded-lg bg-white/5 p-3 text-sm text-alert-success">{notice}</p>}

      {editing && (
        <ResourceForm
          key={editing === "new" ? "new" : editing._id}
          resource={resource}
          config={config}
          item={editing === "new" ? undefined : editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      )}

      {isLoading && <Skeleton />}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-white/5 p-6">
          <p className="text-sm text-alert-error">{error}</p>
          <Button variant="prime" className="mt-4 min-h-11 px-4" onClick={() => load(page)}>Retry</Button>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="rounded-xl bg-white/5 p-8 text-center text-secondary-400">Nothing here yet</p>
      )}

      {actionError && <p role="alert" className="text-sm text-alert-error">{actionError}</p>}

      {!isLoading && !error && items.length > 0 && (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <ItemRow
                key={item._id}
                item={item}
                config={config}
                isConfirming={confirmId === item._id}
                isBusy={busyId === item._id}
                onEdit={() => startEditing(item)}
                onAskDelete={() => setConfirmId(item._id)}
                onCancelDelete={() => setConfirmId("")}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>Previous</button>
            <span className="text-sm text-secondary-400">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceManager;
