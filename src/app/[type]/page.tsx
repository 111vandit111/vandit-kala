import React from "react";
import Carosel from "../../../lib/Carosel";
import { SKILLS } from "../../../constants";
import Herosection from "../../../lib/HeroSection/Herosection";

const AppPage = () => {
  return (
    <div>
      <Herosection />

      <Carosel carouselData={SKILLS} id={3} />

      <Carosel carouselData={SKILLS} id={2} />

      <Carosel carouselData={SKILLS} id={1} />
    </div>
  );
};

export default AppPage;
