import { useState } from 'react'
import './App.css'
import RealitySportShow from './components/RealitySportShow'
import LiveStreamSection from './components/LiveStreamSection'
import TourSection from './components/TourSection'
import AppDownloadSection from './components/AppDownloadSection'
import GlobalReachCarousel from './components/GlobalReachCarousel'
import Wh from './components/Wh'
import AuthAndRegistration from './components/AuthAndRegistration'

function App() {
  const [view, setView] = useState('home'); // 'home' | 'auth'
  const [isStreamOpen, setIsStreamOpen] = useState(false);

  return (
    <>
      {view === 'home' ? (
        <>
          <RealitySportShow 
            onNavigate={(target) => setView(target)} 
            onWatchLive={() => setIsStreamOpen(true)}
          />
          <LiveStreamSection 
            isOpen={isStreamOpen} 
            onClose={() => setIsStreamOpen(false)} 
          />
          <TourSection />
          <AppDownloadSection />
          <GlobalReachCarousel />
          <Wh />
        </>
      ) : (
        <AuthAndRegistration onBack={() => setView('home')} />
      )}
    </>
  )
}

export default App