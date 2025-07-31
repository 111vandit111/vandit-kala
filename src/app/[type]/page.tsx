import React from "react";
import Herosection from "../../../lib/HeroSection/Herosection";
import SavedProjectsAndSkills from "../../../lib/SavedProjectsAndSkills";
import ContactMe from "../../../lib/contactMe";
import ListOfCarouselSection from "../../../lib/ListOfCarouselSection/ListOfCarouselSection";

const AppPage = () => {
  return (
    <div>
      <Herosection />
     
      <SavedProjectsAndSkills />

      <ListOfCarouselSection />

      <ContactMe />
    </div>
  );
};

export default AppPage;
