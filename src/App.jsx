import { useState } from 'react'

import heroImg from './assets/hero.png'
import './App.css'
import RealitySportShow from './components/RealitySportShow'
import LiveStreamSection from './components/LiveStreamSection'
import AppDownloadSection from './components/AppDownloadSection'
import GlobalReachCarousel from './components/GlobalReachCarousel'
import Wh from './components/Wh'

function App() {
  return (
    <>
      <RealitySportShow />
      <LiveStreamSection />
      <AppDownloadSection />
      <GlobalReachCarousel />
      <Wh />
    </>
  )
}

export default App