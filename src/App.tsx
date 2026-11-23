import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TabBar from './components/TabBar'
import Page from './pages/Page'
import Tools from './pages/Tools'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="content">
          <Routes>
            <Route path="/" element={<Page title="Biblioteca" note="Suas músicas e cifras aparecerão aqui (próxima etapa)." />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/favorites" element={<Page title="Favoritos" note="Músicas favoritas." />} />
            <Route path="/search" element={<Page title="Busca" note="Busca por título e artista." />} />
            <Route path="/profile" element={<Page title="Perfil" note="Estatísticas reais de prática." />} />
            <Route path="/settings" element={<Page title="Ajustes" note="Aparência, acordes, áudio e mais." />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}
