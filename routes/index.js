var express = require('express');
// const multer = require('multer');
var router = express.Router();
// const upload = multer();

const controller = require('../controllers/indexController');

/* GET /index home page. */
router.get('/index', controller.indexFiles);

/* GET /dashboard dashboard page. */
router.get('/dashboard', controller.dashboardFiles);

/* post /index home page add new document. */
router.post('/index/add-new-doc',controller.createNewDoc);

module.exports = router;
