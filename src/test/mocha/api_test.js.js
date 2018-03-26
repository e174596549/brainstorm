const request = require('supertest');
const {expect} = require('chai');
const app = require('../../app');
const {
    app: {
        backend_secret ,
        app_id
    }
} = require('../../config');
const {doSign} = require('../../helpers/auth_helper');
//const {ERROR_CODE} = require('../../lib/code');
let new_strategy_id = `strategy:${new Date().getTime()}`;
let old_strategy_id = '';

describe('api信息', function() {
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
