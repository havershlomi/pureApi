'use strict';

var requireDir = require('require-dir'),
    extend = require("extend");

var CustomError = require("./lib/customError"),
    ErrorLogger = require("./lib/errorLogger"),
    ApiResponse = require("./lib/apiResponse");

exports.CustomError = CustomError;
exports.ErrorLogger = ErrorLogger;
exports.ApiResponse = ApiResponse;

var defaults = {
    handlersDir: "/handlers",
    validateFunc: function (data) {
        return true;
    },
    dataType: "data_type",
    actionStr: "action_str"
};

exports.endPoint = function (options) {
    options = extend(true, defaults, options);
    var handlers = requireDir(options.handlersDir);

    return function (req, res, next) {
        var errorLog = new ErrorLogger(),
            dataType = options.dataType,
            actionStr = options.actionStr;

        var data = req.body || {};
        if (!options.validateFunc(data)) {
            errorLog.insert(new CustomError(400, "Invalid_data", CustomError.NOT_IN_THE_RIGTH_FORMAT, "The request is not in the right format"));
        } else if (handlers[data[dataType]] === undefined) {
            errorLog.insert(new CustomError(400, "Invalid_data", CustomError.MODEL_TYPE_NOT_EXIST, "Model is not exist"));
        } else if (handlers[data[dataType]][data[actionStr]] === undefined || !(handlers[data.data_type][data.action_str] instanceof Function)) {
            errorLog.insert(new CustomError(400, "Invalid_data", CustomError.ACTION_NOT_EXIST, "Action is not exist"));
        }
        if (errorLog.log_list.length === 1) return res.send(new ApiResponse("FAILED", "FORMAT", errorLog.log_list));

        handlers[data[dataType]][data[actionStr]](req, res, function (err, apiResponse) {
            if (err) next(err);
            return res.send(apiResponse);
        });
    }
};