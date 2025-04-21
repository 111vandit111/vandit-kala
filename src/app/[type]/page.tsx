import React from "react";
import Carosel from "../../../lib/Carosel";
import { SKILLS } from "../../../constants";
import Herosection from "../../../lib/HeroSection/Herosection";
import SavedProjectsAndSkills from "../../../lib/SavedProjectsAndSkills";

const AppPage = () => {
  return (
    <div className="mb-40">
      <Herosection />
     
      <SavedProjectsAndSkills />

      <Carosel carouselData={SKILLS} id={3} />

      <Carosel carouselData={SKILLS} id={2} />

      <Carosel carouselData={SKILLS} id={1} />
    </div>
  );
};

export default AppPage;
