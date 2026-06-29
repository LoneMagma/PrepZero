import { useState, useEffect, useRef } from 'react'
import { useC, F, QueueProgress } from '../tokens.jsx'

export default function ReadPhase({ topic, settings, onDone, queueIndex, queueTotal }) {
  const C = useC()
  const [t, setT]     = useState(settings.readTime)
  const [exit, setEx] = useState(false)
  const fired         = useRef(false)

  useEffect(() => {
    if (t <= 0 && !fired.current) { fired.current=true; setEx(true); setTimeout(onDone,480); return }
    const id = setTimeout(() => setT(p=>p-1), 1000)
    return () => clearTimeout(id)
  }, [t])

  const pct    = t / settings.readTime
  const urgent = pct < 0.25

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(24px,5vw,48px) clamp(20px,5vw,28px)' }}>
      {queueTotal > 1 && <div style={{ width:'100%', maxWidth:560, marginBottom:24 }}><QueueProgress current={queueIndex} total={queueTotal} /></div>}
      <p style={{ fontSize:13, color:C.faint, marginBottom:24, animation:'drop 0.35s ease' }}>read the topic</p>
      <div style={{ maxWidth:560, width:'100%', transition:'opacity 0.45s ease, transform 0.45s ease', opacity:exit?0:1, transform:exit?'translateY(-20px) scale(0.95)':'none', animation:exit?'none':'pop 0.4s ease' }}>
        <div style={{ padding:'clamp(28px,6vw,44px) clamp(24px,6vw,48px)', background:C.surf, border:`1.5px solid ${C.border}`, borderRadius:12, boxShadow:`0 4px 32px ${C.shadow}` }}>
          <span style={{ fontSize:11, color:C.faint, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.6px' }}>{topic.cat}</span>
          <p style={{ fontSize:'clamp(17px,4.5vw,22px)', lineHeight:1.7, color:C.ink, marginTop:10, fontStyle:['Personal','Abstract'].includes(topic.cat)?'italic':'normal' }}>
            {topic.text}
          </p>
        </div>
        <div style={{ height:3, background:C.soft, borderRadius:'0 0 4px 4px', overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:2, background:urgent?C.terra:C.sage, width:`${pct*100}%`, transition:'width 1s linear, background 0.8s ease' }} />
        </div>
      </div>
      <div style={{ fontFamily:F.display, fontSize:'clamp(44px,12vw,56px)', color:urgent?C.terra:C.faint, marginTop:24, letterSpacing:'-1px', transition:'color 0.8s ease' }}>
        {t}
      </div>
    </div>
  )
}
