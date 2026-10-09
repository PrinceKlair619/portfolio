import { useState } from 'react'
import App from './App.jsx'
import LoadingScreen from './LoadingScreen.jsx'

// Shows the racing loading screen first and mounts the page once it hits 100%.
export default function Root() {
  const [revealed, setRevealed] = useState(false)
  return (
    <>
      {revealed && <App />}
      <LoadingScreen onReveal={() => setRevealed(true)} />
    </>
  )
}
