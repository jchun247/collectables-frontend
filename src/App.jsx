import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Profile from './pages/Dashboard/Profile'
import LandingPage from './components/LandingPage'
import ExplorePage from './pages/ExplorePage';
import CardDetails from './pages/CardDetails';
import UserPortfolio from './pages/UserPortfolio';

const App = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route path="/" element={
            <>
              <LandingPage />
            </>
          }
        />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/explore" element={<ExplorePage />}/>
        <Route path="/portfolio" element={<UserPortfolio />}/>
        <Route path="/cards/:id" element={<CardDetails />}/>
        <Route path="/login" />
        <Route path="/signup" />
      </Routes>
    </div>
  )
}

export default App
