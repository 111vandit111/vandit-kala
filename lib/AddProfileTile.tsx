"use client";

import React, { useState } from "react";
import AdminLoginModal from "./AdminLoginModal";

const AddProfileTile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Add new profile (owner only)"
        onClick={() => setIsModalOpen(true)}
        className="group flex flex-col gap-4 xs:mb-4 cursor-pointer min-h-11 min-w-11 focus-visible:outline-2 focus-visible:outline-prime rounded-full"
      >
        <div className="rounded-full w-[200px] bg-alert-purple-light/90 text-7xl font-bold h-[200px] flex text-secondary-400 items-center justify-center object-cover group-hover:border-2 border-white">
          +
        </div>
        <div className="flex gap-2 items-center justify-center max-w-[200px]">
          <p className="text-lg text-center font-bold text-secondary-400 group-hover:text-primary-25">
            Add New
          </p>
        </div>
      </button>
      <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddProfileTile;
