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
  const [openMenu, setOpenMenu] = useState<boolean>(false);
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
    <div className="fixed top-0 z-50 w-full px-[6%] sm:px-0 sm:sticky ">
      <div
        className={`flex justify-between sm:hidden rounded-b-2xl items-center px-3 pr-10 ${
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
            onClick={() => {
              setShowPopup(!showPopup);
            }}
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
          />
          <div
            className={`absolute right-0 w-max ${
              showPopup ? "block" : "hidden"
            } group-hover:block duration-500 transition-all animate-fade-in`}
          >
            <div
              className={`${
                scrolled ? "bg-[#3b3b3be1] backdrop-blur-lg" : "bg-white/5"
              } shadow-lg backdrop-blur-lg shadow-[#1a1c28] w-max p-3 mt-3 rounded-2xl`}
            >
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
      <div className="hidden sm:flex items-center justify-between px-4 bg-[#1a1c28] w-full">
        <div
          className={`flex gap-2 items-center cursor-pointer relative ${
            openMenu && "bg-white/30 shadow-white shadow-sm"
          } p-1.5 rounded-lg`}
          onClick={() => setOpenMenu(!openMenu)}
        >
          Menu{" "}
          <span>
            <Image
              src={"/chevron.svg"}
              alt="logo"
              width={20}
              height={20}
              className={`cursor-pointer transition-transform duration-300 ${
                openMenu && "rotate-180"
              }`}
            />
          </span>
          {openMenu && (
            <div className="flex flex-col absolute animate-fade-in gap-4 bg-white/5 shadow-lg backdrop-blur-lg shadow-[#1a1c28] w-max p-3 mt-3 rounded-2xl top-8">
              {NAV_MENU_BY_PROFILE[type as string].map((item, index) => {
                return (
                  <Link
                    key={index}
                    href={item.section}
                    className="text-lg font-[550] text-white"
                  >
                    {item.heading}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <Image
          className="cursor-pointer p-2 mt-2 object-cover"
          src="/vanditkalahero.png"
          alt="logo"
          width={60}
          height={20}
        />
        <div className="relative group">
          <Image
            className="cursor-pointer rounded-full h-10 w-10 object-cover"
            src={PROFILE_IMAGES[type as string].image}
            alt="Profile"
            width={30}
            height={30}
            onClick={() => setShowPopup(!showPopup)}
          />
          <div
            className={`absolute hidden right-0 w-max duration-500 transition-all animate-fade-in`}
            style={{ display: showPopup ? "block" : "none" }}
          >
            <div
              className={`bg-white/5 shadow-lg backdrop-blur-lg shadow-[#1a1c28] w-max p-3 mt-3 rounded-2xl`}
            >
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
