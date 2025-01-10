import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Profile from './pages/Dashboard/Profile'
import Cards from './pages/Dashboard/Cards'
import LandingPage from './components/LandingPage'

const App = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route 
          path="/"
          element={
            <>
              <LandingPage />
            </>
          }
        />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/cards" element={<Cards />}/>
        <Route path="/login" />
        <Route path="/signup" />
      </Routes>
    </div>
  )
}

export default App
