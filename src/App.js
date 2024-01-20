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
import LoginPage from "./pages/login/Login";
import ArticlePage from "./pages/articles/ArticlePage";
import Admin from "./pages/admin/Admin";
import Messages from "./components/messages/Messages";

import AdminPosts from "./components/AdminPosts";
import UpdatePlaylists from "./components/UpdatePlaylists";
import Footer from "./components/footer/Footer";
import ArticleList from "./pages/admin-pages/ArticleList";
import PlaylistList from "./pages/admin-pages/PlaylistList";
import TopPicksPage from "./pages/admin-pages/TopPicksPage";

import HighlightPlaylist from "./pages/admin-pages/HighlightPlaylist";


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
             <Route path="/article/:category/:articleId" element={<ArticlePage/>} />
             <Route path="login" element ={<LoginPage/>}/>
             <Route path="admin" element= {<Admin/>}>
             <Route path="create-posts" element={<AdminPosts/>} />
             <Route path="update-playlist" element={<UpdatePlaylists/>} />
             <Route path="all-articles" element={<ArticleList/>} />
             <Route path="all-playlists" element={<PlaylistList/>} />
             <Route path="top-picks" element={<TopPicksPage/>} />
             <Route path="top-playlist" element={<HighlightPlaylist/>} />
             </Route>  
          </Routes>
        <Footer/>
      </Router>
        
);
}

export default App;
