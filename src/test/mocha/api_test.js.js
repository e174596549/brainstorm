const request = require('supertest');
const {expect} = require('chai');
const app = require('../../app');
const {
} = require('../../config');
//const {ERROR_CODE} = require('../../lib/code');

describe('question', function() {
    it('should add a question success', function(done) {
        const data = {
            questionName: '人口之最',
            describe: '世界上人口最多的国家是?',
            answers: '中国,美国,德国,日本',
            rightAnswer: 0
        };
        request(app)
            .post('/i/question/add')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
                expect(res.body).to.have.property('code').and.equal(0);

                done();
            });
    });
    // it('获取当前已启动策略', function(done) {
    //     const data = {
    //         app_id: app_id,
    //         timestamp: new Date().getTime(),
    //         client_type : 1
    //     };
    //     data.sign = doSign(data, backend_secret);
    //     // request('http://localhost:8101')
    //     request(app)
    //         .get('/i/api/version/started-strategy')
    //         .query(data)
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) {
    //                 return done(err);
    //             }
    //             console.log(res.body);
    //             if (res.body.data.length > 0) {
    //                 old_strategy_id = res.body.data[0].strategy_id;
    //             }
    //             expect(res.body).to.have.property('code').and.equal(0);
    //
    //             done();
    //         });
    // });
});
