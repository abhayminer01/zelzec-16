const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { userAuthMiddleware } = require('../middlewares/auth.middleware');

router.get('/check', authController.checkAuth);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/', userAuthMiddleware, authController.getUser);
router.put('/', userAuthMiddleware, authController.updateUser);
router.delete('/', userAuthMiddleware, authController.deleteUser);

// Update Password Routes
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;