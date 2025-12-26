const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { adminAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/login', adminController.loginAdmin);
router.post('/register', adminAuthMiddleware, adminController.registerAdmin);
router.get('/', adminAuthMiddleware, adminController.getAllAdmins);
router.put('/:id', adminAuthMiddleware, adminController.updateAdmin);
router.delete('/:id', adminAuthMiddleware, adminController.deleteAdmin);

module.exports = router;