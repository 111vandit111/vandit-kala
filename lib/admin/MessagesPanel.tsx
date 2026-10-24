"use client";

import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button";
import { adminFetch, AdminApiError } from "./adminFetch";

interface AdminMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface MessagePage {
  data: AdminMessage[];
  page: number;
  pageSize: number;
  total: number;
}

const PAGE_SIZE = 20;
const ACTION_CLASS = "min-h-11 min-w-11 rounded-lg px-4 font-semibold focus-visible:ring-2 focus-visible:ring-prime outline-none disabled:opacity-50";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
};

const MessagesSkeleton = () => (
  <div role="status" aria-label="Loading messages" className="animate-pulse space-y-3">
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index} className="h-16 rounded-xl bg-white/10" />
    ))}
  </div>
);

interface MessageItemProps {
  item: AdminMessage;
  isExpanded: boolean;
  isConfirmingDelete: boolean;
  isBusy: boolean;
  onToggle: () => void;
  onToggleRead: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}

const MessageItem = ({
  item, isExpanded, isConfirmingDelete, isBusy, onToggle, onToggleRead, onAskDelete, onCancelDelete, onDelete,
}: MessageItemProps) => (
  <li className="rounded-xl bg-white/5">
    <button
      type="button"
      aria-expanded={isExpanded}
      onClick={onToggle}
      className="flex min-h-11 w-full items-center gap-3 rounded-xl p-4 text-left focus-visible:ring-2 focus-visible:ring-prime outline-none"
    >
      {!item.isRead && (
        <span className="shrink-0 rounded-full bg-prime px-2 py-0.5 text-xs font-bold text-white">Unread</span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block truncate ${item.isRead ? "" : "font-bold"}`}>{item.subject}</span>
        <span className="block truncate text-sm text-secondary-400">{item.name} | {formatDate(item.createdAt)}</span>
      </span>
    </button>
    {isExpanded && (
      <div className="space-y-4 border-t border-white/10 p-4">
        <p className="text-sm text-secondary-400 break-words">
          From {item.name} ({item.email})
        </p>
        <p className="whitespace-pre-wrap break-words">{item.message}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" disabled={isBusy} onClick={onToggleRead} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>
            {item.isRead ? "Mark unread" : "Mark read"}
          </button>
          {isConfirmingDelete ? (
            <>
              <span role="alert" className="text-sm text-alert-error">Delete this message?</span>
              <button type="button" disabled={isBusy} onClick={onDelete} className={`${ACTION_CLASS} bg-alert-error text-white`}>
                Yes, delete
              </button>
              <button type="button" onClick={onCancelDelete} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" disabled={isBusy} onClick={onAskDelete} className={`${ACTION_CLASS} text-alert-error hover:bg-white/10`}>
              Delete
            </button>
          )}
        </div>
      </div>
    )}
  </li>
);

const MessagesPanel = () => {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<MessagePage | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [confirmId, setConfirmId] = useState("");

  const load = useCallback(async (target: number) => {
    setIsLoading(true);
    setError("");
    try {
      const body = await adminFetch<MessagePage>(`/api/admin/messages?page=${target}&pageSize=${PAGE_SIZE}`);
      setResult(body);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load messages.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const setRead = async (item: AdminMessage, isRead: boolean) => {
    setBusyId(item._id);
    setActionError("");
    try {
      await adminFetch(`/api/admin/messages/${item._id}`, { method: "PATCH", body: JSON.stringify({ isRead }) });
      setResult((current) =>
        current ? { ...current, data: current.data.map((row) => (row._id === item._id ? { ...row, isRead } : row)) } : current
      );
    } catch (err) {
      setActionError(err instanceof AdminApiError ? err.message : "Could not update the message.");
    } finally {
      setBusyId("");
    }
  };

  const handleToggle = (item: AdminMessage) => {
    const isOpening = expandedId !== item._id;
    setExpandedId(isOpening ? item._id : "");
    setConfirmId("");
    if (isOpening && !item.isRead) setRead(item, true);
  };

  const handleDelete = async (item: AdminMessage) => {
    setBusyId(item._id);
    setActionError("");
    try {
      await adminFetch(`/api/admin/messages/${item._id}`, { method: "DELETE" });
      setConfirmId("");
      const isLastOnPage = (result?.data.length ?? 0) <= 1 && page > 1;
      if (isLastOnPage) setPage(page - 1);
      else await load(page);
    } catch (err) {
      setActionError(err instanceof AdminApiError ? err.message : "Could not delete the message.");
    } finally {
      setBusyId("");
    }
  };

  const items = result?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / PAGE_SIZE));
  const unreadCount = items.filter((item) => !item.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">Messages</h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-prime px-3 py-1 text-sm font-bold text-white">{unreadCount} unread</span>
        )}
      </div>

      {isLoading && <MessagesSkeleton />}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-white/5 p-6">
          <p className="text-sm text-alert-error">{error}</p>
          <Button variant="prime" className="mt-4 min-h-11 px-4" onClick={() => load(page)}>Retry</Button>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="rounded-xl bg-white/5 p-8 text-center text-secondary-400">No messages yet</p>
      )}

      {actionError && <p role="alert" className="text-sm text-alert-error">{actionError}</p>}

      {!isLoading && !error && items.length > 0 && (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <MessageItem
                key={item._id}
                item={item}
                isExpanded={expandedId === item._id}
                isConfirmingDelete={confirmId === item._id}
                isBusy={busyId === item._id}
                onToggle={() => handleToggle(item)}
                onToggleRead={() => setRead(item, !item.isRead)}
                onAskDelete={() => setConfirmId(item._id)}
                onCancelDelete={() => setConfirmId("")}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>
              Previous
            </button>
            <span className="text-sm text-secondary-400">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className={`${ACTION_CLASS} bg-white/10 hover:bg-white/20`}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesPanel;
