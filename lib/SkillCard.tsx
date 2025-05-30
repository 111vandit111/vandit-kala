"use client";

import Image from "next/image";
import React from "react";
import Button from "./Button";
import Tooltip from "./tooltip";
import { useParams, useRouter } from "next/navigation";
import { useSavedProjectContext } from "../hooks/useSavedProjectContext";

export interface SkillCardProps {
  name: string;
  description: string;
  speciality: number;
  image: string;
  path: string;
}

const SkillCard = ({
  name,
  description,
  speciality,
  image,
  path,
}: SkillCardProps) => {
  const router = useRouter();
  const { type } = useParams();
  const { savedProjects, setSavedProjects } = useSavedProjectContext();

  const isSaved = savedProjects.some((project) => project.name === name);

  const handleSave = () => {
    if (!isSaved) {
      setSavedProjects([
        ...savedProjects,
        { name, description, speciality, image, path },
      ]);
    }
  };

  const handleRemove = () => {
    if (isSaved) {
      setSavedProjects(savedProjects.filter((proj) => proj.name !== name));
    }
  };

  return (
    <div className="group/cardGroup min-w-[180px] rounded-md relative z-1 bg-alert hover:z-30">
      <div className="h-full w-[184px] overflow-hidden rounded group-hover/cardGroup:scale-120 transition-transform duration-300 hover:bg-alert">
        <Image
          src={image}
          alt={name}
          width={244}
          height={137}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      <div
        className="absolute w-[222px] bg-black hidden p-4 rounded-b-xl pt-2 left-[-19px] top-[107%] 
                    shadow-lg transform transition-all group-hover/cardGroup:block animate-fade-in-card z-[1100]"
      >
        <div className="space-y-2">
          <h2 className="text-base font-bold text-white">{name}</h2>
          <Button
            variant="glassMoprhism"
            size="2xl"
            className="group/button w-full text-center"
            onClick={() => router.push(`/${type}${path}`)}
          >
            View Details
          </Button>
          <div className="flex gap-2 my-2">
            <Tooltip text={isSaved ? "Unsave Project" : "Save Project"}>
              <Button
                variant="glassMoprhism"
                size="icon"
                className="group/button p-2! sm:p-2!"
              >
                <Image
                  src={isSaved ? "/sub.svg" : "/add.svg"}
                  alt={isSaved ? "Remove project" : "Add project"}
                  width={24}
                  height={24}
                  onClick={isSaved ? handleRemove : handleSave}
                  className={isSaved ? "group-hover/button:invert" : "group-hover/button:invert-0 invert" } 
                />
              </Button>
            </Tooltip>
            <Tooltip text="Endorse on Linkedin">
              <Button
                variant="glassMoprhism"
                size="icon"
                className="group/button p-2! sm:p-2!"
              >
                <Image
                  src="/linkedin.svg"
                  alt="linkedin"
                  width={24}
                  height={24}
                  className="group-hover/button:invert"
                />
              </Button>
            </Tooltip>
          </div>
          <div className="flex gap-2 items-center">
            <Image
              src="/bluetick.svg"
              alt="Verified"
              className="bg-white rounded-full p-0"
              width={16}
              height={16}
            />
            <p className="text-xs text-white font-bold my-2">Verified</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-default-100 font-bold">2023</p>
            <p className="font-bold text-white bg-[#282a2e] p-1 rounded-sm">
              {speciality}
            </p>
          </div>
          <p className="text-base text-white/90 text-ellipsis overflow-hidden line-clamp-2 font-semibold">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
