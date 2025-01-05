import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import LoginForm from './pages/LoginForm.jsx'
import Dashboard from './pages/Daschboard.jsx'
import Profile from "./pages/Profile.jsx";

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>

    </Router>
  )
}

export default App
