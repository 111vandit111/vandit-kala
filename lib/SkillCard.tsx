import Image from 'next/image';
import React from 'react'

export interface SkillCardProps {
  name: string;
  description: string;
  speciality: number;
  image: string;
}

const SkillCard = ({ name, description, speciality, image }: SkillCardProps) => {
  return (
    <div className='group/cardGroup min-w-[200px] relative z-10'>
      <div className="h-[200px] w-[200px] overflow-hidden rounded group-hover/cardGroup:scale-120">
        <Image 
          src={image} 
          alt={name} 
          width={200} 
          height={200} 
          className="w-full h-full object-cover transition-transform duration-300" 
        />
      </div>
      
      <div className='absolute w-[240px] bg-black/90 p-4 left-[-20px] 
                      rounded-b shadow-lg transform transition-all duration-300 opacity-0
                      group-hover/cardGroup:opacity-100
                      -translate-y-5 pointer-events-none z-30'>
        <div className='space-y-2'>
          <h2 className='text-xl font-bold text-white'>{name}</h2>
          <p className='text-sm text-white/90'>{description}</p>
          <p className='text-sm font-bold text-yellow-400'>{speciality}</p>
        </div>
      </div>
    </div>
  )
}

export default SkillCard