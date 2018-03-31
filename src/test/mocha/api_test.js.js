const request = require('supertest');
const {expect} = require('chai');
const app = require('../../app');
const {
} = require('../../config');
//const {ERROR_CODE} = require('../../lib/code');

describe('question', function() {
    it.only('should add a question success', function(done) {
        const data = {
            uuid:'user-01',
            questionName: '人口之最' + Math.random(),
            describe: '世界上人口最多的国家是?'+ Math.random(),
            answers: '中国,美国,德国,日本',
            rightAnswer: 0,
            level: 1,
            type: 2
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
    it.only('获取题目', function(done) {
        const data = {
            questionName:'5abf81975946bdba1ff435f6',
            level: 1,
            type: 2
        };
        // request('http://localhost:8101')
        request(app)
            .get('/i/question/get')
            .query(data)
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
});
