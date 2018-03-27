const questionService = require('../services/question_service');
const {callService} = require('../helpers/controller_helper');
//const {ERROR_CODE, genErrorRes} = require('../lib/code');
// const slogger = require('node-slogger');

exports.add = function(req, res) {
    const _body = req.body;
    if (!_body.from_env) {
        return genErrorRes(
            ERROR_CODE.FROM_ENV_EMPTY,
            res
        );
    }
    _body.answers = _body.answers.split(',');
    callService(req, res, questionService.add, _body);
};
// exports.startedStrategy = function(req, res) {
//     const _query = req.query;
//     callService(req, res, apiService.startedStrategy, _query);
// };
