import '../App.css';
import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import styled from 'styled-components';
import Login from "./login/Login";
import Profile from "./profile/Profile"
import NavBar from "./NavBar";
import UpdateUser from "./profile/UpdateUser"
import NewPost from "./post/NewPost"
import Posts from "./post/Posts"
import MyPosts from './post/MyPosts'
import UpdatePost from './post/UpdatePost';


function App() {

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [tags, setTags] = useState([])
  const [likes, setLikes] = useState([])
  const [comments, setComments] = useState([])

  const [updatingPost, setUpdatingPost] = useState(null)


  useEffect(() => {
    // auto-login
    fetch("/me").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  useEffect(() => {
    async function getPosts() {
      const r = await fetch("/posts")
      if (r.ok) {
        r.json().then((posts) => setPosts(posts))
      }
    }

    async function getTags() {
      const r = await fetch("/tags")
      if (r.ok) {
        r.json().then((tags) => setTags(tags))
      }
    }

    async function getLikes() {
      const r = await fetch("/likes")
      if (r.ok) {
        r.json().then((likes) => setLikes(likes))
      }
    }

    async function getComments() {
      const r = await fetch("/comments")
      if (r.ok) {
        r.json().then((comments) => setComments(comments))
      }
    }

    getPosts();
    getLikes();
    getTags();
    getComments();

  }, [user])



  function handlePostDelete(postId) {
    const newPosts = posts.filter(post => !(post.id === postId))
    setPosts(newPosts)
  }

  function handleSetUpdatingPost(post) {
    const newPost = post
    setUpdatingPost(newPost)
  }

  function handleAddPost(newPost){
    const newPosts = [...posts, newPost]
    setPosts(newPosts)
  }

  function handleUpdatePost(newPost) {
      const updatedPosts = posts.map((post) => {
        if (post.id === newPost.id){
          return newPost
        }
        else {
            return post
          }
        })
      setPosts(updatedPosts)
  }

  function handleAddLike() {
      async function getPosts() {
        const r = await fetch("/posts")
        if (r.ok) {
          r.json().then((posts) => setPosts(posts))
        }
      }
      getPosts();
  }

  function handleAddComment() {
    async function getPosts() {
      const r = await fetch("/posts")
      if (r.ok) {
        r.json().then((posts) => setPosts(posts))
      }
    }
    getPosts();
  }


  if (!user) return <Login onLogin={setUser} />;
  return (
    <div className="App">
      <Title>Trana</Title>
      <NavBar setUser={setUser} />
      <Switch>
        <Route exact path="/profile">
        <Profile user = {user} onUserDelete={() => setUser(null)}/>
        </Route>
        <Route exact path="/update_user">
          <UpdateUser user = {user} onUpdateUser = {(newUser) => setUser(newUser)}/>
        </Route>
        <Route exact path="/">
          <Posts posts = {posts} user={user} likes = {likes} comments = {comments} onPostDelete={handlePostDelete} setUpdatingPost={handleSetUpdatingPost} onAddLike={handleAddLike} onAddComment = {handleAddComment}></Posts>
        </Route>
        <Route exact path="/my_posts">
          <MyPosts posts = {posts} user={user} likes = {likes} comments = {comments} onPostDelete={handlePostDelete} setUpdatingPost={handleSetUpdatingPost} onAddLike={handleAddLike} onAddComment = {handleAddComment}></MyPosts>
        </Route>
        <Route exact path="/create_post">
          <NewPost posts = {posts} user={user} tags={tags} onAddPost={handleAddPost}></NewPost>
        </Route>
        <Route exact path="/update_post">
          <UpdatePost post = {updatingPost} user={user} tags={tags} onUpdatePost={handleUpdatePost}></UpdatePost>
        </Route>
      </Switch>
    </div>
  );
}

const Title = styled.h1`
    font-size: 30px;
    text-align: center;
`;


export default App;
