import React from "react";
import Button from "./Button";
import Tooltip from "./tooltip";
import Image from "next/image";

const ContactMe = () => {
  return (
    <div className="flex relative overflow-hidden z-10 p-4 mt-20 mb-10 md:flex-col">
      <div className="my-4 p-10 md:px-2 relative z-10 rounded-lg ">
        <div className="text-5xl font-bold">Contact Me</div>
        <div className="">
          <input
            type="text"
            placeholder="YOUR NAME"
            className="w-full my-4 p-2 py-3 rounded-md border-[0.5px] outline-0 border-default-gray"
          />
          <input
            type="email"
            placeholder="YOU'VE GOT MAIL"
            className="w-full my-4 p-2 py-3 rounded-md border-[0.5px] outline-0 border-default-gray"
          />
          <input
            type="text"
            placeholder="HEADER"
            className="w-full my-4 p-2 py-3 rounded-md border-[0.5px] outline-0 border-default-gray"
          />
          <textarea
            rows={4}
            placeholder="MESSAGE IN A BOTTLE"
            className="w-full my-4 p-2 py-3 rounded-md border-[0.5px] text-md resize-none outline-0 border-default-gray"
          />
        </div>
        <Button
          variant="glassMoprhism"
          size="xl"
          className="max-h-[400px] w-full py-4"
        >
          Submit
        </Button>
      </div>

      <div className="m-auto text-3xl font-black text-center md:hidden">
        Scoials
        <div className="flex gap-3 my-7">
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
    </div>
  );
};

export default ContactMe;
