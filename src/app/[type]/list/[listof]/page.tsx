import React from "react";
import { notFound } from "next/navigation";
import ListAll from "../../../../../lib/ListAll";
import { SECTION_TITLES_BY_PROFILE, isProfileType } from "../../../../../constants";
import { getCards } from "../../../../../lib/server/cardMapper";
import { RESOURCES, type Resource } from "../../../../../lib/server/limits";

export const dynamic = "force-dynamic";

const LISTABLE_RESOURCES = RESOURCES.filter((resource) => resource !== "texts");

const isListable = (value: string): value is Resource => LISTABLE_RESOURCES.some((resource) => resource === value);

const ListPage = async ({ params }: { params: Promise<{ type: string; listof: string }> }) => {
  const { type, listof } = await params;
  if (!isProfileType(type) || !isListable(listof)) notFound();

  const title = SECTION_TITLES_BY_PROFILE[type][listof] ?? listof;

  try {
    const cards = await getCards(listof);
    return <ListAll title={title} cards={cards} />;
  } catch (error) {
    console.error("List page failed to load:", error instanceof Error ? error.message : error);
    return (
      <div role="alert" className="px-10 py-32 text-center sm:px-5">
        <h1 className="text-3xl font-bold capitalize">{title}</h1>
        <p className="mt-4 text-secondary-400">We could not load this list. Please refresh in a moment.</p>
      </div>
    );
  }
};

export default ListPage;
