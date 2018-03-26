const log4js = require('log4js');
const mongoose = require('mongoose');
const slogger = require('node-slogger');
const Redis = require('ioredis');
const configObj = require('../config.json');
const settings = require('./lib/settings').init(configObj);
exports.port = settings.loadNecessaryInt('port');

//保证配置文件中的debugfilename属性存在，且其所在目录在当前硬盘中存在

const errorFile = settings.loadNecessaryFile('errorLogFile', true);

 log4js.configure({
     appenders: [
         {type: 'console'},

         {type: 'file', filename: errorFile, maxLogSize: 1024000, backups: 10, category: 'error'}
     ],
     replaceConsole: true
 });

const errorLogger = exports.errorlogger = log4js.getLogger('error');
exports.accessLogger = log4js.getLogger('console');

slogger.init({
    errorLogger:errorLogger, disableCustomConsole : true
});


// let mongoConfig = settings.loadNecessaryObject('mongoConfig');
mongoose.Promise = global.Promise;
// mongoose.connect(mongoConfig.url, mongoConfig.option); // connect to database
mongoose.connect('mongodb://leo:5763365@localhost:27017/bran-storm',{auth:{authdb:"admin"}});
//保证配置文件中的redis属性存在
const redisConfig = settings.loadNecessaryObject('redisConfig');
const clusterRedis = redisConfig.cluster;
if (clusterRedis instanceof Array) {
    delete redisConfig.cluster;
    exports.redisClient = new Redis.Cluster(clusterRedis,redisConfig);
} else {
    exports.redisClient = new Redis(redisConfig);
}
