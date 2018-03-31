const async = require('neo-async');
const slogger = require('node-slogger');
const {
    redisClient
} = require('../config');
const {QuestionModel} = require('./index');
const {ERROR_CODE, genErrorCallback} = require('../lib/code');
const REDIS_KEY_QUESTION_ID_SET = 'bran_strom:question_id_set:';
const REDIS_KEY_QUESTION_INFO_HASH = 'bran_strom:question_info_hash:';
const REDIS_KEY_USER_INFO_HASH = 'bran_strom:user_info_hash:';
const USER_RIGHT_TIMES = 'right_times';
const USER_WRONG_TIMES = 'wrong_times';

exports.add = function(data, callback) {
    const {type, level} = data;
    async.auto({
        save_data: function(next) {
            new QuestionModel(data).save(function(err, item) {
                if(err) {
                    slogger.error(`保存问题信息出错: `, err);
                    return genErrorCallback(
                        ERROR_CODE.SAVE_QUESTION_DATA_FAIL,
                        next
                    );
                }
                next(false, item._id);
            })
        },
        cache2QuestionSet: ['save_data', function(results, next) {
            if(!results || !results.save_data) {
                return genErrorCallback(
                    ERROR_CODE.QUESTION_ID_NOT_EXIST,
                    next
                );
            }
            const question_id = results.save_data;
            const key = REDIS_KEY_QUESTION_ID_SET + type + ':' + level;
            redisClient.sadd(key, question_id, function(err) {
                if(err) {
                    slogger.error(`添加题目 ID 到题目列表缓存失败`, err);
                    return genErrorCallback(
                        ERROR_CODE.CACHE_QUESTION_2_SET_FAIL,
                        next
                    );
                }
                next(false);
            })
        }],
        cache2QuestionHash: ['save_data', function(results, next) {
            if(!results || !results.save_data) {
                return genErrorCallback(
                    ERROR_CODE.QUESTION_ID_NOT_EXIST,
                    next
                );
            }
            const question_id = results.save_data;
            data.question_id = question_id;
            redisClient.hset(REDIS_KEY_QUESTION_INFO_HASH, question_id, JSON.stringify(data), function(err) {
                if(err) {
                    slogger.error(`添加题目 ID 到题目详情缓存失败`, err);
                    return genErrorCallback(
                        ERROR_CODE.CACHE_QUESTION_2_HASH_FAIL,
                        next
                    );
                }
                next(false);
            })
        }]
    }, function(err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
        if(err) {
            return genErrorCallback(
                err,
                callback
            );
        }
        callback(false, {
            questionId: results.save_data
        });
    });
};
exports.get = function(data, callback) {
    const {level, type, questionId} = data;
    async.auto({
        getQuestionId: function(next) {
            if (!questionId) {
                const key = REDIS_KEY_QUESTION_ID_SET + type + ':' + level;
                redisClient.srandmember(key, function(err, question_id) {
                    if(err) {
                        slogger.error(`从缓存中获取 questionID 失败`, err);
                        return genErrorCallback(
                            ERROR_CODE.GET_QUESTION_ID_FROM_CACHE_FAIL,
                            next
                        );
                    }
                    if(!question_id) {
                        return genErrorCallback(
                            ERROR_CODE.NO_QUESTION_ID_CAN_USE,
                            next
                        );
                    }
                    next(false, question_id);
                })
            } else {
                next(false, questionId);
            }
        },
        getQuestionInfo: ['getQuestionId', function(results, next) {
            if(!results || !results.getQuestionId) {
                return genErrorCallback(
                    ERROR_CODE.QUESTION_ID_NOT_EXIST,
                    next
                );
            }
            redisClient.hget(REDIS_KEY_QUESTION_INFO_HASH, results.getQuestionId, function(err, item) {
                if(err) {
                    slogger.error(`通过问题 ID 获取题目详情失败`, err);
                    return genErrorCallback(
                        ERROR_CODE.GET_QUESTION_BY_ID_FAIL,
                        next
                    );
                }
                if(!item) {
                    slogger.error(`缓存中未查到改题`, questionId);
                    return genErrorCallback(
                        ERROR_CODE.QUESTION_NOT_EXIST_IN_CACHE,
                        next
                    );
                }
                let questionInfo = {};
                try {
                    questionInfo = JSON.parse(item);
                } catch(e) {
                    if(e) {
                        slogger.error(`解析题目信息失败`, questionInfo);
                        return genErrorCallback(
                            ERROR_CODE.PARSE_QUESTION_INFO_FAIL,
                            next
                        );
                    }
                }
                next(false, {
                    questionId: questionInfo.questionId,
                    questionName: questionInfo.questionName,
                    describe: questionInfo.describe,
                    answers: questionInfo.answers
                });
            })
        }]
    }, function(err, results) {
        if(err) {
            return genErrorCallback(
                err,
                callback
            );
        }
        callback(false, results.getQuestionInfo);
    });
};

exports.submit = function(data, callback) {
    const {uuid, questionId, answer} = data;
    let isRight = false;
    async.auto({
        getQuestionInfo: function(next) {
            redisClient.hget(REDIS_KEY_QUESTION_INFO_HASH, questionId, function(err, item) {
                if(err) {
                    slogger.error(`通过问题 ID 获取题目详情失败`, err);
                    return genErrorCallback(
                        ERROR_CODE.GET_QUESTION_BY_ID_FAIL,
                        next
                    );
                }
                if(!item) {
                    slogger.error(`缓存中未查到改题`, questionId);
                    return genErrorCallback(
                        ERROR_CODE.QUESTION_NOT_EXIST_IN_CACHE,
                        next
                    );
                }
                let questionInfo = {};
                try {
                    questionInfo = JSON.parse(item);
                } catch(e) {
                    if(e) {
                        slogger.error(`解析题目信息失败`, questionInfo);
                        return genErrorCallback(
                            ERROR_CODE.PARSE_QUESTION_INFO_FAIL,
                            next
                        );
                    }
                }
                next(false, questionInfo);
            })
        },
        isRight: ['getQuestionInfo', function(results, next) {
            const {rightAnswer} = results.getQuestionInfo;
            // if (){
            //
            // }
            isRight = Number(rightAnswer) === Number(answer);
            const key = REDIS_KEY_USER_INFO_HASH + uuid;
            const incKey = isRight ? USER_RIGHT_TIMES: USER_WRONG_TIMES;
            redisClient.hincrby(key, incKey, 1, function(err) {
                if(err) {
                    slogger.error(`增加答题情况出错`, err);
                    return genErrorCallback(
                        ERROR_CODE.INC_USER_RIGHT_TIMES_FAIL,
                        next
                    );
                }
                next(false);
            })
        }]
    }, function(err, results) {
        if(err) {
            return genErrorCallback(
                err,
                callback
            );
        }
        callback(false, {
            isRight
        });
    });
};