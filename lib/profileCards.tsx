"use client";

import Image from "next/image";
import React, { useState } from "react";
import Tooltip from "./tooltip";

export interface profileCardsProps {
  image: string;
  name: string;
  tooltip: string;
  gif?: string;
}
const ProfileCards = ({ image, name, tooltip,gif }: profileCardsProps) => {
  const [currImage , setCurrImage] = useState(image);
  return (
    <div className="flex flex-col gap-6 group cursor-pointer">
      <Image
        src={currImage}
        onMouseEnter={() => {
          setCurrImage(gif || image)
        }}
        onMouseLeave={() => setCurrImage(image)}
        alt={name}
        width={200}
        height={200}
        className="rounded-full w-[200px] h-[200px] object-cover group-hover:border-2 border-white"
      />
      <div className="flex gap-2 items-center justify-center max-w-[200px]">
        <p className="text-lg text-center font-bold text-secondary-400 group-hover:text-primary-25">
          {name}
        </p>
        <Tooltip text={tooltip}>
          <Image src="/info.svg" alt="info" width={15} height={15} />{" "}
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileCards;
