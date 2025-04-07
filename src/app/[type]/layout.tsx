import React from 'react'
import InternalNavBar from '../../../lib/InternalNavBar';
import Footer from '../../../lib/footer';

import { Roboto } from 'next/font/google'

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
})


const PageLayout = ({children} : Readonly<{
    children: React.ReactNode;
  }>) => {

  return (
    <div className={`${roboto.variable} font-roboto relative`}>
        <div className='sm:sticky top-0 w-full z-[1000]'> <InternalNavBar /> </div>
          {children}
        <Footer isNotHome/>
    </div>
  )
}

export default PageLayout