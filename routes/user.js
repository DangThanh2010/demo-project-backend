const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authenAndAutho');

const controller = require('../controllers/user.controller');

router.get('/list-user', auth(1), controller.getListUser);
router.get('/list-admin', auth(0), controller.getListAdmin);

module.exports = router;