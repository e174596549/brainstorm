const userService = require('../services/user_service');
const {callService} = require('../helpers/controller_helper');
const {ERROR_CODE, genErrorRes} = require('../lib/code');
// const slogger = require('node-slogger');

exports.updateInfo = function(req, res) {
    const _body = req.body;
    // if (!_body.uuid || !_body.questionName || !_body.describe || !_body.answers || !_body.level || !_body.type) {
    //     return genErrorRes(
    //         ERROR_CODE.PARAMS_NOT_EXIST,
    //         res
    //     );
    // }
    callService(req, res, userService.updateInfo, _body);
};

exports.get = function(req, res) {
    const _query = req.query;
    // if (!_body.uuid || !_body.questionName || !_body.describe || !_body.answers || !_body.level || !_body.type) {
    //     return genErrorRes(
    //         ERROR_CODE.PARAMS_NOT_EXIST,
    //         res
    //     );
    // }
    if(_query.page_num) {
        _query.page_num = Number(_query.page_num)
    }
    if(_query.page_size) {
        _query.page_size = Number(_query.page_size)
    }
    callService(req, res, userService.get, _query);
};