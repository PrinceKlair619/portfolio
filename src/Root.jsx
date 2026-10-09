import { useState } from 'react'
import App from './App.jsx'
import LoadingScreen from './LoadingScreen.jsx'

export default function Root() {
  const [loaded, setLoaded] = useState(false)
  return loaded ? <App /> : <LoadingScreen onDone={() => setLoaded(true)} />
}
