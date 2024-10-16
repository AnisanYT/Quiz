import './App.css';
import {db, auth} from './FireBaseConfigure'
import { collection, addDoc } from 'firebase/firestore';

import CreatingRoom from './Pages/creatingRoom';
import Navbar from './components/navbar'
import MainContent from './components/mainContent';
import ProfilePage from './Pages/ProfilePage';
import JoinRoom from './Pages/joinRoom';
import JoinRoomPlayer from './Pages/joinRoomPlayer';
import Game from './Pages/game';

import { Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/creatingRoom' element={<CreatingRoom/>}/>
        <Route path='/' element={<MainContent/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/joinRoom/:roomCode' element={<JoinRoom/>}/>
        <Route path='/joinRoomPlayer' element={<JoinRoomPlayer/>}/>
        <Route path='/game/:roomCode' element={<Game/>}/>
      </Routes>  
    </>
  );
}

export default App;
