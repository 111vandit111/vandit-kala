import React, { useEffect, useRef, useState } from 'react'
import SkillCard, { SkillCardProps } from './SkillCard'

const Carousel = ({carouselData , id} :{carouselData: SkillCardProps[] , id : number}) => {
  const [index, setIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 244;
  const gap = 24; // Tailwind gap-6 = 1.5rem = 24px

  useEffect(() => {
    const calculateCardsPerPage = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalCardSpace = cardWidth + gap;
        const count = Math.floor(containerWidth / totalCardSpace);
        setCardsPerPage(Math.max(1, count));
      }
    };

    calculateCardsPerPage();
    window.addEventListener('resize', calculateCardsPerPage);
    return () => window.removeEventListener('resize', calculateCardsPerPage);
  }, []);

  const maxIndex = Math.max(0, Math.ceil(carouselData.length / cardsPerPage) - 1);

  if(index > maxIndex){
    setIndex(maxIndex);
  }

  const handleNext = () => {
    if (index < maxIndex) setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  return (
    <div className="relative w-full px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-white">Amazon Originals</h2>

      <div className="relative overflow-x-clip sm:overflow-x-scroll scrollbar-hide">

        <div className="" ref={containerRef}>
          <div
            className={`flex transition-transform duration-500 ease-in-out gap-6 relative z-10 pl-3`}
            style={{
              transform: `translateX(-${index * (cardWidth * cardsPerPage + 24*cardsPerPage)}px)`,
              zIndex: 9+(2*id),
            }}
          >
            {carouselData.map((card, id) => (
             <div
             key={id}
             className='relative'
             style={{ minWidth: `${cardWidth}px`, maxWidth: `${cardWidth}px` }}
           >
             <SkillCard {...card} />
           </div>
            ))}

           {index > 0 && (
          <button
            onClick={handlePrev}
            style={{ zIndex: 20 , left: `${index * (cardWidth * cardsPerPage + 24*cardsPerPage)}px` }}
            className="absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-xl h-[calc(100%+32px)] sm:hidden text-xl font-semibold px-4 py-3 text-white"
          >
            {"<"}
          </button>
        )}

        {index < maxIndex && (
          <button
            onClick={handleNext}
            style={{ zIndex: 20 , right: `-${index * (cardWidth * cardsPerPage + 24*cardsPerPage)}px` }}
            className="absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-xl h-[calc(100%+32px)] sm:hidden text-xl font-semibold px-4 py-3 text-white"
          >
            {">"}
          </button>
        )}

          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Carousel

