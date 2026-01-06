const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create post
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  const { title, content } = req.body;

  try {
    let images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(file.buffer);
        });
        images.push(result.secure_url);
      }
    }

    const post = new Post({ title, content, author: req.user.id, images });
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').populate('replies.author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add reply
router.post('/:id/reply', auth, upload.array('images', 5), async (req, res) => {
  const { content } = req.body;

  try {
    let images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(file.buffer);
        });
        images.push(result.secure_url);
      }
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.replies.push({ content, author: req.user.id, images });
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete post (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    if (!user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;