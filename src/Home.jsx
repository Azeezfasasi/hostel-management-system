import React from 'react'
import HeaderSection from './assets/components/home-components/HeaderSection'
import HeroSection from './assets/components/home-components/HeroSection'
import FeatureSection from './assets/components/home-components/FeatureSection'
import CallToAction from './assets/components/home-components/CallToAction'
import FooterSection from './assets/components/home-components/FooterSection'
import DashStats from './assets/components/dashboard-components/DashStats'
import Faq from './assets/components/home-components/Faq'

function Home() {
  return (
    <>
    <HeroSection />
    <HeaderSection />
    <DashStats />
    <FeatureSection />
    <Faq />
    <CallToAction />
    <FooterSection />
    </>
  )
}

export default Home