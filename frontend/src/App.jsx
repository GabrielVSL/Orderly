import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SuccessPage from './pages/SucessPage'

function App() {
  return (
    <div className="App">
      {/* A Navbar component will go here later */}
      <h1>My E-commerce Site</h1>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </div>
  )
}

export default App