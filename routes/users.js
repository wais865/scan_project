var express = require('express');
var router = express.Router();

const controllers = require('../controllers/usersController');

/* GET users listing. */
router.get('/', controllers.usersPage);

module.exports = router;
