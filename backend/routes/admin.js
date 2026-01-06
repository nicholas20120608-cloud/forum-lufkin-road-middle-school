const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');

const router = express.Router();

// Get all users
router.get('/users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete user
router.delete('/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

    await User.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ author: req.params.id });
    await Message.deleteMany({ $or: [{ sender: req.params.id }, { receiver: req.params.id }] });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all posts for moderation
router.get('/posts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;