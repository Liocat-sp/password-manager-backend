const express = require('express');
const userController = require('../controllers/UserController');
const { check} = require('express-validator');
const router = express.Router();

router.post('/signup', [
    check('email').normalizeEmail().isEmail(),
    check('name').not().isEmpty(),
    check('password').isLength({min: 8})
], userController.postSignup);

router.post('/login', [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 8})
], userController.postLogin);


module.exports = router;  