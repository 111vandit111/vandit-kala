"use client";

import React, { useState } from "react";
import SkillCard, { SkillCardProps } from "./SkillCard";

const ListAll = ({ title, cards }: { title: string; cards: SkillCardProps[] }) => {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredCards = cards.filter(
    (card) => query === "" || card.description.toLowerCase().includes(query) || card.name.toLowerCase().includes(query)
  );

  return (
    <div className="px-10 py-20 sm:px-5 mb-[120px] min-h-[calc(100vh-100px)] ">
      <div className="flex gap-6 items-center justify-between sm:flex-col sm:items-start sm:gap-0">
        <h1 className="text-5xl sm:text-3xl font-bold capitalize my-8 break-words">{title}</h1>
        <label htmlFor="list-search" className="sr-only">Search {title}</label>
        <input
          id="list-search"
          type="search"
          placeholder="Search"
          value={search}
          className="max-w-[400px] w-full my-6 p-2 min-h-11 rounded-md border border-default-gray bg-transparent focus-visible:ring-2 focus-visible:ring-prime outline-none"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filteredCards.length === 0 ? (
        <p className="rounded-xl bg-white/5 p-8 text-center text-secondary-400">No results</p>
      ) : (
        <div className="skill-grid">
          {filteredCards.map((card) => (
            <div key={card.path} className="w-fit mx-auto">
              <SkillCard {...card} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListAll;
