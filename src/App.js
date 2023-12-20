import HomePages from "./pages/homePage/HomePages";
import News from "./pages/news/News";
import Playlists from "./pages/playlists/Playlists"
import './App.css'
import Navbar from "./components/navbar";
import {
  BrowserRouter as Router,
  Route,Routes,
  Link, HashRouter
} from 'react-router-dom';
import EditorsPicks from "./pages/editorsPicks/EditorsPicks";
import Home from "./components/Home";
import About from "./pages/about/About";
import Submissions from "./pages/submissions/Submissions";


function App() {
  return (
       <Router>
        <Navbar/>
          <Routes>
             <Route path="/" exact element={<HomePages/>} />
             <Route path="home" exact element={<Home/>}/>
             <Route path="news" element={<News/>} />
             <Route path="playlists" element={<Playlists/>} />
             <Route path="/about" element={<About/>} />
             <Route path="submissions" element={<Submissions/>} />
             <Route path="editors-pick" element = {<EditorsPicks/>}/>
          </Routes>
        </Router>
);
}

export default App;
