import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import LoginForm from './pages/LoginForm.jsx'
import Dashboard from './pages/Daschboard'

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

    </Router>
  )
}

export default App
