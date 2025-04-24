import React from "react";
import Carosel from "../../../lib/Carosel";
import { SKILLS } from "../../../constants";
import Herosection from "../../../lib/HeroSection/Herosection";
import SavedProjectsAndSkills from "../../../lib/SavedProjectsAndSkills";
import ContactMe from "../../../lib/contactMe";

const AppPage = () => {
  return (
    <div>
      <Herosection />
     
      <SavedProjectsAndSkills />

      <Carosel carouselData={SKILLS} id={3} />

      <Carosel carouselData={SKILLS} id={2} />

      <Carosel carouselData={SKILLS} id={1} />

      <ContactMe />
    </div>
  );
};

export default AppPage;
