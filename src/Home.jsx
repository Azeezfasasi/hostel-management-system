import React from 'react'
import HeaderSection from './assets/components/home-components/HeaderSection'
import HeroSection from './assets/components/home-components/HeroSection'
import FeatureSection from './assets/components/home-components/FeatureSection'
import CallToAction from './assets/components/home-components/CallToAction'
import FooterSection from './assets/components/home-components/FooterSection'
import Faq from './assets/components/home-components/Faq'
import StudentsDashStats from './assets/components/dashboard-components/StudentsDashStats'

function Home() {
  return (
    <>
    <HeroSection />
    <HeaderSection />
    <StudentsDashStats />
    <FeatureSection />
    <Faq />
    <CallToAction />
    <FooterSection />
    </>
  )
}

export default Home