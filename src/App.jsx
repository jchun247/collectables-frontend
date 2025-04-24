import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import Header from './components/Header'
import Profile from './pages/Dashboard/Profile'
import LandingPage from './components/LandingPage'
import ExplorePage from './pages/ExplorePage';
import CardDetails from './pages/CardDetails';
import UserPortfolio from './pages/UserPortfolio';
import SetsPage from './pages/SetsPage';
import SetCardsPage from './pages/SetCardsPage';

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/explore" replace /> : <LandingPage />
        }/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/explore" element={<ExplorePage />}/>
        <Route path="/sets" element={<SetsPage />} />
        <Route path="/portfolio" element={<UserPortfolio />}/>
        <Route path="/cards/:id" element={<CardDetails />}/>
        <Route path="/sets/:setId" element={<SetCardsPage />} />
        <Route path="/login" />
        <Route path="/signup" />
      </Routes>
    </div>
  )
}

export default App
