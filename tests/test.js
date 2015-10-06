var request = require('request');
var expect = require("chai").expect;
var CustomError = require("../index").CustomError;

describe("get person", function () {
    it('should get an data_type error', function (done) {

        request.post({url: "http://localhost:1337/test",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    action_str: "retrieve",
                    data_type: "game",
                    log_list: [ ],
                    request_map: { },
                    trans_map: { }
                })
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.log_list.length).to.equal(1);
                expect(body.log_list[0].log_id).to.equal(CustomError.MODEL_TYPE_NOT_EXIST);
                done();
            });
    });
    it('should get an action_str error', function (done) {

        request.post({url: "http://localhost:1337/test",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    action_str: "delete",
                    data_type: "person",
                    log_list: [ ],
                    request_map: { },
                    trans_map: { }
                })
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.log_list.length).to.equal(1);
                expect(body.log_list[0].log_id).to.equal(CustomError.ACTION_NOT_EXIST);
                done();
            });
    });
    it('should get a RETRIEVED status', function (done) {

        request.post({url: "http://localhost:1337/test",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    action_str: "retrieve",
                    data_type: "person",
                    log_list: [ ],
                    request_map: { },
                    trans_map: { }
                })
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.log_list.length).to.equal(0);
                expect(body.action_str).to.equal("RETRIEVED");
                done();
            });
    });
});