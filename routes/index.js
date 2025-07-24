const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController, PostController } = require('../controllers');
const authenticateToken = require('../middleware/auth');

const uploadDestination = 'uploads'; // папка куди будемо зберігати файли

// Показуємо де зберігати файли
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const uploads = multer({ storage: storage }); // база файлів

// Маршрути користувачів для браузера і postman
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.currentUser);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.put('/users/:id', authenticateToken, UserController.updateUser);

// Маршрути постыв для браузера і postman
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPosts);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePostById);  // мітка часу на відео 2:38:05

module.exports = router;