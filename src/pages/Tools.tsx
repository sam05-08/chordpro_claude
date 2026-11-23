import { useState } from 'react'
import TunerPanel from '../components/TunerPanel'
import MetronomePanel from '../components/MetronomePanel'
import RecordingsPanel from '../components/RecordingsPanel'

export default function Tools() {
  const [tab, setTab] = useState<'tuner' | 'metro' | 'rec'>('tuner')
  return (
    <>
      <h1>Ferramentas</h1>
      <div className="seg main">
        <button className={tab === 'tuner' ? 'on' : ''} onClick={() => setTab('tuner')}>Afinador</button>
        <button className={tab === 'metro' ? 'on' : ''} onClick={() => setTab('metro')}>Metrônomo</button>
        <button className={tab === 'rec' ? 'on' : ''} onClick={() => setTab('rec')}>Gravações</button>
      </div>
      {tab === 'tuner' && <TunerPanel />}
      {tab === 'metro' && <MetronomePanel />}
      {tab === 'rec' && <RecordingsPanel />}
    </>
  )
}
