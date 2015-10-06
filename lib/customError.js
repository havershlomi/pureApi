'use strict';

function CustomError(code_key, code_str, log_id, user_msg, level_int, level_str) {
    this.code_key = code_key;
    this.code_str = code_str;
    this.level_int = level_int || 0;
    this.level_str = level_str || "Error";
    this.log_id = log_id;
    this.user_msg = user_msg;
}

CustomError.NOT_IN_THE_RIGTH_FORMAT = 1000;
CustomError.MODEL_TYPE_NOT_EXIST = 1001;
CustomError.ACTION_NOT_EXIST = 1002;

module.exports = CustomError;
