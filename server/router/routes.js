const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const roles = require('../enum/roles');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect(301, '/users');
});
router.get('/users', userController.getUsers);
router.post(
  '/registration',
  [
    check('nickname', 'Please, enter nickname.').notEmpty(),
    check('firstname', 'Please, enter firstname.').notEmpty(),
    check('lastname', 'Please, enter lastname.').notEmpty(),
    check('password', 'Please, enter password.').notEmpty(),
  ],
  userController.registration,
);
router.post(
  '/login',
  [
    check('nickname', 'Please, enter nickname.').notEmpty(),
    check('password', 'Please, enter password.').notEmpty(),
  ],
  authController.login,
);
router.put('/update/:id', authMiddleware, roleMiddleware([roles.admin]), userController.update);
router.delete('/delete/:id', authMiddleware, roleMiddleware([roles.admin]), userController.delete);

module.exports = router;
