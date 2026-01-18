import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ChampionDetailPage from './pages/ChampionDetailPage'
import ItemsPage from './pages/ItemsPage'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/champion/:championId" element={<ChampionDetailPage />} />
          <Route path="/items" element={<ItemsPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
