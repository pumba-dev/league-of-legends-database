import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ChampionDetailPage from './pages/ChampionDetailPage'
import ItemsPage from './pages/ItemsPage'
import ProfilePage from './pages/ProfilePage'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/champion/:championId" element={<ChampionDetailPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:region/:riotId" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
