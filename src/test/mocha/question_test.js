const request = require('supertest');
const {expect} = require('chai');
const app = require('../../app');
const {} = require('../../config');
//const {ERROR_CODE} = require('../../lib/code');
let questionId = '';

describe('question', function() {
    it('should add a question success', function(done) {
        const data = {
            uuid: 'user-01',
            questionName: '人口之最' + Math.random(),
            describe: '世界上人口最多的国家是?' + Math.random(),
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
                if(err) {
                    return done(err);
                }
                console.log(res.body);
                questionId = res.body.data.questionId;
                expect(res.body).to.have.property('code').and.equal(0);

                done();
            });
    });
    it('获取未发布题目', function(done) {
        const data = {
            level: 1,
            type: 2
        };
        // request('http://localhost:8101')
        request(app)
            .get('/i/question/unpublished')
            .query(data)
            .expect(200)
            .end(function(err, res) {
                if(err) {
                    return done(err);
                }
                console.log(res.body.data.unpublishedQuestions);
                questionId = res.body.data.unpublishedQuestions[0].question_id;
                expect(res.body).to.have.property('code').and.equal(0);

                done();
            });
    });
for(let i = 0 ; i<3; i++) {
    it('给题目评分', function(done) {
        const data = {
            uuid: 'user-01',
            questionId,
            pass: true,
            type: 2,
            level: 1
        };
        request(app)
            .post('/i/question/evaluate')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if(err) {
                    return done(err);
                }
                console.log(res.body);
                expect(res.body).to.have.property('code').and.equal(0);

                done();
            });
    });
}

    it('获取题目', function(done) {
        const data = {
            // questionId,
            level: 1,
            type: 2
        };
        // request('http://localhost:8101')
        request(app)
            .get('/i/question/get')
            .query(data)
            .expect(200)
            .end(function(err, res) {
                if(err) {
                    return done(err);
                }
                console.log(res.body);
                expect(res.body).to.have.property('code').and.equal(0);

                done();
            });
    });
    for(let i = 0; i < 10; i++) {
        it('should submit a question success', function(done) {
            const data = {
                uuid: 'user-0' + i,
                questionId,
                answer: Math.random() > 0.7 ? 0 : 1
            };
            request(app)
                .post('/i/question/submit')
                .send(data)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        return done(err);
                    }
                    console.log(res.body);
                    expect(res.body).to.have.property('code').and.equal(0);

                    done();
                });
        });
    }
});
