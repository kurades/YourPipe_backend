var express = require('express');
const { register,login } = require('../controller/user.controller');
var router = express.Router();


router.post('/register',register)
router.post('/login',login)
module.exports = router;
