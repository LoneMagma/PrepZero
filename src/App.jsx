import { useState, useEffect } from 'react'
import ThemeCtx, { lightColors, darkColors } from './theme.jsx'
import { NavPill } from './tokens.jsx'
import { saveSession, getAllSessions, saveAudioBlob, getAudioBlob } from './db.js'

import Home          from './phases/Home.jsx'
import ReadPhase     from './phases/ReadPhase.jsx'
import ThinkPhase    from './phases/ThinkPhase.jsx'
import SpeakPhase    from './phases/SpeakPhase.jsx'
import Review        from './phases/Review.jsx'
import WriteMode     from './phases/WriteMode.jsx'
import History       from './phases/History.jsx'
import QueueBuilder  from './phases/QueueBuilder.jsx'
import TopicsManager from './phases/TopicsManager.jsx'
import SettingsPanel from './phases/SettingsPanel.jsx'
import InfoPanel     from './phases/InfoPanel.jsx'

const DEF  = { readTime:30, thinkTime:7, speakTime:120 }
const SKEY = 'zp_cfg'
const TKEY = 'zp_topics'
const DKEY = 'zp_dark'

const loadCfg    = () => { try { return {...DEF,...JSON.parse(localStorage.getItem(SKEY))} } catch { return DEF } }
const loadTopics = () => { try { return JSON.parse(localStorage.getItem(TKEY)) || [] }      catch { return [] } }
const loadDark   = () => { try { return JSON.parse(localStorage.getItem(DKEY)) || false }   catch { return false } }

const urlCache = {}
async function getAudioURL(id) {
  if (urlCache[id]) return urlCache[id]
  const blob = await getAudioBlob(id)
  if (!blob) return null
  return (urlCache[id] = URL.createObjectURL(blob))
}

export default function App() {
  const [phase,        setPhase]        = useState('home')
  const [topic,        setTopic]        = useState(null)
  const [settings,     setSettings]     = useState(loadCfg)
  const [customTopics, setCustomTopics] = useState(loadTopics)
  const [dark,         setDark]         = useState(loadDark)
  const [showCfg,      setShowCfg]      = useState(false)
  const [showInfo,     setShowInfo]     = useState(false)
  const [sessData,     setSessData]     = useState(null)
  const [sessions,     setSessions]     = useState([])
  const [cat,          setCat]          = useState('All')

  // Queue state
  const [queue,      setQueue]      = useState([])
  const [queueIdx,   setQueueIdx]   = useState(0)

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.toggle('theme-dark',  dark)
    document.body.classList.toggle('theme-light', !dark)
  }, [dark])

  // Init with light class
  useEffect(() => {
    document.body.classList.add(dark ? 'theme-dark' : 'theme-light')
  }, [])

  useEffect(() => {
    getAllSessions().then(async rows => {
      const hydrated = await Promise.all(rows.map(async s => ({...s, audioURL: await getAudioURL(s.id)})))
      setSessions(hydrated)
    })
  }, [])

  const C = dark ? darkColors : lightColors
  const inSession = ['read','think','speak'].includes(phase)

  const onStart = t => { setQueue([t]); setQueueIdx(0); setTopic(t); setPhase('read') }

  const onQueue = (topics, label) => {
    if (label === 'build') { setPhase('queue-builder'); return }
    const shuffled = label === 'My Topics'
      ? [...topics].sort(() => Math.random()-0.5)
      : topics
    setQueue(shuffled); setQueueIdx(0); setTopic(shuffled[0]); setPhase('read')
  }

  const onNextInQueue = () => {
    const next = queueIdx + 1
    if (next >= queue.length) return
    setQueueIdx(next); setTopic(queue[next]); setPhase('read'); setSessData(null)
  }

  // Spoken session done
  const onSpeakDone = async data => {
    const id  = Date.now()
    if (data.audioBlob) await saveAudioBlob(id, data.audioBlob)
    const audioURL = data.audioBlob ? (urlCache[id] = URL.createObjectURL(data.audioBlob)) : null
    const meta = { id, topicText:data.topicText, topicCat:data.topicCat, transcript:data.transcript, duration:data.duration, createdAt:id, hasAudio:!!data.audioBlob, sessionType:'spoken' }
    await saveSession(meta)
    const session = {...meta, audioURL}
    setSessData(session); setSessions(p=>[session,...p]); setPhase('review')
  }

  // Written session done — save to history and show review
  const onWriteDone = async data => {
    const id  = Date.now()
    const meta = { id, topicText:data.topicText, topicCat:data.topicCat, transcript:data.transcript, duration:0, createdAt:id, hasAudio:false, sessionType:'written' }
    await saveSession(meta)
    const session = {...meta, audioURL:null}
    setSessData(session); setSessions(p=>[session,...p]); setPhase('review')
  }

  const reset = () => { setPhase('home'); setTopic(null); setSessData(null); setQueue([]); setQueueIdx(0) }

  const saveSettings = s => {
    setSettings(s)
    try { localStorage.setItem(SKEY, JSON.stringify(s)) } catch {}
    setShowCfg(false)
  }

  const toggleDark = () => {
    setDark(d => {
      const next = !d
      try { localStorage.setItem(DKEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const saveTopics = topics => {
    setCustomTopics(topics)
    try { localStorage.setItem(TKEY, JSON.stringify(topics)) } catch {}
  }

  const queueDisplay = queue.length > 1 ? queueIdx+1 : 0
  const queueTotal   = queue.length > 1 ? queue.length : 0

  const showNav = !inSession && !['queue-builder','topics-manager'].includes(phase)

  return (
    <ThemeCtx.Provider value={{ C, dark }}>
      {showNav && (
        <NavPill
          showHistory={phase==='home'}
          onHistory={() => setPhase('history')}
          onSettings={() => setShowCfg(true)}
          onInfo={() => setShowInfo(true)}
        />
      )}

      {phase==='home' && (
        <Home cat={cat} setCat={setCat} sessionCount={sessions.length}
          onStart={onStart} onQueue={onQueue}
          customTopics={customTopics}
          onManageTopics={() => setPhase('topics-manager')}
        />
      )}
      {phase==='topics-manager' && (
        <TopicsManager customTopics={customTopics} onSave={saveTopics} onBack={() => setPhase('home')} />
      )}
      {phase==='queue-builder' && (
        <QueueBuilder customTopics={customTopics} onStart={onQueue} onBack={() => setPhase('home')} />
      )}
      {phase==='read'   && topic    && <ReadPhase  topic={topic} settings={settings} onDone={()=>setPhase('think')} queueIndex={queueDisplay} queueTotal={queueTotal} />}
      {phase==='think'              && <ThinkPhase settings={settings} onDone={()=>setPhase('speak')} queueIndex={queueDisplay} queueTotal={queueTotal} />}
      {phase==='speak'  && topic    && <SpeakPhase topic={topic} settings={settings} onDone={onSpeakDone} queueIndex={queueDisplay} queueTotal={queueTotal} />}
      {phase==='review' && sessData && (
        <Review data={sessData} onNew={reset}
          onWrite={() => setPhase('write')}
          onHistory={() => setPhase('history')}
          onNextInQueue={onNextInQueue}
          queueIndex={queueDisplay} queueTotal={queueTotal}
        />
      )}
      {phase==='write'  && topic    && <WriteMode topic={topic} onBack={() => setPhase('review')} onDone={onWriteDone} />}
      {phase==='history'            && <History sessions={sessions} onBack={() => setPhase('home')} />}

      {showCfg  && <SettingsPanel settings={settings} onSave={saveSettings} onClose={() => setShowCfg(false)} dark={dark} onToggleDark={toggleDark} />}
      {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}
    </ThemeCtx.Provider>
  )
}
