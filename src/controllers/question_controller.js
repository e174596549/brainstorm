const questionService = require('../services/question_service');
const {callService} = require('../helpers/controller_helper');
const {ERROR_CODE, genErrorRes} = require('../lib/code');
// const slogger = require('node-slogger');

exports.add = function(req, res) {
    const _body = req.body;
    if (!_body.uuid || !_body.questionName || !_body.describe || !_body.answers || !_body.level || !_body.type) {
        return genErrorRes(
            ERROR_CODE.PARAMS_NOT_EXIST,
            res
        );
    }
    _body.answers = _body.answers.split(',');
    callService(req, res, questionService.add, _body);
};
exports.get = function(req, res) {
    const _query = req.query;
    callService(req, res, questionService.get, _query);
};
