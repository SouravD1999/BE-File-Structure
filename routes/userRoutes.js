const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');


router.post('/login', userController.loginUser);

// 🟢 READ Operation
router.get('/', userController.getAllUsers);

// 🔵 CREATE Operation (Protected by your JWT middleware)
router.post('/', authMiddleware, userController.createUser);

// 🟡 UPDATE Operation (Requires JWT + user ID in URL)
router.put('/:id', authMiddleware, userController.updateUser);

// 🔴 DELETE Operation (Requires JWT + user ID in URL)
router.delete('/:id', authMiddleware, userController.deleteUser);


router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    // Return the details of the saved file back to the user
    res.status(200).json({
      message: 'File uploaded successfully!',
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload Error', error: error.message });
  }
});

module.exports = router;