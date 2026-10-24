import React from 'react'
import { notFound } from 'next/navigation';
import InternalNavBar from '../../../lib/InternalNavBar';
import Footer from '../../../lib/footer';
import AnalyticsTracker from '../../../lib/AnalyticsTracker';
import HashScroll from '../../../lib/HashScroll';
import ContactCta from '../../../lib/ContactCta';
import { isProfileType } from '../../../constants';

import { Roboto } from 'next/font/google'

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
})


const PageLayout = async ({children, params} : Readonly<{
    children: React.ReactNode;
    params: Promise<{ type: string }>;
  }>) => {
  const { type } = await params;
  if (!isProfileType(type)) notFound();

  return (
    <div className={`${roboto.variable} font-roboto relative`}>
        <AnalyticsTracker profile={type} />
        <HashScroll />
        <div className='sm:sticky top-0 w-full z-[1000]'> <InternalNavBar /> </div>
          {children}
        <ContactCta />
        <Footer isNotHome/>
    </div>
  )
}

export default PageLayout
