"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NAV_MENU_BY_PROFILE, PROFILE_IMAGES } from "../constants";
import Button from "./Button";
import Link from "next/link";

const InternalNavBar = () => {
  const { type } = useParams();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();

  return (
    <div className="fixed top-0 z-50 w-full px-[6%]">
      <div
        className={`flex justify-between rounded-b-2xl items-center px-3 pr-10 ${
          scrolled ? "bg-white/5 shadow-lg backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex gap-5 items-center">
          <Image
            className="cursor-pointer p-2 mt-2 object-cover"
            src="/vanditkalahero.png"
            alt="logo"
            width={60}
            height={20}
          />
          <div className="flex gap-7 md:gap-3.5">
            {NAV_MENU_BY_PROFILE[type as string].map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.section}
                  className="text-lg md:text-xs font-[550] text-white"
                >
                  {item.heading}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="relative group">
          <Image
            className="cursor-pointer rounded-full h-10 w-10 object-cover"
            src={PROFILE_IMAGES[type as string].image}
            alt="Profile"
            width={30}
            height={30}
            onClick={() => setShowPopup(!showPopup)}
          />
          <div className={`absolute hidden right-0 w-max group-hover:block duration-500 transition-all animate-fade-in`}>
            <div className={`${scrolled ? 'bg-[#3b3b3be1] backdrop-blur-lg' : 'bg-white/5'} shadow-lg backdrop-blur-lg shadow-[#1a1c28] w-max p-3 mt-3 rounded-2xl`}>
              <div className="mb-2">
                Current Profile: {PROFILE_IMAGES[type as string].heading}
              </div>
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={() => router.push("/")}
              >
                Change Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalNavBar;
