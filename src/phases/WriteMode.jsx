import { useState, useEffect, useRef } from 'react'
import { useC, F, wc, Btn } from '../tokens.jsx'

export default function WriteMode({ topic, onBack, onDone }) {
  const C = useC()
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const words = wc(text)
  const taRef = useRef(null)

  useEffect(() => {
    if (!taRef.current) return
    taRef.current.style.height = 'auto'
    taRef.current.style.height = taRef.current.scrollHeight + 'px'
  }, [text])

  const copy = () => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => { setSaved(true); setTimeout(()=>setSaved(false), 1800) })
  }

  // Save written session to history then go back to review-style screen
  const handleDone = () => {
    onDone({
      topicText:   topic.text,
      topicCat:    topic.cat,
      transcript:  text,
      duration:    0,
      audioBlob:   null,
      sessionType: 'written',
    })
  }

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'clamp(40px,8vh,64px) clamp(20px,5vw,32px) 110px', animation:'rise 0.38s ease' }}>
      <p style={{ fontSize:13, color:C.faint, marginBottom:16 }}>
        same topic, no clock — what would you actually say?
      </p>

      <div style={{
        padding:'clamp(14px,3vw,18px) clamp(16px,4vw,22px)',
        borderLeft:`3px solid ${C.sage}`, background:C.surf, borderRadius:'0 10px 10px 0',
        marginBottom:22, boxShadow:`0 2px 12px ${C.shadow}`,
      }}>
        <p style={{ fontSize:'clamp(14px,3.5vw,16px)', lineHeight:1.7, color:C.ink, fontStyle:['Personal','Abstract'].includes(topic.cat)?'italic':'normal' }}>
          {topic.text}
        </p>
      </div>

      <textarea ref={taRef} value={text} onChange={e => setText(e.target.value)}
        placeholder="start writing..." autoFocus
        style={{
          width:'100%', minHeight:240, padding:'clamp(14px,3vw,18px) clamp(16px,4vw,20px)',
          border:`1.5px solid ${C.border}`, borderRadius:10, background:C.surf,
          fontSize:'clamp(14px,3.5vw,16px)', lineHeight:2, color:C.ink,
          resize:'none', overflow:'hidden', transition:'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor=C.sage; e.target.style.boxShadow='0 0 0 3px rgba(107,143,114,0.12)' }}
        onBlur={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow='none' }}
      />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:13, color:C.faint }}>{words > 0 ? `${words} words` : ''}</span>
          {text && (
            <button onClick={copy} style={{ fontSize:12, color:saved?C.sage:C.faint, transition:'color 0.2s', minHeight:36, padding:'0 4px' }}>
              {saved ? '✓ copied' : 'copy'}
            </button>
          )}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn onClick={onBack} variant='ghost'>← back</Btn>
          <Btn onClick={handleDone} variant='primary' disabled={!text.trim()}>
            save &amp; finish
          </Btn>
        </div>
      </div>
    </div>
  )
}
