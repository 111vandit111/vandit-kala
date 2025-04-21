"use client";

import React, { useEffect, useRef, useState } from 'react'
import SkillCard, { SkillCardProps } from './SkillCard'
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const Carousel = ({carouselData , id , name = "My Skills"} :{carouselData: SkillCardProps[] , id : number , name ?: string}) => {
  const [index, setIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const router = useRouter();
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
    <div className="relative w-full px-6 py-10">
      <div className='flex gap-24 items-center mb-6'>
      <h2 className="text-3xl font-bold text-white">{name}</h2>

      <div className='text-xl font-semibold cursor-pointer flex items-center gap-1' onClick={()=> router.push(`/${type}/list/${type}`)}>
        See More <Image src={"/chevron.svg"} className='rotate-270' alt="chevron" width={15} height={15} />
      </div>
      </div>

      <div className="relative overflow-x-clip sm:overflow-x-scroll scrollbar-hide">

        <div className="" ref={containerRef}>
          <div
            className={`flex transition-transform duration-500 ease-in-out gap-2 relative z-10 pl-3`}
            style={{
              transform: `translateX(-${index * (cardWidth * cardsPerPage + gap*cardsPerPage)}px)`,
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
            style={{ zIndex: 20 , left: `${index * (cardWidth * cardsPerPage + gap*cardsPerPage)}px` }}
            className="absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-xl h-[calc(100%+32px)] sm:hidden text-xl font-semibold px-4 py-3 text-white"
          >
            <Image src={"/chevron.svg"} className='rotate-90 max-w-none' alt="chevron" width={15} height={15} />
          </button>
        )}

        {index < maxIndex && (
          <button
            onClick={handleNext}
            style={{ zIndex: 20 , right: `-${index * (cardWidth * cardsPerPage + gap*cardsPerPage)}px` }}
            className="absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-xl h-[calc(100%+32px)] sm:hidden text-xl font-semibold px-4 py-3 text-white"
          >
            <Image src={"/chevron.svg"} className='rotate-270' alt="chevron" width={15} height={15} />
          </button>
        )}

          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Carousel

