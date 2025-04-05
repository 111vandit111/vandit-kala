import Image from "next/image";
import React from "react";
import Tooltip from "./tooltip";

const Footer = ({isNotHome = false}: Readonly<{isNotHome?: boolean}>) => {
  return (
    <div className={`flex justify-between items-center ${!isNotHome && 'absolute' } bottom-0 w-full px-4 md:relative md:mt-5 xs:flex-col sm:gap-4`}>
      <div className="flex gap-4">
        <Tooltip text="Github">
          <Image src="/github.svg" alt="github" width={30} height={30} />
        </Tooltip>
        <Tooltip text="Linkedin">
          <Image src="/linkedin.svg" alt="linkedin" width={30} height={30} />
        </Tooltip>
        <Tooltip text="Instagram">
          <Image src="/instagram.svg" alt="instagram" width={30} height={30} />
        </Tooltip>
      </div>
      <Image
        src={"/logo.png"}
        alt="logo"
        width={100}
        height={100}
        className="rounded-full cursor-pointer invert-100"
      />
      <div>
        <Image
          src="/vanditkalaText.png"
          alt="logo"
          width={100}
          height={50}
          className="rounded-full cursor-pointer invert-100 object-cover h-[40px]"
        />
        <p className="text-sm text-center font-bold"> © 2025</p>
      </div>
    </div>
  );
};

export default Footer;
