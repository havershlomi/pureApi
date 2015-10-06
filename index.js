'use strict';

var requireDir = require('require-dir');

var CustomError = require("./lib/customError"),
    ErrorLogger = require("./lib/errorLogger"),
    ApiResponse = require("./lib/apiResponse");

//{ action_str    : "retrieve",  /* action verb */
//    data_type     : "person",    /* record data */
//    log_list      : [ /* application messages   */ ],
//    request_map   : { /* request parameters     */ },
//    trans_map     : { /* transaction meta-data  */ }
//}

function validateRequestObj(data) {
    return (data["action_str"] !== undefined && typeof data["action_str"] === "string")
        && (data["data_type"] !== undefined && typeof data["data_type"] === "string")
        && (data["log_list"] !== undefined && typeof data["log_list"] === "object")
        && (data["request_map"] !== undefined && typeof data["request_map"] === "object")
        && (data["trans_map"] !== undefined && typeof data["trans_map"] === "object");
}

exports.CustomError = CustomError;
exports.ErrorLogger = ErrorLogger;
exports.ApiResponse = ApiResponse;

exports.endPoint = function (handlersDir) {
    var handlers = requireDir(handlersDir);
    return function (req, res, next) {
        var errorLog = new ErrorLogger();

        var data = req.body;
        if (!validateRequestObj(data)) {
            errorLog.insert(new CustomError(400, "Invalid_data",CustomError.NOT_IN_THE_RIGTH_FORMAT, "The request is not in the right format"));
        } else if (handlers[data.data_type] === undefined) {
            errorLog.insert(new CustomError(400, "Invalid_data",CustomError.MODEL_TYPE_NOT_EXIST, "Model is not exist"));
        } else if (handlers[data.data_type][data.action_str] === undefined || !(handlers[data.data_type][data.action_str] instanceof Function)) {
            errorLog.insert(new CustomError(400, "Invalid_data",CustomError.ACTION_NOT_EXIST, "Action is not exist"));
        }
        if (errorLog.log_list.length === 1) return res.send(new ApiResponse("FAILED", "FORMAT", errorLog));

        handlers[data.data_type][data.action_str](data.request_map, data.trans_map, data.log_list, function (err, apiResponse) {
            if (err) next(err);
            return res.send(apiResponse);
        });
    }
};