var express = require('express');
var router = express.Router();

const controller = require('../controllers/indexController');

/* GET /index home page. */
router.get('/index', controller.indexFiles);

/* GET /dashboard dashboard page. */
router.get('/dashboard', controller.dashboardFiles);

module.exports = router;
