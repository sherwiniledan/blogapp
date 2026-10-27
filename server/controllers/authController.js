const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
};

const userPayload = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  isAdmin: user.isAdmin,
  token: generateToken(user._id)
});

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, isAdmin } = req.body;

    // 1. Required fields (confirmPassword is now required)
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide username, email, password and confirm password' });
    }

    // 2. Confirm password must match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // 3. Basic format checks
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // 4. Duplicate check (email is stored lowercase, so compare lowercase)
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    const userExists = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'User with this email or username already exists' });
    }

    // confirmPassword is never saved - only the (hashed) password
    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password,
      isAdmin: Boolean(isAdmin)
    });

    res.status(201).json({ success: true, data: userPayload(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({ success: true, data: userPayload(user) });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
