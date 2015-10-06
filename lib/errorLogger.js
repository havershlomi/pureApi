'use strict';

function ErrorLogger(log_list) {
    this.log_list = log_list || [];
}
ErrorLogger.prototype.insert = function (error) {
    this.log_list.push(error);
};


module.exports = ErrorLogger;

