const BASE_CODE_PARAM = 1000;
const BASE_CODE_LOGICAL = 2000;
const BASE_CODE_FATAL = 3000;
exports.ERROR_CODE = {
    APP_ID_NOT_EXIST : {code:BASE_CODE_FATAL,msg:'app_id不存在'},
    SIGN_ERROR:{code:BASE_CODE_FATAL+1,msg:'签名错误'},
    TIME_STAMPE_NOT_EXIST : {code:BASE_CODE_FATAL+2,msg:'timestamp不存在'},
    REQ_TIMEOUT : {code:BASE_CODE_FATAL+3,msg:'请求超时'},
    CALL_NOTIFY_URL_FAIL : {code:BASE_CODE_FATAL+4,msg:'请求通知接口失败'},
    CALL_NOTIFY_RETURN_FORMAT_INVALID : {code:BASE_CODE_FATAL+4,msg:'请求通知接口失败'},
    CALL_NOTIFY_RETURN_ERROR : {code:BASE_CODE_FATAL+5,msg:'请求通知接口返回错误'},
    CALL_PROXY_URL_FAIL : {code:BASE_CODE_FATAL+6,msg:'请求代理接口失败'},

    SYNCHRONIZE_API_RES_ERR : {code:BASE_CODE_LOGICAL,msg:'请求同步直播人数信息接口返回错误：'},
    SYNCHRONIZE_API_RESPONSE_NULL : {code:BASE_CODE_LOGICAL+1,msg:'请求同步直播人数信息接口无响应'},
    UPDATE_LIVE_INFO_FAIL : {code:BASE_CODE_LOGICAL+2,msg:'请求同步直播人数信息接口出错'},
    CHECK_UPDATED_LIVE_DATA_FAIL : {code:BASE_CODE_LOGICAL+3,msg:'检查已更新直播ID信息时失败'},
    SAVE_UPDATED_LIVE_ID_FAIL : {code:BASE_CODE_LOGICAL+4,msg:'存储已同步直播ID时失败'},


    PARSE_RESULT_FAIL : {code:BASE_CODE_PARAM,msg:'解析请求参数失败'},
    REPORT_DATA_EMPTY : {code:BASE_CODE_PARAM + 1,msg:'上报数据为空'},

};

exports.genErrorCallback = function(code,callback,msg) {
    if (msg) {
        return callback({code:code.code,msg})
    }
    callback(code);
};

exports.genErrorRes = function(code,res,msg) {
    if (msg) {
        return res.send({code:code.code,msg});
    }
    res.send(code);
};
