
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import DeanList from './DeanList.jsx';
import Login from './Login.jsx';
import ManagementList from './ManagementList.jsx';
import MTeamList from './MTeamList.jsx';
import PrincipalList from "./PrincipalList.jsx";
import User from './User.jsx';

function App() {
  return (
    <Router>
      <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/principal" element={<PrincipalList/>}/>
    <Route path="/dean" element={<DeanList/>}/>
    <Route path="/mteam" element={<MTeamList/>}/>
    <Route path="/management" element={<ManagementList/>}/>
    <Route path="/dashboard/:username" element={<Dashboard/>}/>
    <Route path="/user/:username" element={<User />} />
      </Routes>
    </Router>
  )
}

export default App;
