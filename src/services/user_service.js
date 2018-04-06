const async = require('neo-async');
const slogger = require('node-slogger');
const {
    redisClient,
    MAX_ANSWER_COUNTS
} = require('../config');
const {QuestionModel} = require('./index');
const {ERROR_CODE, genErrorCallback} = require('../lib/code');
const REDIS_KEY_QUESTION_ID_SET = 'bran_strom:question_id_set:';
const REDIS_KEY_QUESTION_INFO_HASH = 'bran_strom:question_info_hash:';
const REDIS_KEY_USER_INFO_HASH = 'bran_strom:user_info_hash:';
const REDIS_KEY_USER_TOKEN_STRING = 'bran_strom:user_token_string:';
const REDIS_KEY_USER_RANK_ZSET = 'bran_strom:user_rank_zset:';
const USER_RIGHT_TIMES = 'right_times';
const USER_WRONG_TIMES = 'wrong_times';
const date = new Date();
const today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;


exports.updateInfo = function(data, callback) {
    const {uuid, avatarUrl, nickName} = data;
    async.auto({
        doUpdate: function(next) {
            const key = REDIS_KEY_USER_TOKEN_STRING + uuid;
            redisClient.set(key, JSON.stringify({
                nickName,
                avatarUrl
            }), function(err) {
                if(err) {
                    slogger.error(`更新用户 token 信息失败`, err);
                    return genErrorCallback(
                        ERROR_CODE.UPDATE_USER_TOKEN_INFO_FAIL,
                        next
                    );
                }
                next(false);
            })
        },
        getInfo: function(next) {
            info(data, function(err, item) {
                if(err) {
                    slogger.error(`调用获取用户信息接口失败`, err);
                    return genErrorCallback(
                        ERROR_CODE.CALL_INFO_API_FAIL,
                        next
                    );
                }
                next(false, item);
            })
        }
    }, function(err, results) {
        if(err) {
            return genErrorCallback(
                err,
                callback
            );
        }
        callback(false, results.getInfo);
    });
};

const _getAllRankInfo = function(pageNum = 1, pageSize = 10, callback) {
    const listKey = REDIS_KEY_USER_RANK_ZSET + today;
    let total_num = 0;
    let total_page = 0;
    async.waterfall([
        function(next) {
            redisClient.zcard(listKey, function(err, reply) {
                if(err) {
                    slogger.error('获取排行榜总人数时失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_RANK_LIST_COUNT_FAILE,
                        next
                    );
                }
                if(!reply) {
                    // return genErrorCallback(
                    //     ERROR_CODE.ONLINE_LIST_EMPTY,
                    //     next
                    // );
                    return next(false);
                }
                total_num = Number(reply);
                total_page = Math.ceil(reply / pageSize);
                next(false);
            });
        },
        function(next) {
            if(total_num === 0 || pageNum > total_page) {
                return next(false, []);
            }
            const start = (pageNum - 1) * pageSize;
            const stop = start + pageSize - 1;
            redisClient.zrevrange(listKey, start, stop, 'withscores', function(err, replys) {
                if(err) {
                    slogger.error('获取排行榜列表时失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_RANK_LIST_IDS_FAILE,
                        next
                    );
                }
                const users = [];
                for(let i = 0; i < replys.length; i += 2) {
                    users.push({
                        uuid: replys[i],
                        score: replys[i + 1],
                        rank: start + i/2 + 1
                    })
                }
                next(false, users);
            });
        },
        function(users, next) {
            async.each(users, function(userInfo, nextStep) {
                const {
                    uuid
                } = userInfo;
                const key = REDIS_KEY_USER_TOKEN_STRING + uuid;
                redisClient.get(key, function(err, token) {
                    if(err) {
                        slogger.error('获取用户 token 表时失败', err);
                        return genErrorCallback(
                            ERROR_CODE.GET_USER_TOKEN_INFO_FAILE,
                            nextStep
                        );
                    }
                    if(!token) {
                        return genErrorCallback(
                            ERROR_CODE.USER_TOKEN_INFO_NOT_FIND,
                            nextStep
                        );
                    }
                    try {
                        token = JSON.parse(token);
                    } catch(e) {
                        if(e) {
                            slogger.error(`解析用户信息失败`, token);
                            return genErrorCallback(
                                ERROR_CODE.PARSE_USER_TOKEN_INFO_FAIL,
                                nextStep
                            );
                        }
                    }
                    Object.assign(userInfo, token);
                    nextStep(false);
                })
            }, function(err) {
                if(err) {
                    return genErrorCallback(
                        err,
                        next
                    );
                }
                next(false, {
                    record_total: total_num,
                    page_num: Number(pageNum),
                    page_total: total_page,
                    page_size: Number(pageSize),
                    list: users
                });
            });
        }

    ], callback);
};

exports.getRank = function(data, callback) {
    const {uuid, page_num, page_size} = data;
    async.auto({
        getAllRank: function(next) {
            _getAllRankInfo(page_num, page_size, function(err, item) {
                if(err) {
                    slogger.error('获取排行榜信息失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_RANK_LIST_INFO_FAIL,
                        next
                    );
                }
                next(false, item)
            })
        },
        getUserRankInfo: function(next) {
            const key = REDIS_KEY_USER_RANK_ZSET + today;
            redisClient.zrevrank(key, uuid, function(err, item) {
                if(err) {
                    slogger.error('查询用户排名失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_USER_RANK_INFO_FAIL,
                        next
                    );
                }
                next(false, item === null ? null : item + 1)
            })
        },
        getUserCountInfo: function(next) {
            const key = REDIS_KEY_USER_RANK_ZSET + today;
            redisClient.zscore(key, uuid, function(err, item) {
                if(err) {
                    slogger.error('查询用户积分失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_USER_COUNT_INFO_FAIL,
                        next
                    );
                }
                next(false, item)
            })
        }
    }, function(err, results) {
        if(err) {
            return genErrorCallback(
                err,
                callback
            );
        }
        const data = {};
        Object.assign(data, results.getAllRank);
        data.score = Number(results.getUserCountInfo);
        data.rank = results.getUserRankInfo;
        callback(false, data);
    });
};

const info = exports.info = function(data, callback) {
    const {uuid} = data;
    async.auto({
        getUserInfo: function(next) {
            const key = REDIS_KEY_USER_INFO_HASH + today + ':' + uuid ;
            redisClient.hgetall(key, function(err, item) {
                if(err) {
                    slogger.error('获取用操作信息失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_USER_OPERATION_INFO_FAIL,
                        next
                    );
                }
                next(false, item);
            })
        },
        getUserRankInfo: function(next) {
            const key = REDIS_KEY_USER_RANK_ZSET + today;
            redisClient.zrevrank(key, uuid, function(err, item) {
                if(err) {
                    slogger.error('查询用户排名失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_USER_RANK_INFO_FAIL,
                        next
                    );
                }
                next(false, item === null ? null : item + 1);
            })
        },
        getUserCountInfo: function(next) {
            const key = REDIS_KEY_USER_RANK_ZSET + today;
            redisClient.zscore(key, uuid, function(err, item) {
                if(err) {
                    slogger.error('查询用户积分失败', err);
                    return genErrorCallback(
                        ERROR_CODE.GET_USER_COUNT_INFO_FAIL,
                        next
                    );
                }
                next(false, Number(item));
            })
        }
    }, function(err, results) {
        if(err) {
            return genErrorCallback(
                err,
                callback
            );
        }
        const {getUserCountInfo, getUserRankInfo, getUserInfo} = results;
        callback(false, {
            score: getUserCountInfo,
            rank: getUserRankInfo,
            submitTimes: Number(getUserInfo.submitTimes),
            rightTimes: Number(getUserInfo.right_times),
            wrongTimes: Number(getUserInfo.wrong_times),
            powerCount: MAX_ANSWER_COUNTS - Number(getUserInfo.submitTimes)
        });
    });
};