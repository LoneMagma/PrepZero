import { useState, useEffect, useRef } from 'react'
import { useC, F, fmt, QueueProgress } from '../tokens.jsx'

function getSupportedMime() {
  const types = ['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/mp4']
  for (const t of types)
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t
  return ''
}

export default function SpeakPhase({ topic, settings, onDone, queueIndex, queueTotal }) {
  const C = useC()
  const [elapsed,  setElapsed]  = useState(0)
  const [finalTx,  setFinalTx]  = useState('')
  const [interim,  setInterim]  = useState('')
  const [status,   setStatus]   = useState('init')
  const [bars,     setBars]     = useState(Array(32).fill(4))
  const [exiting,  setExiting]  = useState(false)
  const stopFnRef = useRef(null)

  useEffect(() => {
    let active=true, elapsed=0, finalText='', timer=null, recognition=null, recorder=null, stream=null, audioCtx=null, animFrame=null
    const chunks=[]

    function stop() {
      if (!active) return
      active=false
      clearInterval(timer); cancelAnimationFrame(animFrame)
      if (recognition) try { recognition.abort() } catch {}
      if (audioCtx)    try { audioCtx.close()    } catch {}
      const finish = blob => {
        if (stream) stream.getTracks().forEach(t=>t.stop())
        onDone({ topicText:topic.text, topicCat:topic.cat, transcript:finalText, duration:elapsed, audioBlob:blob??null })
      }
      if (recorder && recorder.state!=='inactive') {
        recorder.onstop = () => {
          const blob = chunks.length ? new Blob(chunks, { type:getSupportedMime()||'audio/webm' }) : null
          finish(blob)
        }
        recorder.stop()
      } else { finish(null) }
    }

    stopFnRef.current = stop

    timer = setInterval(() => {
      elapsed++; setElapsed(elapsed)
      if (elapsed >= settings.speakTime) { setExiting(true); setTimeout(stop, 300) }
    }, 1000)

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      recognition = new SR()
      recognition.continuous=true; recognition.interimResults=true; recognition.lang='en-US'
      recognition.onresult = e => {
        let nf='',ni=''
        for (let i=e.resultIndex;i<e.results.length;i++) {
          if (e.results[i].isFinal) nf+=e.results[i][0].transcript+' '
          else ni+=e.results[i][0].transcript
        }
        if (nf) { finalText+=nf; setFinalTx(finalText) }
        setInterim(ni)
      }
      recognition.onend = () => { if (active) try { recognition.start() } catch {} }
      try { recognition.start() } catch {}
    }

    navigator.mediaDevices.getUserMedia({ audio:true, video:false })
      .then(s => {
        if (!active) { s.getTracks().forEach(t=>t.stop()); return }
        stream=s
        try {
          audioCtx = new (window.AudioContext||window.webkitAudioContext)()
          const analyser = audioCtx.createAnalyser(); analyser.fftSize=128
          audioCtx.createMediaStreamSource(stream).connect(analyser)
          const data = new Uint8Array(analyser.frequencyBinCount)
          const draw = () => { if (!active) return; animFrame=requestAnimationFrame(draw); analyser.getByteFrequencyData(data); const step=Math.floor(data.length/32); setBars(Array.from({length:32},(_,i)=>Math.max(4,(data[i*step]/255)*52))) }
          draw()
        } catch {}
        const mime=getSupportedMime()
        recorder=new MediaRecorder(stream, mime?{mimeType:mime}:{})
        recorder.ondataavailable=e=>{if(e.data?.size>0)chunks.push(e.data)}
        recorder.start(250); setStatus('recording')
      })
      .catch(()=>setStatus('no-mic'))

    return () => {
      active=false; clearInterval(timer); cancelAnimationFrame(animFrame)
      if (recognition) try{recognition.abort()}catch{}
      if (audioCtx)    try{audioCtx.close()}catch{}
      if (recorder&&recorder.state!=='inactive'){recorder.onstop=null;try{recorder.stop()}catch{}}
      if (stream) stream.getTracks().forEach(t=>t.stop())
    }
  }, [])

  const pct=Math.min(elapsed/settings.speakTime,1), nearEnd=pct>0.75, critical=pct>0.88
  const timerCol=critical?C.terra:nearEnd?'#a06b40':C.ink
  const waveCol=critical?C.terra:C.sage
  const remaining=settings.speakTime-elapsed

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', padding:'clamp(36px,7vh,56px) clamp(20px,5vw,36px) 100px', maxWidth:700, margin:'0 auto', transition:'opacity 0.3s ease', opacity:exiting?0:1 }}>
      <QueueProgress current={queueIndex} total={queueTotal} />
      <div style={{ padding:'10px 14px', borderLeft:`2px solid ${C.sage}`, background:C.surf, borderRadius:'0 6px 6px 0', marginBottom:32, fontSize:13, color:C.muted, lineHeight:1.5 }}>
        {topic.text}
      </div>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div className="timer-display" style={{ fontFamily:F.display, fontSize:'clamp(80px,22vw,120px)', fontWeight:700, lineHeight:1, letterSpacing:'-4px', color:timerCol, transition:'color 1.2s ease', animation:critical?'pulse 1s ease-in-out infinite':'none' }}>
          {fmt(elapsed)}
        </div>
        <p style={{ fontSize:12, color:critical?C.terra:C.faint, marginTop:4, transition:'color 1.2s ease' }}>{remaining>0?`${remaining}s remaining`:"time's up"}</p>
        <div style={{ height:2, background:C.soft, maxWidth:180, margin:'10px auto 0', borderRadius:1, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:1, background:timerCol, width:`${pct*100}%`, transition:'width 1s linear, background 1.2s ease' }} />
        </div>
        <div style={{ marginTop:20, height:52, display:'flex', alignItems:'center', justifyContent:'center', gap:2.5 }}>
          {status==='recording' ? bars.slice(0, window.innerWidth<400?20:32).map((h,i) => (
            <div key={i} style={{ width:3.5, height:h, borderRadius:3, background:waveCol, opacity:0.4+(h/52)*0.6, transition:'height 0.07s ease, background 1.2s ease' }} />
          )) : status==='no-mic' ? (
            <span style={{ fontSize:13, color:C.faint, fontStyle:'italic' }}>no mic — transcript only</span>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:C.border, animation:'blink 1.4s ease infinite' }} />
              <span style={{ fontSize:13, color:C.faint }}>starting up...</span>
            </div>
          )}
        </div>
        {status==='recording' && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:6 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#c84040', animation:'pulse 1.4s ease-in-out infinite' }} />
            <span style={{ fontSize:11, color:C.faint, fontWeight:500 }}>rec</span>
          </div>
        )}
      </div>
      <div style={{ flex:1, animation:'fadein 0.7s ease' }}>
        {finalTx||interim ? (
          <p style={{ fontSize:'clamp(15px,4vw,18px)', lineHeight:2.1, color:C.ink }}>
            {finalTx}<span style={{ color:C.faint, fontStyle:'italic' }}>{interim}</span>
            <span style={{ animation:'blink 1s ease infinite', color:C.border, marginLeft:1 }}>|</span>
          </p>
        ) : <p style={{ fontSize:'clamp(15px,4vw,18px)', color:C.border, fontStyle:'italic' }}>start talking...</p>}
      </div>
      <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:10 }}>
        <button onClick={() => { setExiting(true); setTimeout(()=>stopFnRef.current?.(), 250) }}
          style={{
            padding:'11px clamp(22px,5vw,30px)', background:C.navBg, border:`1.5px solid ${C.border}`, borderRadius:50,
            fontSize:14, color:C.muted, fontFamily:F.body, fontWeight:500,
            backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
            boxShadow:`0 4px 20px ${C.shadow}`, transition:'all 0.18s', minHeight:46, whiteSpace:'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background=C.ink; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor=C.ink; e.currentTarget.style.transform='translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background=C.navBg; e.currentTarget.style.color=C.muted; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}
        >stop &amp; review</button>
      </div>
    </div>
  )
}
