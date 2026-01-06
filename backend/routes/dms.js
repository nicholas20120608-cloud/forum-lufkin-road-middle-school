const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Send message
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  const { receiver, content } = req.body;

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

    const message = new Message({ sender: req.user.id, receiver, content, images });
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get messages between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).populate('sender', 'username').populate('receiver', 'username').sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all conversations for user
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).populate('sender', 'username').populate('receiver', 'username').sort({ createdAt: -1 });

    const conversations = {};
    messages.forEach(msg => {
      const otherUser = msg.sender.id === req.user.id ? msg.receiver : msg.sender;
      if (!conversations[otherUser.id]) {
        conversations[otherUser.id] = { user: otherUser, lastMessage: msg };
      }
    });

    res.json(Object.values(conversations));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;