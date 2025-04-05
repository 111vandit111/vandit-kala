import React, { useState } from 'react'
import SkillCard, { SkillCardProps } from './SkillCard'

const Carousel = ({carouselData} :{carouselData: SkillCardProps[]}) => {
  const [index, setIndex] = useState(0);
  const cardsPerPage = 4;
  const cardWidth = 220;

  const maxIndex = Math.max(0, Math.ceil(carouselData.length / cardsPerPage) - 1);

  const handleNext = () => {
    if (index < maxIndex) setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  return (
    <div className="relative w-full px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-white">Amazon Originals</h2>

      <div className="relative overflow-x-clip">
        {index > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 z-20 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
          >
            {"<"}
          </button>
        )}

        {index < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-20 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
          >
            {">"}
          </button>
        )}

        <div className="">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6 relative z-15 pl-3"
            style={{
              transform: `translateX(-${index * (cardWidth * cardsPerPage)}px)`,
            }}
          >
            {carouselData.map((card, id) => (
              <SkillCard key={id} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel

