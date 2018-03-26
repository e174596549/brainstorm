const apiService = require('../services/api_service');
const {callService} = require('../helpers/controller_helper');
//const {ERROR_CODE, genErrorRes} = require('../lib/code');
// const slogger = require('node-slogger');

exports.strategyStop = function(req, res) {
    const _body = req.body;
    callService(req, res, apiService.strategyStop, _body);
};
exports.startedStrategy = function(req, res) {
    const _query = req.query;
    callService(req, res, apiService.startedStrategy, _query);
};
