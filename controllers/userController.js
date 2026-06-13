const User = require('../models/user');
const jwt = require('jsonwebtoken'); 
const { JWT_SECRET } = require('../config/config');

// 1. READ (Get All Users) - Existing
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching', error: error.message });
  }
};

// 2. CREATE (Create a New User) - Existing
const createUser = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Body parsing failed. Send JSON format.' });
    }
    const { name, email } = req.body;
    const newUser = new User({ name, email }); 
    await newUser.save();
    res.status(201).json({ message: 'Saved to local MongoDB!', data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error saving', error: error.message });
  }
};

// 3. UPDATE (Modify an existing User via ID) - 🆕 NEW
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Grabs the ID from the URL path parameter
    const { name, email } = req.body; // Grabs the new data to apply

    // { new: true } forces MongoDB to return the updated document rather than the old one
    const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found to update!' });
    }

    res.status(200).json({ message: 'User updated successfully!', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating', error: error.message });
  }
};

// 4. DELETE (Remove a User via ID) - 🆕 NEW
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Grabs the ID from the URL

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found to delete!' });
    }

    res.status(200).json({ message: 'User deleted from MongoDB successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find if the user exists in our local MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found in database!' });
    }

    // 2. Create a JWT Token payload containing user data
    const payload = {
      id: user._id,
      email: user.email
    };

    // 3. Sign the token (it expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // 4. Return the token back to the client
    res.status(200).json({
      message: 'Login Successful!',
      token: `Bearer ${token}` // Notice we append "Bearer " right here
    });

  } catch (error) {
    res.status(500).json({ message: 'Login Error', error: error.message });
  }
};

// Export all 4 CRUD methods + login
module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};