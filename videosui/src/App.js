import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./component/login";
import Videos from "./component/videos";
import Navigation from './component/navigation';
import Logout from './component/logout';
import VideoItem from './component/videoitem';
import UserRegistration from './component/userRegistration';
function App() {
  return <BrowserRouter>
    <Navigation></Navigation>
        <Routes>
            <Route path="/" element={<Videos/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/videoitem" element={<VideoItem/>}/>
            <Route path="/videos" element={<Videos/>}/>
            <Route path="/userRegistration" element={<UserRegistration/>}/>
        </Routes>
    </BrowserRouter>;
}

export default App;


