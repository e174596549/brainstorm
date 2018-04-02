const BASE_CODE_PARAM = 1000;
const BASE_CODE_LOGICAL = 2000;
const BASE_CODE_FATAL = 3000;
exports.ERROR_CODE = {
    APP_ID_NOT_EXIST: {code: BASE_CODE_FATAL, msg: 'app_id不存在'},
    SIGN_ERROR: {code: BASE_CODE_FATAL + 1, msg: '签名错误'},
    TIME_STAMPE_NOT_EXIST: {code: BASE_CODE_FATAL + 2, msg: 'timestamp不存在'},
    REQ_TIMEOUT: {code: BASE_CODE_FATAL + 3, msg: '请求超时'},
    CALL_NOTIFY_URL_FAIL: {code: BASE_CODE_FATAL + 4, msg: '请求通知接口失败'},
    CALL_NOTIFY_RETURN_FORMAT_INVALID: {code: BASE_CODE_FATAL + 4, msg: '请求通知接口失败'},
    CALL_NOTIFY_RETURN_ERROR: {code: BASE_CODE_FATAL + 5, msg: '请求通知接口返回错误'},
    CALL_PROXY_URL_FAIL: {code: BASE_CODE_FATAL + 6, msg: '请求代理接口失败'},

    SAVE_QUESTION_DATA_FAIL: {code: BASE_CODE_LOGICAL, msg: '保存问题信息出错'},
    SYNCHRONIZE_API_RESPONSE_NULL: {code: BASE_CODE_LOGICAL + 1, msg: '请求同步直播人数信息接口无响应'},
    QUESTION_ID_NOT_EXIST: {code: BASE_CODE_LOGICAL + 2, msg: '题目ID生成失败'},
    CACHE_QUESTION_2_SET_FAIL: {code: BASE_CODE_LOGICAL + 3, msg: '添加题目 ID 到题目列表缓存失败'},
    CACHE_QUESTION_2_HASH_FAIL: {code: BASE_CODE_LOGICAL + 4, msg: '添加题目 ID 到题目详情缓存失败'},
    GET_QUESTION_BY_ID_FAIL: {code: BASE_CODE_LOGICAL + 5, msg: '通过问题 ID 获取题目详情失败'},
    QUESTION_NOT_EXIST_IN_CACHE: {code: BASE_CODE_LOGICAL + 6, msg: '缓存中未查到改题'},
    PARSE_QUESTION_INFO_FAIL: {code: BASE_CODE_LOGICAL + 7, msg: '解析题目信息失败'},
    GET_QUESTION_ID_FROM_CACHE_FAIL: {code: BASE_CODE_LOGICAL + 8, msg: '从缓存中获取 questionID 失败'},
    NO_QUESTION_ID_CAN_USE: {code: BASE_CODE_LOGICAL + 9, msg: '无可用题目'},
    QUESTION_INFO_NOT_EXIST: {code: BASE_CODE_LOGICAL + 10, msg: '题目详情不存在'},
    INC_USER_RIGHT_TIMES_FAIL: {code: BASE_CODE_LOGICAL + 11, msg: '增加用户答题情况失败'},
    UPDATE_USER_TOKEN_INFO_FAIL: {code: BASE_CODE_LOGICAL + 12, msg: '更新用户 token 信息失败'},
    INC_USER_RANK_SCORE_FAIL : {code: BASE_CODE_LOGICAL + 13, msg: '增加用户在排行榜中的积分失败'},
    INC_USER_ANWSER_TIMES_FAIL  : {code: BASE_CODE_LOGICAL + 14, msg: '增加用户答题次数失败'},

    PARSE_RESULT_FAIL: {code: BASE_CODE_PARAM, msg: '解析请求参数失败'},
    PARAMS_NOT_EXIST: {code: BASE_CODE_PARAM + 1, msg: '请求参数错误'},

};

exports.genErrorCallback = function(code, callback, msg) {
    if(msg) {
        return callback({code: code.code, msg})
    }
    callback(code);
};

exports.genErrorRes = function(code, res, msg) {
    if(msg) {
        return res.send({code: code.code, msg});
    }
    res.send(code);
};
