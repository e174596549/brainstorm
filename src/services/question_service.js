const async = require('async');
const slogger = require('node-slogger');
const {
} = require('../config');
const {QuestionModel} = require('./index');
const {ERROR_CODE,genErrorCallback} = require('../lib/code');


exports.add = function(data, callback) {
    async.auto({
        save_data: function(next) {
            new QuestionModel(data).save(function(err, item) {
                if (err) {
                    slogger.error(`保存问题信息出错: `, err);
                    return genErrorCallback(
                        ERROR_CODE.SAVE_QUESTION_DATA_FAIL,
                        next
                    );
                }
                next(false, item._id);
            })
        }
    }, function(err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
        if (err) {
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
