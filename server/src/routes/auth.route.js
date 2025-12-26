const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { userAuthMiddleware } = require('../middlewares/auth.middleware');

router.get('/check', authController.checkAuth);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/', userAuthMiddleware, authController.getUser);
router.put('/', userAuthMiddleware, authController.updateUser);

module.exports = router;