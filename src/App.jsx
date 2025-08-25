import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import { Toaster } from "@/components/ui/toaster";
import { SetsProvider } from './context/SetsContext';
import Header from './components/Header'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage'
import ExplorePage from './pages/ExplorePage';
import SetsPage from './pages/SetsPage';
import SetCardsPage from './pages/SetCardsPage';
import CardDetailsPage from './pages/CardDetailsPage';
import UserCollection from './pages/UserCollection';
import UserCollectionDetails from './pages/UserCollectionDetails';
import UserPortfolioCardDetailsPage from './pages/UserPortfolioCardDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

const SetsLayout = () => (
  <SetsProvider>
    <Outlet />
  </SetsProvider>
);

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Toaster />
      <main className="pt-14"> {/* Add padding top to offset fixed header */}
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/explore" replace /> : <LandingPage />
          }/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/explore" element={<ExplorePage />}/>
          <Route element={<SetsLayout />}>
            <Route path="/sets" element={<SetsPage />} />
            <Route path="/sets/:setId" element={<SetCardsPage />} />
          </Route>
          <Route path="/collections" element={<UserCollection />}/>
          <Route path="/collections/lists/:listId" element={<UserCollectionDetails collectionType="list" />} />
          <Route path="/collections/portfolios/:portfolioId" element={<UserCollectionDetails collectionType="portfolio" />} />
          <Route path="/collections/portfolios/:portfolioId/card/:collectionCardId" element={<UserPortfolioCardDetailsPage />} />
          <Route path="/cards/:cardId" element={<CardDetailsPage />} />
          <Route path="/login" />
          <Route path="/signup" />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
