import HomePages from "./pages/homePage/HomePages";
import News from "./pages/news/News";
import Playlists from "./pages/playlists/Playlists"
import './App.css'
import Navbar from "./components/navbar";
import {
  BrowserRouter as Router,
  Route,Routes,
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
import Blank from "./pages/Blank";
import React,{ useState, useEffect } from "react";
import FeatureAd from "./pages/admin-pages/FeatureAd";
import LoadingPlaylists from "./context/loading/PlayListLoad/LoadingPlaylists";
import LoadingScreen from "./context/loading/LoadingScreen";


function App() {


  return (
       <Router>
        <Navbar/>
        {/* <NavigationControl /> */}
          <Routes>
            <Route path="/load" element = {<LoadingScreen/>}/>
             <Route path="/" exact element={<HomePages/>} />
             <Route path="home" exact element={<Home/>}/>
             <Route path="news" element={<News/>} />
             <Route path="playlists" element={<Playlists/>} />
             <Route path="/about" element={<About/>} />
             <Route path="submissions" element={<Submissions/>} />
             <Route path="editors-pick" element = {<EditorsPicks/>}/>
             <Route path="/article/:category/:articleId" element={<ArticlePage/>} />
             <Route path="/t2nrkxgof25hi3as46h5mgen5cjd7hdnxxogi943hg1hm9j1sdft68eskyiwfe0siz96cuiu7yn7dfn9c7stz01hvi" element={<LoginPage />} />
             <Route path="cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517" element= {<Admin/>}>
             <Route path="create-posts" element={<AdminPosts/>} />
             <Route path="update-playlist" element={<UpdatePlaylists/>} />
             <Route path="all-articles" element={<ArticleList/>} />
             <Route path="all-playlists" element={<PlaylistList/>} />
             <Route path="top-picks" element={<TopPicksPage/>} />
             <Route path="top-playlist" element={<HighlightPlaylist/>} />
             <Route path="featured-ad" element={<FeatureAd/>}/>
             </Route>
              {/* No path specified for NotFound component */}
            <Route path="*"  element={<Blank/>} />  
          </Routes>
        <Footer/>
      </Router>
        
);
}

export default App;
