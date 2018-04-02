const request = require('supertest');
const {expect} = require('chai');
const app = require('../../app');
const {
} = require('../../config');
//const {ERROR_CODE} = require('../../lib/code');
let questionId = '';

describe('question', function() {
    it.only('should update a user info', function(done) {
        const data = {
            uuid:'user-01',
            avatarUrl: 'http://user-01avatarUrl',
            nickName: '王小二'+ Math.random()
        };
        request(app)
            .post('/i/user/update-info')
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
    // it.only('获取题目', function(done) {
    //     const data = {
    //         questionId,
    //         level: 1,
    //         type: 2
    //     };
    //     // request('http://localhost:8101')
    //     request(app)
    //         .get('/i/question/get')
    //         .query(data)
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) {
    //                 return done(err);
    //             }
    //             console.log(res.body);
    //             expect(res.body).to.have.property('code').and.equal(0);
    //
    //             done();
    //         });
    // });
    //
    // it.only('should submit a question success', function(done) {
    //     const data = {
    //         uuid:'user-01',
    //         questionId,
    //         answer: 0
    //     };
    //     request(app)
    //         .post('/i/question/submit')
    //         .send(data)
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) {
    //                 return done(err);
    //             }
    //             console.log(res.body);
    //             expect(res.body).to.have.property('code').and.equal(0);
    //
    //             done();
    //         });
    // });
});
