var pureApi = require("../../index");
exports.retrieve = function (req, res, next) {

    next(null, new pureApi.ApiResponse("RETRIEVED", "person"));
};
