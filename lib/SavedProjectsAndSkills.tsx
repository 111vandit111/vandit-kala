"use client";

import React from "react";
import Carousel from "./Carosel";
import { useSavedProjectContext } from "../hooks/useSavedProjectContext";

const SavedProjectsAndSkills = () => {
  const { savedProjects } = useSavedProjectContext();

  if (!savedProjects || savedProjects.length === 0) return null;

  return <Carousel carouselData={savedProjects} id={4} name="Saved Projects" />;
};

export default SavedProjectsAndSkills;
