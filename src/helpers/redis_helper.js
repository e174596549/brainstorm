const async = require('async');
const slogger = require('node-slogger');
const {redisClient, REDIS_CACHE_KEYS} = require('../config');

exports.cleanCache = function() {
    redisClient.del(...REDIS_CACHE_KEYS, function(err) {
        if (err) {
            slogger.error('清除redis缓存数据失败', err, REDIS_CACHE_KEYS);
        }
    });
}

exports.setRedisExpire = function(key, expire) {
    redisClient.expire(key, expire, function(err) {
        if (err) {
            console.log(`设置${key}过期时间失败`, err);
        }
    });
};
