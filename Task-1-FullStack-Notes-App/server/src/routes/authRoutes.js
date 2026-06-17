const express = require('express');
const { register, signup, login, logout, getMe } = require('../controllers/authControllers');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;
