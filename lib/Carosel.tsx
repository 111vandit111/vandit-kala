"use client";

import React, { useEffect, useRef, useState } from 'react'
import SkillCard, { SkillCardProps } from './SkillCard'
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Resource } from './server/limits';

const Carousel = ({carouselData , name = "My Skills" , listof} :{carouselData: SkillCardProps[] , id ?: number , name ?: string , listof ?: Resource}) => {
  const [index, setIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const { type } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 184;
  const gap = 8;

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
    <div role="region" aria-label={name} className="relative z-0 w-full px-6 py-8 hover:z-30 focus-within:z-30 sm:px-8">
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h2 className="text-2xl font-bold text-white sm:text-xl">{name}</h2>

        {listof && (
          <Link href={`/${type}/list/${listof}`} className='flex min-h-11 shrink-0 items-center gap-1 rounded text-base font-semibold text-prime hover:text-white focus-visible:ring-2 focus-visible:ring-prime outline-none'>
            See More <Image src={"/chevron.svg"} className='rotate-270' alt="" width={15} height={15} />
          </Link>
        )}
      </div>

      <div className="relative -mx-6 overflow-x-clip px-6 sm:-mx-8 sm:snap-x sm:overflow-x-auto sm:px-8 sm:py-1 scrollbar-hide">

        <div className="" ref={containerRef}>
          <div
            className={`flex transition-transform duration-500 ease-in-out gap-2 relative pl-3 sm:pl-0`}
            style={{
              transform: `translateX(-${index * (cardWidth * cardsPerPage + gap*cardsPerPage)}px)`,
            }}
          >
            {carouselData.map((card) => (
             <div
             key={card.path}
             className='relative sm:snap-start'
             style={{ minWidth: `${cardWidth}px`, maxWidth: `${cardWidth}px` }}
           >
             <SkillCard {...card} />
           </div>
            ))}

           {index > 0 && (
          <button
            onClick={handlePrev}
            aria-label={`Previous ${name}`}
            style={{ zIndex: 20 , left: `${index * (cardWidth * cardsPerPage + gap*cardsPerPage)}px` }}
            className="absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-xl h-[calc(100%+32px)] sm:hidden text-xl font-semibold px-4 py-3 text-white"
          >
            <Image src={"/chevron.svg"} className='rotate-90 max-w-none' alt="" width={15} height={15} />
          </button>
        )}

        {index < maxIndex && (
          <button
            onClick={handleNext}
            aria-label={`Next ${name}`}
            style={{ zIndex: 20 , right: `-${index * (cardWidth * cardsPerPage + gap*cardsPerPage)}px` }}
            className="absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-xl h-[calc(100%+32px)] sm:hidden text-xl font-semibold px-4 py-3 text-white"
          >
            <Image src={"/chevron.svg"} className='rotate-270' alt="" width={15} height={15} />
          </button>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel

