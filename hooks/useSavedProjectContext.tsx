/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SkillCardProps } from "../lib/SkillCard";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const SavedProjectContext = createContext<{
  savedProjects: SkillCardProps[];
  setSavedProjects: React.Dispatch<React.SetStateAction<SkillCardProps[]>>;
} | null>(null);

export const SavedProjectProvider = ({ children }: React.PropsWithChildren) => {
  const { getLocalStorage, setLocalStorage } = useLocalStorage();
  const [savedProjects, setSavedProjects] = useState<SkillCardProps[]>([]);

  useEffect(() => {
    const stored = getLocalStorage("savedProjects");
    if (stored && Array.isArray(stored)) {
      setSavedProjects(stored);
    }
  }, []);

  useEffect(() => {
    setLocalStorage("savedProjects", savedProjects);
  }, [savedProjects]);

  return (
    <SavedProjectContext.Provider value={{ savedProjects, setSavedProjects }}>
      {children}
    </SavedProjectContext.Provider>
  );
};

export const useSavedProjectContext = () => {
  const context = useContext(SavedProjectContext);
  if (!context) {
    throw new Error("useSavedProjectContext must be used within a SavedProjectProvider");
  }
  return context;
};
