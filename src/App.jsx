import { useState } from 'react'

import heroImg from './assets/hero.png'
import './App.css'
// import Menu from './components/Menu'
import RealitySportShow from './components/RealitySportShow'
import AppDownloadSection from './components/AppDownloadSection'
import GlobalReachCarousel from './components/GlobalReachCarousel'
import Wh from './components/Wh'
function App() {
 

  return (
    <>
    
<RealitySportShow/>
<AppDownloadSection/>
<GlobalReachCarousel/>
<Wh/>


    </>
  )
}

export default App
