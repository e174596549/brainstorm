const express = require('express');
const router = express.Router();
// const device = require('../controllers/device_controller');

/*  */
router.get('/', function(req, res) {
    res.render('index');
});
router.get('/ping/health',function(req, res) {
    res.sendStatus(200);
});

// router.post('/i/device/report', device.add);
// router.get('/i/api/device/query', device.query);

module.exports = router;
