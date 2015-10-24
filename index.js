'use strict';

var requireDir = require('require-dir'),
    extend = require("extend");

var CustomError = require("./lib/customError"),
    ApiResponse = require("./lib/apiResponse");

exports.CustomError = CustomError;
exports.ApiResponse = ApiResponse;

var defaults = {
    handlersDir: "/handlers",
    validateReqFunc: function (req) {
        return true;
    },
    dataType: "data_type",
    actionStr: "action_str",
    debug: false
};

exports.endPoint = function (options) {
    options = extend(true, defaults, options);
    var handlers = requireDir(options.handlersDir);

    return function (req, res, next) {
        var apiResponse = new ApiResponse(),
            dataType = options.dataType,
            actionStr = options.actionStr;

        var data = req.body || {};
        options.debug && console.log("Request data:", data, "\n");

        if (!options.validateReqFunc(req)) {
            apiResponse.addLog(new CustomError(400, "Invalid_data", CustomError.NOT_IN_THE_RIGTH_FORMAT, "The request is not in the right format"));
        } else if (handlers[data[dataType]] === undefined) {
            apiResponse.addLog(new CustomError(400, "Invalid_data", CustomError.MODEL_TYPE_NOT_EXIST, "Model is not exist"));
        } else if (handlers[data[dataType]][data[actionStr]] === undefined || !(handlers[data.data_type][data.action_str] instanceof Function)) {
            apiResponse.addLog(new CustomError(400, "Invalid_data", CustomError.ACTION_NOT_EXIST, "Action is not exist"));
        }
        apiResponse = apiResponse.updateAndGet("FAILED", "FORMAT");
        if (apiResponse.log_list.length === 1) {
            options.debug && console.log("Response data:", apiResponse, "\n");
            return res.send(apiResponse);
        }

        handlers[data[dataType]][data[actionStr]](req, res, function (err, apiResponse) {
            if (err) {
                options.debug && console.log("Error:", err, "\n");
                return next(err);
            }
            options.debug && console.log("Response data:", apiResponse, "\n");
            return res.send(apiResponse);
        });
    }
};