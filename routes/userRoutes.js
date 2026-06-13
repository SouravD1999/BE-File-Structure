const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/login', userController.loginUser);

// 🟢 READ Operation
router.get('/', userController.getAllUsers);

// 🔵 CREATE Operation (Protected by your JWT middleware)
router.post('/', authMiddleware, userController.createUser);

// 🟡 UPDATE Operation (Requires JWT + user ID in URL)
router.put('/:id', authMiddleware, userController.updateUser);

// 🔴 DELETE Operation (Requires JWT + user ID in URL)
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;