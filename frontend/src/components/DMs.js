import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

const DMs = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (user) {
      socket.emit('join', user.id);
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      if (selectedUser && (data.sender === selectedUser.id || data.receiver === selectedUser.id)) {
        setMessages(prev => [...prev, data]);
      }
      fetchConversations();
    });
  }, [selectedUser]);

  const fetchConversations = async () => {
    const res = await axios.get('/api/dms');
    setConversations(res.data);
  };

  const fetchMessages = async (userId) => {
    const res = await axios.get(`/api/dms/${userId}`);
    setMessages(res.data);
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };

  const sendMessage = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('receiver', selectedUser.id);
    formData.append('content', newMessage);
    images.forEach(img => formData.append('images', img));

    const res = await axios.post('/api/dms', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    socket.emit('sendMessage', res.data);
    setMessages(prev => [...prev, res.data]);
    setNewMessage('');
    setImages([]);
    fetchConversations();
  };

  if (!user) return <div>Please login to view DMs.</div>;

  return (
    <div style={{ padding: '20px', display: 'flex' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc' }}>
        <h3>Conversations</h3>
        {conversations.map(conv => (
          <div key={conv.user.id} onClick={() => selectUser(conv.user)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
            {conv.user.username}
          </div>
        ))}
      </div>
      <div style={{ width: '70%', paddingLeft: '20px' }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.username}</h3>
            <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
              {messages.map(msg => (
                <div key={msg._id} style={{ marginBottom: '10px' }}>
                  <strong>{msg.sender.username}:</strong> {msg.content}
                  {msg.images.map((img, i) => <img key={i} src={img} alt="" style={{ maxWidth: '200px' }} />)}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage}>
              <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message" required />
              <input type="file" multiple onChange={e => setImages([...e.target.files])} />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a conversation</p>
        )}
      </div>
    </div>
  );
};

export default DMs;