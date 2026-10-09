import { useState } from 'react'
import App from './App.jsx'
import LoadingScreen from './LoadingScreen.jsx'

// Preview a loader style with ?loader=name | terminal | ring
const variant = new URLSearchParams(window.location.search).get('loader') ?? 'name'

export default function Root() {
  const [loaded, setLoaded] = useState(false)
  return loaded ? <App /> : <LoadingScreen variant={variant} onDone={() => setLoaded(true)} />
}
