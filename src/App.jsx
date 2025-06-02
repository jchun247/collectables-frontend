import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import { Toaster } from "@/components/ui/toaster";
import Header from './components/Header'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage'
import ExplorePage from './pages/ExplorePage';
import SetsPage from './pages/SetsPage';
import SetCardsPage from './pages/SetCardsPage';
import UserCollection from './pages/UserCollection';
import UserCollectionDetails from './pages/UserCollectionDetails';
import UserPortfolioCardDetailsPage from './pages/UserPortfolioCardDetailsPage';

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Toaster />
      <main className="pt-12"> {/* Add padding top to offset fixed header */}
        <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/explore" replace /> : <LandingPage />
        }/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/explore" element={<ExplorePage />}/>
        <Route path="/sets" element={<SetsPage />} />
        <Route path="/collections" element={<UserCollection />}/>
        <Route path="/collections/lists/:listId" element={<UserCollectionDetails collectionType="list" />} />
        <Route path="/collections/portfolios/:portfolioId" element={<UserCollectionDetails collectionType="portfolio" />} />
        <Route path="/collections/portfolios/:portfolioId/card/:collectionCardId" element={<UserPortfolioCardDetailsPage />} />
        <Route path="/sets/:setId" element={<SetCardsPage />} />
        <Route path="/login" />
        <Route path="/signup" />
        </Routes>
      </main>
    </div>
  )
}

export default App
