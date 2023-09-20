var express = require('express');
// const multer = require('multer');
var router = express.Router();
// const upload = multer();

const controller = require('../controllers/indexController');

/* GET /index home page. */
router.get('/index', controller.indexFiles);

/* GET /dashboard dashboard page. */
router.get('/dashboard', controller.dashboardFiles);
/* GET /dashboard dashboard page. */
router.get('/document-list', controller.documentFiles);

/* post /index home page add new document. */
router.post('/index/add-new-doc',controller.createNewDoc);

/* post /search home page document. */
router.get('/api/customers', controller.searchFunc);

module.exports = router;
