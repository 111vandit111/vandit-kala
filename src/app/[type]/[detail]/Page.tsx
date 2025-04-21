import React from 'react'
import Carousel from '../../../../lib/Carosel'
import { SKILLS } from '../../../../constants'
import DetailsHero from '../../../../lib/DetailsHeroSection/DetailsHero'

const Page = () => {
  return (
    <div className='mb-40'>
    <DetailsHero />
    <Carousel name='More Related' carouselData={SKILLS} id={1} />
    </div>
  )
}

export default Page