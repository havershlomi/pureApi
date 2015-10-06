'use strict';

function ApiResponse(action_str, data_type, log_list, response_map, trans_map) {
    this.action_str = action_str;
    this.data_type = data_type;
    this.log_list = log_list || {};
    this.response_map = response_map || {};
    this.trans_map = trans_map || {};
};

module.exports = ApiResponse;