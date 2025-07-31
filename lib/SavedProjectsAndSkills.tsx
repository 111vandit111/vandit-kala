"use client";

import React from "react";
import Carousel from "./Carosel";
import { useSavedProjectContext } from "../hooks/useSavedProjectContext";
import { useParams } from "next/navigation";
import { TYPES_OF_PROFILES } from "../constants";

const SavedProjectsAndSkills = () => {
  const { savedProjects } = useSavedProjectContext();
  const { type } = useParams();

  if(type !== TYPES_OF_PROFILES.RECRUITER) return null

  if (!savedProjects || savedProjects.length === 0) return null;

  return <div id="saved"> <Carousel carouselData={savedProjects} id={4} name="Saved Projects" listOf="Saved Projects" /></div>;
};

export default SavedProjectsAndSkills;
