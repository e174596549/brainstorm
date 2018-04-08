const request = require('supertest');
const {expect} = require('chai');
const app = require('../../app');
const {} = require('../../config');
//const {ERROR_CODE} = require('../../lib/code');
let questionId = '';

describe('user', function() {
    //for(let i = 0; i < 10; i++) {
    //     it('should update a user info success', function(done) {
    //         const data = {
    //             js_code: '01147by90LipPv1Fj8z90vbUx9047byq',
    //             // avatarUrl: 'http://user-01avatarUrl',
    //             // nickName: '王小' + i
    //         };
    //         request(app)
    //             .post('/i/user/update-info')
    //             .send(data)
    //             .expect(200)
    //             .end(function(err, res) {
    //                 if(err) {
    //                     return done(err);
    //                 }
    //                 console.log(res.body);
    //                 expect(res.body).to.have.property('code').and.equal(0);
    //
    //                 done();
    //             });
    //     });
    //}
    it('获取排行榜', function(done) {
        const data = {
            uuid:'user-020',
            page_num:1,
            page_size:3
        };
        // request('http://localhost:8101')
        request(app)
            .get('/i/rank/get')
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

    it('获取用户详情', function(done) {
        const data = {
            uuid:'user-02'
        };
        // request('http://localhost:8101')
        request(app)
            .get('/i/user/info')
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
