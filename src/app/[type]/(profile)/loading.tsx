import React from "react";

const SKELETON_CARD_COUNT = 6;

const Loading = () => {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse">
      <div className="px-10 pb-12 pt-32 sm:px-5 sm:pt-24">
        <div className="h-4 w-64 max-w-full rounded-md bg-white/10" />
        <div className="mt-6 h-16 w-96 max-w-full rounded-md bg-white/10" />
        <div className="mt-4 h-8 w-[600px] max-w-full rounded-md bg-white/10" />
        <div className="mt-8 h-11 w-40 rounded-lg bg-white/10" />
      </div>
      <div className="flex gap-2 overflow-hidden px-6 py-10">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <div key={index} className="h-[103px] w-[184px] shrink-0 rounded bg-white/10" />
        ))}
      </div>
    </div>
  );
};

export default Loading;
