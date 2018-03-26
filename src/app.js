const express = require('express');
const path = require('path');
//const logger = require('morgan');
const log4js = require('log4js');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const {
    accessLogger,
    errorlogger,
    port
} = require('./config');
// const afterParserProxy = require('./filters/after_parser_proxy_filter');


require('./plugins/app_plugin');
const app = express();
app.enable('trust proxy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', port);


// uncomment after placing your favicon in /public
//app.use(logger('dev'));
app.use(log4js.connectLogger(accessLogger, {
    level: log4js.levels.INFO,
    format: ':remote-addr :response-time ms ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
})); //日志

// app.use(beforeParserFilter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found:' + req.path);
    err.status = 404;
    next(err);
});

// error handlers

app.use(function(err, req, res) {
    const status = err.status;
    if (status === 404) {
        return res.status(404).send(err.message || '未知异常');
    }
    res.status(status || 500);
    errorlogger.error('发现应用未捕获异常', err);
    res.send({
        msg: err.message || '未知异常',
        code: 0xffff
    });
});


module.exports = app;
