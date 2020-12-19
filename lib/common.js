let common = {};

common.prepare_response = (code, data, msg, token) => {
    let template = {
        result: null,
        code: null,
        msg: null,
        token: null
    };
    if (code === 200) {
        template.data = data;
        template.result = "success";
        template.code = 200;
        template.token = token;
        return template;
    } else {
        template.msg = msg;
        template.result = "error";
        template.code = code;
        template.token = token;
        return template;
    }
}

module.exports = common;