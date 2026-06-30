const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/login', userController.loginUser);

// 🟢 Both Admin and Manager can View (READ)
router.get('/', authMiddleware, roleMiddleware(['Admin', 'Manager']), userController.getAllUsers);

// 🔵 Only Manager can Create (CREATE)
router.post('/', authMiddleware, roleMiddleware(['Manager']), userController.createUser);

// 🟡 Only Manager can Update (UPDATE)
router.put('/:id', authMiddleware, roleMiddleware(['Manager']), userController.updateUser);

// 📸 Only Manager can Upload (UPLOAD)
router.post('/upload', authMiddleware, roleMiddleware(['Manager']), upload.single('image'));

// 🔴 Only Admin can Delete (DELETE)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), userController.deleteUser);


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