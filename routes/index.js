const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController, PostController, CommentController, LikeController, FollowController } = require('../controllers');
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
router.put('/users/:id', authenticateToken, uploads.single('avatar'), UserController.updateUser);

// Маршрути постів для браузера і postman
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPosts);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePostById);

// Маршрути коментарів для браузера і postman
router.post('/comments', authenticateToken, CommentController.createComment);
router.delete('/comments/:id', authenticateToken, CommentController.deleteCommentById);

// Маршрути лайків для браузера і postman
router.post('/likes', authenticateToken, LikeController.likePost);
router.delete('/likes/:id', authenticateToken, LikeController.unlikePost);

// Маршрути підписок для браузера і postman
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete('/unfollow/', authenticateToken, FollowController.unfollowUser);

module.exports = router;