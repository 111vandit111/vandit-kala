"use client";

import Image from "next/image";
import React from "react";
import Button from "../Button";
import Tooltip from "../tooltip";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation";

const DetailsHero = () => {
  const { detail } = useParams();
  return (
    <div className="relative">
      <div className="relative p-10 pt-28 z-10 ">
        <div
          className="h-[25vw] md:h-[32.5vw] group/hero flex items-end"
        >
          <div
            className={`transition-all duration-700 flex flex-col justify-end overflow-hidden line-clamp-4`}
          >
            <Image
              src="/vanditkalaText.png"
              alt="logo"
              width={100}
              height={50}
              className="rounded-full cursor-pointer invert-100 xs:w-[100px] xs:h-[30px] xs:object-cover"
            />
            <p className="text-7xl sm:text-5xl xs:text-3xl capitalize py-4 font-bold">
              {detail}
            </p>
            <p className="font-bold sm:text-xs text-alert-success">
              #Software Developer
            </p>

            <div className="max-w-[600px] sm:hidden font-semibold mt-2 overflow-hidden transition-transform duration-500">
              I&apos;m a full-stack developer passionate about building
              innovative, collaborative web applications. With expertise in
              Next.js, React, and cloud integrations, I&apos;ve worked on
              projects like Uxmagic.ai, where I created AI-driven wireframes
              using React and Next.js. I&apos;ve also worked on projects like
              Hoonr.ai, where I created AI-driven wireframes using React and
              Next.js. I&apos;ve also worked on projects like Hoonr.ai, where I
              created AI-driven wireframes using React and Next.js.
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="glassMoprhism"
            className="text-2xl px-5 py-3 sm:text-lg xs:text-xs sm:px-2 sm:py-1"
          >
            Download Resume
          </Button>

          <Tooltip text="Leave a Star on Github" className="h-full">
            <Button
              variant="glassMoprhism"
              size="icon"
              className="group/button p-4! sm:p-2!"
            >
              <Image
                src="/github.svg"
                alt="github"
                width={30}
                height={30}
                className="group-hover/button:invert sm:w-4.5 sm:h-4.5"
              />
            </Button>
          </Tooltip>
          <Tooltip text="Follow me on Linkedin" className="h-full">
            <Button
              variant="glassMoprhism"
              size="icon"
              className="group/button p-4! sm:p-2!"
            >
              <Image
                src="/linkedin.svg"
                alt="linkedin"
                width={30}
                height={30}
                className="group-hover/button:invert sm:w-4.5 sm:h-4.5"
              />
            </Button>
          </Tooltip>
        </div>
      </div>
      <CldImage
        src={
          "https://res.cloudinary.com/dfwtzxgi5/image/upload/v1743753603/40e63003-c30f-42a3-aa0c-cea241c08e00.png"
        }
        alt="hero"
        width={4500}
        height={4500}
        draggable={false}
        className="absolute max-w-[full] z-0 top-0 bottom-0 h-full object-cover object-right-bottom"
      />
    </div>
  );
};

export default DetailsHero;
