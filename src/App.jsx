import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'

const App = () => {

  return (
    // <AuthProvider>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<AuthPage />}/>
    //     </Routes>
    //   </Router>
    // </AuthProvider>
    <div>
      Hello World!
    </div>
  )
}

export default App
