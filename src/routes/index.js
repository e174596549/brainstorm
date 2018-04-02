const express = require('express');
const router = express.Router();
const question = require('../controllers/question_controller');

/*  */
router.get('/', function(req, res) {
    res.render('index');
});
router.get('/ping/health',function(req, res) {
    res.sendStatus(200);
});

router.post('/i/question/add', question.add);
router.get('/i/question/get', question.get);
router.post('/i/question/submit', question.submit);
router.post('/i/user/update-info', question.updateInfo);

module.exports = router;
