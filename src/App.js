import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import { UserProvider } from './context/UserContext';
import './App.css';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Home from './pages/Home';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Footer from './pages/Footer';
import MyBlogs from './pages/MyBlogs';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
function App() {

  const [user, setUser] = useState({
    id: null
  });
  const unsetUser = () => {

    localStorage.clear();

  };
  useEffect(() => {

    fetch(`https://blog-app-api-anep.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      if (typeof data.user !== "undefined") {

        setUser({
          id: data.user._id,
        });

      } else {

        setUser({
          id: null
        });

      }

    })

    }, []);

    useEffect(() => {
      console.log(user);
      console.log(localStorage);
    }, [user])

    return (
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
              <Route path="/posts" element={<MyBlogs />} />
              <Route path="/posts/add-post" element={<AddPost />} />
              <Route path="/posts/edit-post/:postId" element={<EditPost />} />
              <Route path="*" element={<Error />} />
            </Routes>
        </Router>
        <Footer />
      </UserProvider>
  );
}

export default App;