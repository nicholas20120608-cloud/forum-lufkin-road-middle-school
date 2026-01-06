import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Forum = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [images, setImages] = useState([]);
  const [replyData, setReplyData] = useState({ postId: '', content: '' });
  const [replyImages, setReplyImages] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get('/api/posts');
    setPosts(res.data);
  };

  const onSubmitPost = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    images.forEach(img => formData.append('images', img));

    await axios.post('/api/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setNewPost({ title: '', content: '' });
    setImages([]);
    fetchPosts();
  };

  const onSubmitReply = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', replyData.content);
    replyImages.forEach(img => formData.append('images', img));

    await axios.post(`/api/posts/${replyData.postId}/reply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setReplyData({ postId: '', content: '' });
    setReplyImages([]);
    fetchPosts();
  };

  if (!user) return <div>Please login to view the forum.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lufkin Road Middle School Forum</h2>
      <form onSubmit={onSubmitPost}>
        <input type="text" placeholder="Title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required />
        <textarea placeholder="Content" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} required />
        <input type="file" multiple onChange={e => setImages([...e.target.files])} />
        <button type="submit">Post</button>
      </form>
      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.images.map((img, i) => <img key={i} src={img} alt="" style={{ maxWidth: '200px' }} />)}
          <p>By {post.author.username}</p>
          <button onClick={() => setReplyData({ postId: post._id, content: '' })}>Reply</button>
          {replyData.postId === post._id && (
            <form onSubmit={onSubmitReply}>
              <textarea placeholder="Reply" value={replyData.content} onChange={e => setReplyData({ ...replyData, content: e.target.value })} required />
              <input type="file" multiple onChange={e => setReplyImages([...e.target.files])} />
              <button type="submit">Submit Reply</button>
            </form>
          )}
          {post.replies.map((reply, i) => (
            <div key={i} style={{ marginLeft: '20px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
              <p>{reply.content}</p>
              {reply.images.map((img, j) => <img key={j} src={img} alt="" style={{ maxWidth: '200px' }} />)}
              <p>By {reply.author.username}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Forum;