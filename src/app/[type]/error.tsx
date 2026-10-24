"use client";

import React from "react";
import Button from "../../../lib/Button";

const ErrorPage = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-3xl font-bold">Something went wrong</h2>
      <p className="text-secondary-400">This page could not be loaded. Please try again.</p>
      <Button variant="prime" size="xl" onClick={reset} className="min-h-11">
        Try again
      </Button>
    </div>
  );
};

export default ErrorPage;
