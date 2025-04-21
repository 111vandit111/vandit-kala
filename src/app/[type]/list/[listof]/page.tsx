"use client";

import React, { useState } from "react";
import { SKILLS } from "../../../../../constants";
import SkillCard from "../../../../../lib/SkillCard";
import { useParams } from "next/navigation";

const ListAll = () => {
  const [search, setSearch] = useState("");

  const { listof } = useParams();

  const listOfSkills = SKILLS.filter((skill) => {
    if (search === "") return true;
    return (
      skill.description.toLowerCase().includes(search.toLowerCase()) ||
      skill.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="px-10 py-20 mb-[120px] min-h-[calc(100vh-100px)] ">
        <div className="flex gap-6 items-center justify-between">
        <p className="text-5xl font-bold capitalize my-8">
            {listof}
        </p>
      <input
        type="text"
        placeholder="Search"
        className="max-w-[400px] w-full my-6 p-2 rounded-md border border-default-gray"
        onChange={(e) => setSearch(e.target.value)}
      />
      </div>

      <div
        className="
         skill-grid"
      >
        {listOfSkills.map((skill, index) => (
          <div key={index} className="w-fit mx-auto">
            <SkillCard {...skill} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAll;
