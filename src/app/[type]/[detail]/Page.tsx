import React from 'react'
import Herosection from '../../../../lib/HeroSection/Herosection'
import Carousel from '../../../../lib/Carosel'
import { SKILLS } from '../../../../constants'

const Page = () => {
  return (
    <div>
    <Herosection />
    <Carousel carouselData={SKILLS} id={1} />
    </div>
  )
}

export default Page