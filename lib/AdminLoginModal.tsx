"use client";

import React, { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import Modal from "./Modal";

const LOGIN_URL = "/api/admin/login";
const SESSION_URL = "/api/admin/session";
const ADMIN_HOME = "/admin";
const SECONDS_PER_MINUTE = 60;
const STATUS_UNAUTHORIZED = 401;
const STATUS_TOO_MANY_REQUESTS = 429;

const INVALID_PASSWORD = "Invalid password";
const NETWORK_ERROR = "Something went wrong. Please try again.";

function rateLimitMessage(retryAfterHeader: string | null): string {
  const seconds = Number.parseInt(retryAfterHeader ?? "", 10);
  const minutes = Math.max(1, Math.ceil((Number.isFinite(seconds) ? seconds : SECONDS_PER_MINUTE) / SECONDS_PER_MINUTE));
  return `Too many attempts, try again in ${minutes} min`;
}

async function checkExistingSession(): Promise<boolean> {
  try {
    const response = await fetch(SESSION_URL);
    if (!response.ok) return false;
    const body: unknown = await response.json();
    return (body as { data?: { isAdmin?: boolean } }).data?.isAdmin === true;
  } catch {
    return false;
  }
}

const AdminLoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  const inputId = useId();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;
    checkExistingSession().then((isAdmin) => {
      if (isAdmin && !isCancelled) router.push(ADMIN_HOME);
    });
    return () => {
      isCancelled = true;
      setPassword("");
      setErrorText("");
    };
  }, [isOpen, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorText("");
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        router.push(ADMIN_HOME);
        return;
      }
      if (response.status === STATUS_TOO_MANY_REQUESTS) {
        setErrorText(rateLimitMessage(response.headers.get("Retry-After")));
      } else {
        setErrorText(response.status === STATUS_UNAUTHORIZED ? INVALID_PASSWORD : NETWORK_ERROR);
      }
    } catch {
      setErrorText(NETWORK_ERROR);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Owner sign in">
      <form onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="block text-sm text-secondary-400 mb-1">
          Password
        </label>
        <input
          id={inputId}
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full p-2 py-3 rounded-md border-[0.5px] outline-0 border-default-gray bg-transparent focus-visible:ring-2 focus-visible:ring-prime"
        />
        {errorText && (
          <p role="alert" className="text-alert-error text-sm mt-2">
            {errorText}
          </p>
        )}
        <Button
          type="submit"
          variant="prime"
          disabled={isSubmitting}
          className="w-full min-h-11 mt-4"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Modal>
  );
};

export default AdminLoginModal;
