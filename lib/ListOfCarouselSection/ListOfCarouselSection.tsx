"use client";

import React from 'react'
import Carousel from '../Carosel'
import { NAV_MENU_BY_PROFILE, SKILLS } from '../../constants'
import { useParams } from 'next/navigation';

const ListOfCarouselSection = () => {
  const { type } = useParams();

  const sectionList = NAV_MENU_BY_PROFILE[type as keyof typeof NAV_MENU_BY_PROFILE].filter((item) => item.dataType || item.internalData);
  return (
    sectionList.map((item, index) => (
        <div key={index} id={item.section.replace("#", "")}>
        <Carousel listOf={item.dataType || item.internalData || ""} key={index} name={item.heading} carouselData={SKILLS} id={sectionList.length - index - 1} />
        </div>
    ))
  )
}

export default ListOfCarouselSection