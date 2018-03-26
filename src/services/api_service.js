const async = require('async');
const slogger = require('node-slogger');
const {
    redisClient,
    CLIENT_TYPE: {
        STUDENT,
        TEACHER
    }
} = require('../config');
const {VersionModel,} = require('./index');
const {ERROR_CODE,genErrorCallback} = require('../lib/code');
const REDIS_KEY_CACHED_VERSION = 'zylive:version_cache_set:';

exports.strategyStart = function(data, callback) {
    const {strategy_id, client_type} = data;
    const key = REDIS_KEY_CACHED_VERSION + data.app_id + ':' + client_type;
    VersionModel.findOne({
        strategy_id,
    }, '_id', function(err, item) {
        if (err) {
            slogger.error('查询版本更新信息失败', err);
            return genErrorCallback(
                ERROR_CODE.QUERY_VERSION_NOTIFY_FAIL,
                callback
            );
        }
        if (item) {
            return genErrorCallback(
                ERROR_CODE.STRATEGY_ID_EXIST,
                callback
            );
        } else {
            async.waterfall([
                function(next) {
                    VersionModel.update({client_type}, {
                        status: false
                    }, {
                        multi: true
                    }, function(err) {
                        if (err) {
                            return genErrorCallback(
                                ERROR_CODE.UPDATE_VERSION_STATUS_ERR,
                                next
                            );
                        }
                    });
                    next(false);
                },
                function(next) {
                    data.status = true;
                    new VersionModel(data).save(function(err) {
                        if (err) {
                            slogger.error('保存版本更新信息失败', err);
                            return genErrorCallback(
                                ERROR_CODE.SAVE_VERSION_NOTIFY_FAIL,
                                next
                            );
                        }
                        next(false);
                    });
                },
                function(next) {
                    redisClient.set(key, JSON.stringify({
                        version_number: data.version_number,
                        version_name: data.version_name,
                        force_update_version: data.force_update_version,
                        description: data.description,
                        size: data.size,
                        strategy_id,
                        md5: data.md5,
                        url: data.url,
                        client_type
                    }), function(err) {
                        if (err) {
                            slogger.error('缓存版本更新信息失败', err);
                            return genErrorCallback(
                                ERROR_CODE.CACHE_VERSION_NOTIFY_FAIL,
                                next
                            );
                        }
                        next(false);
                    });
                }
            ], callback);
        }
    })
};

exports.strategyRestart = function(data, callback) {
    const {strategy_id} = data;
    VersionModel.findOne({
        strategy_id,
    }, 'version_number version_name force_update_version description size strategy_id url md5 client_type -_id', function(err, item) {
        if (err) {
            slogger.error('查询版本更新信息失败', err);
            return genErrorCallback(
                ERROR_CODE.QUERY_VERSION_NOTIFY_FAIL,
                callback
            );
        }
        if (item) {
            const client_type = item.client_type;
            async.waterfall([
                function(next) {
                    VersionModel.update({client_type}, {
                        status: false
                    }, {
                        multi: true
                    }, function(err) {
                        if (err) {
                            return genErrorCallback(
                                ERROR_CODE.UPDATE_VERSION_STATUS_ERR,
                                next
                            );
                        }
                        next(false);
                    })
                },
                function(next) {
                    VersionModel.update({strategy_id}, {
                        status: true
                    }, function(err) {
                        if (err) {
                            return genErrorCallback(
                                ERROR_CODE.SET_VERSION_STATUS_ERR,
                                next
                            );
                        }
                        next(false);
                    })
                },
                function(next) {
                    const key = REDIS_KEY_CACHED_VERSION + data.app_id + ':' + client_type;
                    redisClient.set(key, JSON.stringify(item), function(err) {
                        if (err) {
                            return genErrorCallback(
                                ERROR_CODE.SET_VERSION_STATUS_CACHE_FAIL,
                                next
                            );
                        }
                        next(false);
                    });
                }
            ], callback)
        } else {
            callback(ERROR_CODE.OLD_STRATEGY_ID_NOT_EXIT);
        }
    })
};

exports.strategyStop = function(data, callback) {
    const {strategy_id} = data;
    async.waterfall([
        function(next) {
            VersionModel.findOne({
                strategy_id,
            }, '-_id client_type', function(err, item) {
                if (err) {
                    slogger.error('查询版本更新信息失败', err);
                    return genErrorCallback(
                        ERROR_CODE.QUERY_VERSION_NOTIFY_FAIL,
                        next
                    );
                }
                if (!item) {
                    return genErrorCallback(
                        ERROR_CODE.STRATEGY_ID_NOT_EXIT_IN_DB,
                        next
                    );
                }
                const key = REDIS_KEY_CACHED_VERSION + data.app_id + ':' + item.client_type;
                next(false, key);
            })
        },
        function(key, next) {
            VersionModel.update({strategy_id}, {status:false}, function(err) {
                if (err) {
                    return genErrorCallback(
                        ERROR_CODE.SET_VERSION_STATUS_TO_FALSE_ERR,
                        next
                    );
                }
                next(false, key);
            })
        },
        function(key, next) {
            redisClient.del(key, function(err) {
                if (err) {
                    slogger.error('删除缓存版本信息失败', err, key);
                    return genErrorCallback(
                        ERROR_CODE.DEL_VERSION_CHACHE_FAIL,
                        next
                    );
                }
                next(false);
            });
        }
    ], callback)
};

exports.statistics = function(data, callback) {
    VersionModel.findOne({
        strategy_id: data.strategy_id
    }, 'statistics -_id', function(err, item) {
        if (err) {
            slogger.error('查询版本更新统计数据失败', err);
            return genErrorCallback(
                ERROR_CODE.QUERY_VERSION_STATISTICS_FAIL,
                callback
            );
        }
        if (!item) {
            return genErrorCallback(
                ERROR_CODE.VERSION_STATISTICS_NOT_EXIST,
                callback
            );
        }
        callback(false, item.statistics);
    })

};

exports.startedStrategy = function(data, callback) {
    const {client_type} = data;
    const todoArr = [];
    if (client_type) {
        todoArr.push(client_type);
    } else {
        todoArr.push(STUDENT, TEACHER);
    }
    const resData = [];
    async.each(todoArr, function(type, next) {
        VersionModel.findOne({client_type:type, status:true}, '-_id -__v', function(err, item) {
            if (err) {
                return next(ERROR_CODE.QUERY_VERSION_NOTIFY_FAIL);
            }
            if (item) {
                resData.push(item);
            }
            next(null);
        })
    },function(err){
        if (err) {
            genErrorCallback(
                err,
                callback
            );
        } else {
            callback(false, resData);
        }
    });
};
