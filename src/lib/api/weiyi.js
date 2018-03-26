const {doGet} = require('../http_util');
const KEY = 'hAzcjPYi0hQ0UVHF';
const BASE_URL = 'http://123.207.110.209/WebAPI/';

exports.doRequest = function(path,params,desc,callback) {
    let url = BASE_URL + path + '/key/' + KEY;
    for (let key in params) {
        url += `/${key}/${params[key]}`;
    }
    doGet(url,params,desc,callback);
};