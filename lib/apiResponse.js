'use strict';

var ApiResponse = function (action_str, data_type, log_list, response_map, trans_map) {
    this.action_str = action_str;
    this.data_type = data_type;
    this.log_list = log_list || [];
    this.response_map = response_map || {};
    this.trans_map = trans_map || {};
};

ApiResponse.prototype.addLog = function (logEvent) {
    this.log_list.push(logEvent);
};
ApiResponse.prototype.hasEventsInLog = function () {
    return this.log_list !== undefined && this.log_list.length > 0;
};

ApiResponse.prototype.updateAndGet = function (action_str, data_type, log_list, response_map, trans_map) {
    this.action_str = action_str || this.action_str;
    this.data_type = data_type || this.data_type;
    this.log_list = log_list || this.log_list;
    this.response_map = response_map || this.response_map;
    this.trans_map = trans_map || this.trans_map;
    return this;
};


module.exports = ApiResponse;

