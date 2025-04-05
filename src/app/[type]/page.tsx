"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import Button from "../../../lib/Button";
import Tooltip from "../../../lib/tooltip";
import Carosel from "../../../lib/Carosel";
import { SKILLS } from "../../../constants";

const AppPage = () => { 
 const [showExpanded , setShowExpanded] = useState(false);
 const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

 const handleMouseEnter = () => {
   if (hideTimeoutRef.current) {
     clearTimeout(hideTimeoutRef.current);
     hideTimeoutRef.current = null;
   }
   setShowExpanded(true);
 };

 const handleMouseLeave = () => {
   hideTimeoutRef.current = setTimeout(() => {
     setShowExpanded(false);
     hideTimeoutRef.current = null;
   }, 2000);
 };
  return (
    <div>
      <div className="flex justify-start relative w-full items-center">
        <div className="relative p-10 pt-28 z-10 ">
        <div className="h-[25vw] md:h-[32.5vw] group/hero flex items-end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >
        <div className={`${showExpanded ? 'max-h-[320px]' : 'max-h-[200px]'} group-hover/hero:max-h-[320px]! group/hero-hover:opacity-0 transition-all duration-700 flex flex-col justify-end overflow-hidden`}>
          <Image
            src="/vanditkalaText.png"
            alt="logo"
            width={100}
            height={50}
            className="rounded-full cursor-pointer invert-100 xs:w-[100px] xs:h-[30px] xs:object-cover"
          />
          <p className="text-7xl sm:text-5xl xs:text-3xl py-4 font-bold">Vandit Kala</p>
          <p className="font-bold sm:text-xs text-alert-success">#Software Developer</p>

        <div className="max-w-[600px] sm:hidden font-semibold mt-2 overflow-hidden transition-transform duration-500">
          I&apos;m a full-stack developer passionate about building innovative,
          collaborative web applications. With expertise in Next.js, React, and
          cloud integrations, I&apos;ve worked on projects like Uxmagic.ai, where I
          created AI-driven wireframes using...
        </div>

        </div>
        </div>

       <div className="flex gap-3 mt-4">
        <Button variant="glassMoprhism" className="text-2xl px-5 py-3 sm:text-lg xs:text-xs sm:px-2 sm:py-1">
          Download Resume
        </Button>

       <Tooltip text="Leave a Star on Github" className="h-full">
        <Button variant="glassMoprhism" size="icon" className="group/button p-4! sm:p-2!">
          <Image src="/github.svg" alt="github" width={30} height={30} className="group-hover/button:invert sm:w-4.5 sm:h-4.5" />
        </Button>
       </Tooltip>
       <Tooltip text="Follow me on Linkedin" className="h-full">
        <Button variant="glassMoprhism" size="icon" className="group/button p-4! sm:p-2!">
          <Image src="/linkedin.svg" alt="linkedin" width={30} height={30} className="group-hover/button:invert sm:w-4.5 sm:h-4.5" />
        </Button>
       </Tooltip>
        </div>
        </div>
        <Image
          src={"/hero.png"}
          alt="hero"
          width={4500}
          height={4500}
          draggable={false}
          className="absolute max-w-[full] z-0 top-0 bottom-0 h-full object-cover object-right-bottom"
        />
      </div>

      <Carosel carouselData={SKILLS} />

      <Carosel carouselData={SKILLS} />

      <Carosel carouselData={SKILLS} />
    </div>
  );
};

export default AppPage;
