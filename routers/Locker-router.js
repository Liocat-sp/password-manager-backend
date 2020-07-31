const express = require('express');
const LockerController = require('../controllers/LockerController');
const {check} = require('express-validator');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.use(checkAuth);

router.post('/new',[
    check('website').not().isEmpty(),
    check('websiteUrl').not().isEmpty(),
    check('logoUrl').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
] ,LockerController.postNewAcc);

router.get('/:userId', LockerController.getAccounts);

router.get('/acc/:accId', LockerController.getAccountById)

router.delete('/acc/:accId', LockerController.deleteAccount);

// ************** FUTURE UPDATE ********************************
// router.patch('/acc/:accId', LockerController.updateAccount);

module.exports = router;
