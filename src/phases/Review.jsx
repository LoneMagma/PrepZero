import { useState } from 'react'
import { useC, F, fmt, wc, Btn, QueueProgress } from '../tokens.jsx'

export default function Review({ data, onNew, onWrite, onHistory, onNextInQueue, queueIndex, queueTotal }) {
  const C = useC()
  const words  = wc(data.transcript)
  const wpm    = data.duration > 0 ? Math.round((words/data.duration)*60) : 0
  const [copied, setCopied] = useState(false)
  const isQueue = queueTotal > 1
  const hasNext = isQueue && queueIndex < queueTotal

  const copy = () => {
    if (!data.transcript) return
    navigator.clipboard.writeText(data.transcript).then(() => { setCopied(true); setTimeout(()=>setCopied(false), 1800) })
  }

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'clamp(40px,8vh,64px) clamp(20px,5vw,32px) 110px', animation:'rise 0.38s ease' }}>

      {isQueue && <QueueProgress current={queueIndex} total={queueTotal} />}

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24, flexWrap:'wrap' }}>
        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:500, background:C.soft, color:C.muted }}>{data.topicCat}</span>
        {data.sessionType === 'written' && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:500, background:C.terraLt, color:C.terra }}>written</span>}
        {data.duration > 0 && <span style={{ fontSize:13, color:C.faint }}>{fmt(data.duration)}</span>}
        {words > 0 && <span style={{ fontSize:13, color:C.faint }}>{words} words</span>}
        {wpm > 0 && <span style={{ fontSize:13, color:C.faint }}>~{wpm} wpm</span>}
      </div>

      <div style={{
        padding:'clamp(14px,3vw,20px) clamp(16px,4vw,24px)',
        borderLeft:`3px solid ${C.sage}`, background:C.surf, borderRadius:'0 10px 10px 0',
        marginBottom:24, boxShadow:`0 2px 12px ${C.shadow}`, animation:'pop 0.35s ease',
      }}>
        <p style={{ fontSize:'clamp(15px,4vw,17px)', lineHeight:1.7, color:C.ink, fontStyle:['Personal','Abstract'].includes(data.topicCat)?'italic':'normal' }}>
          {data.topicText}
        </p>
      </div>

      {data.audioURL && (
        <div style={{ marginBottom:24, animation:'rise 0.35s 0.08s ease both' }}>
          <p style={{ fontSize:11, color:C.faint, marginBottom:8, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.4px' }}>your recording</p>
          <audio controls src={data.audioURL} />
        </div>
      )}

      <div style={{ marginBottom:32, animation:'rise 0.35s 0.14s ease both' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <p style={{ fontSize:11, color:C.faint, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.4px' }}>what you said</p>
          {data.transcript && (
            <button onClick={copy} style={{ fontSize:12, color:copied?C.sage:C.faint, transition:'color 0.2s', minHeight:36, padding:'0 4px' }}>
              {copied ? '✓ copied' : 'copy'}
            </button>
          )}
        </div>
        <div style={{
          padding:'clamp(14px,3vw,20px)', background:C.surf, border:`1px solid ${C.border}`,
          borderRadius:10, lineHeight:2.1, fontSize:'clamp(14px,3.5vw,16px)',
          color:data.transcript?C.ink:C.faint, fontStyle:data.transcript?'normal':'italic', minHeight:72,
        }}>
          {data.transcript || 'nothing transcribed — speech recognition works best in Chrome or Edge'}
        </div>
      </div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap', animation:'rise 0.35s 0.2s ease both' }}>
        {hasNext && <Btn onClick={onNextInQueue} variant='primary'>next topic →</Btn>}
        <Btn onClick={onWrite} variant={hasNext?'ghost':'primary'}>write it out →</Btn>
        <Btn onClick={onNew} variant='ghost'>new topic</Btn>
        {!hasNext && <Btn onClick={onHistory} variant='ghost'>history</Btn>}
      </div>

      {isQueue && !hasNext && (
        <p style={{ fontSize:13, color:C.sage, marginTop:18, fontWeight:500 }}>
          ✓ queue complete — {queueTotal} topic{queueTotal!==1?'s':''} done
        </p>
      )}
    </div>
  )
}
