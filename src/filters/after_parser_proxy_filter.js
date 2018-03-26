const {doProxy} = require('../lib/http_util');
const {
    app: {
        backend_secret,
    }} = require('../config');
const {doSign} = require('../helpers/auth_helper');
const {ERROR_CODE, genErrorRes} = require('../lib/code');
const slogger = require('node-slogger');

const URL_TO_AGENT = {
};

module.exports = function (req, res, next) {
    const path = req.path;
    const agentUrl = URL_TO_AGENT[path];
    if (agentUrl) {
        let {query, body, method} = req;
        const data = {};
        Object.assign(data, query, body);
        data.sign = doSign(data, backend_secret);
        if (method === "GET") {
            query = data;
        } else if (method === "POST") {
            body = data;
        }
        const options = {
            url:agentUrl,
            method,
            headers:{
                'User-Agent':  'api-server'
            },
            qs: method === "GET" ? data : query,
            form: method === "POST" ? data : body,
            json: true,
            timeout: 10000
        };
        doProxy(options, function (err, msg) {
            if (err) {
                slogger.error("请求代理接口失败", err);
                return genErrorRes(
                    ERROR_CODE.CALL_PROXY_URL_FAIL,
                    res,
                    err);
            }
            res.send(msg);
        })
    } else {
        next();
    }
};
