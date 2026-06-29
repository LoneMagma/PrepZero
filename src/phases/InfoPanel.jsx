import { useC, F } from '../tokens.jsx'

export default function InfoPanel({ onClose }) {
  const C = useC()

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.38)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:900, animation:'fadein 0.2s ease' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width:'100%', maxWidth:520, background:C.surf,
        borderRadius:'16px 16px 0 0', border:`1px solid ${C.border}`, borderBottom:'none',
        padding:'24px clamp(18px,4vw,28px) clamp(36px,6vw,52px)',
        animation:'slideup 0.28s ease', maxHeight:'82vh', overflowY:'auto',
        boxShadow:`0 -8px 48px ${C.shadowMd}`,
      }}>

        {/* Handle */}
        <div style={{ width:36, height:4, background:C.soft, borderRadius:2, margin:'0 auto 22px' }} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h2 style={{ fontFamily:F.display, fontSize:'clamp(26px,7vw,32px)', fontWeight:700, color:C.ink, letterSpacing:'-0.5px' }}>
            About PrepZero
          </h2>
          <button onClick={onClose}
            style={{ color:C.faint, fontSize:22, minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.ink}
            onMouseLeave={e => e.currentTarget.style.color = C.faint}
          >✕</button>
        </div>

        {/* What it is */}
        <Section C={C} title="what this is">
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.75 }}>
            PrepZero is a tool for practising extempore speaking. The kind where you get a topic, a few seconds, and then you just have to go. It records you and transcribes what you say, and lets you compare that to what you'd write with time to think. That's pretty much it.
          </p>
        </Section>

        {/* Built by AI */}
        <Section C={C} title="how it was made">
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.75 }}>
            The entire codebase- every component, every interaction, the database layer and the audio pipeline was written by <strong style={{ color:C.ink, fontWeight:500 }}>Claude</strong> (Anthropic's AI). Not assisted but Written by it.
          </p>
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.75, marginTop:10 }}>
            The human parts: The complete architecture, the product decisions, the design direction, the topic bank, and this copy you're reading right now.
          </p>
        </Section>

        {/* Tools & services */}
        <Section C={C} title="built with">
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { name:'React + Vite',        role:'UI framework and build tooling' },
              { name:'Web Speech API',      role:'Live speech-to-text transcription (browser-native, no API key)' },
              { name:'MediaRecorder API',   role:'Audio recording (browser-native)' },
              { name:'IndexedDB via idb',   role:'Persistent local storage for sessions and audio blobs' },
              { name:'Google Fonts',        role:'Caveat (display) and Inter (body) typefaces' },
              { name:'Vercel / Netlify / Cloudflare',    role:'Static site hosting (free tier)' },
            ].map(({ name, role }) => (
              <div key={name} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ fontSize:13, fontWeight:500, color:C.ink, minWidth:160, flexShrink:0 }}>{name}</span>
                <span style={{ fontSize:13, color:C.faint, lineHeight:1.5 }}>{role}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Privacy */}
        <Section C={C} title="your data">
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.75 }}>
            Everything stays on your device. Sessions, transcripts, and audio are stored in your browser's local IndexedDB. Nothing is sent to any server. There's NO account, NO analytics and NO tracking.
          </p>
          <p style={{ fontSize:13, color:C.faint, marginTop:8, lineHeight:1.6 }}>
            The one exception: live transcription routes audio through Google's Speech API (this is how the browser's Web Speech API works). If you'd prefer not to, use the "write it out" mode instead (no mic required).
          </p>
        </Section>

        {/* Footer */}
        <div style={{ marginTop:28, paddingTop:20, borderTop:`1px solid ${C.border}`, textAlign:'center' }}>
          <p style={{ fontSize:13, color:C.faint }}>
            a{' '}
            <a href="https://pacify.site" target="_blank" rel="noopener noreferrer"
              style={{ color:C.sage, textDecoration:'none', fontWeight:500 }}
              onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration='none'}
            >pacify</a>
            {' '}project
          </p>
        </div>

      </div>
    </div>
  )
}

function Section({ C, title, children }) {
  return (
    <div style={{ marginBottom:26 }}>
      <p style={{ fontSize:11, color:C.faint, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>
        {title}
      </p>
      {children}
    </div>
  )
}
