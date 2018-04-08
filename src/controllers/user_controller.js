const userService = require('../services/user_service');
const {callService} = require('../helpers/controller_helper');
const {ERROR_CODE, genErrorRes} = require('../lib/code');
// const slogger = require('node-slogger');

exports.updateInfo = function(req, res) {
    const _body = req.body;
    if (!_body.js_code) {
        return genErrorRes(
            ERROR_CODE.PARAMS_NOT_EXIST,
            res
        );
    }
    callService(req, res, userService.updateInfo, _body);
};

exports.getRank = function(req, res) {
    const _query = req.query;
    if (!_query.uuid) {
        return genErrorRes(
            ERROR_CODE.PARAMS_NOT_EXIST,
            res
        );
    }
    if(_query.page_num) {
        _query.page_num = Number(_query.page_num)
    }
    if(_query.page_size) {
        _query.page_size = Number(_query.page_size)
    }
    callService(req, res, userService.getRank, _query);
};

exports.info = function(req, res) {
    const _query = req.query;
    if (!_query.uuid) {
        return genErrorRes(
            ERROR_CODE.PARAMS_NOT_EXIST,
            res
        );
    }
    callService(req, res, userService.info, _query);
};