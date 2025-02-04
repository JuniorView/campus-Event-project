import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import LoginForm from './pages/LoginForm.jsx'
import Dashboard from './pages/Daschboard.jsx'
import Profile from "./pages/Profile.jsx";
import EventDetails from './pages/EventDetails.jsx';
import EventInfo from './pages/EventInfo.jsx';
import Registration from "./pages/Registration.jsx"
import MeineSchichten from "./pages/MeineSchichten.jsx"
function App() {

  return (
    <Router>
        <Routes>
            <Route path="/meine-schichten" element={<MeineSchichten />} />
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/event-details/:event" element={<EventDetails />} />
            <Route path="/eventdetails/:event/:role/event-info" element={<EventInfo />} />
            <Route path="/registration/:event/:role" element={<Registration />} />
      
        </Routes>

    </Router>
  )
}

export default App