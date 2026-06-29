import { useState, useEffect, useRef } from 'react'
import { useC, F, QueueProgress } from '../tokens.jsx'

export default function ThinkPhase({ settings, onDone, queueIndex, queueTotal }) {
  const C = useC()
  const [t, setT]       = useState(settings.thinkTime)
  const [fade, setFade] = useState(false)
  const fired           = useRef(false)

  useEffect(() => {
    if (t <= 0 && !fired.current) { fired.current=true; setFade(true); setTimeout(onDone,280); return }
    const id = setTimeout(() => setT(p=>p-1), 1000)
    return () => clearTimeout(id)
  }, [t])

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(24px,5vw,48px)', transition:'opacity 0.28s ease', opacity:fade?0:1 }}>
      {queueTotal > 1 && <div style={{ width:'100%', maxWidth:280, marginBottom:32 }}><QueueProgress current={queueIndex} total={queueTotal} /></div>}
      <p style={{ fontSize:13, color:C.faint, marginBottom:16, animation:'fadein 0.4s ease' }}>gather your thoughts</p>
      <div className="think-display" style={{ fontFamily:F.display, fontSize:'clamp(100px,30vw,160px)', fontWeight:700, color:t<=3?C.sage:C.ink, lineHeight:1, letterSpacing:'-6px', animation:'breathe 1.2s ease-in-out infinite', transition:'color 0.5s ease' }}>
        {t}
      </div>
    </div>
  )
}
