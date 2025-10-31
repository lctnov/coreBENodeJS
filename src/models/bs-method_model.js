import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class MethodModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadMethod(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_method")
            .select("id", "method_code", "method_name", "is_in_out", "class_code", "is_service")
            .catch(err => console.log(err)) || [];

        if (query && query.length) {
            response["iStatus"] = true;
            response["iPayload"] = query;
            response["iMessage"] = "Nạp dữ liệu thành công!";
        } else {
            response["iStatus"] = false;
            response["iMessage"] = "Không có dữ liệu!";
        }
        return response;
    }

    async loadMethodStatus(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_method")
            .select("id", "method_code", "method_name", "is_in_out", "class_code", "is_service")
            .catch(err => console.log(err)) || [];

        if (query && query.length) {
            let methodStatus = [], methodIsStatus = [];
            query.map(item => {
                item.is_in_out == 1 ? methodStatus.push(item) : methodIsStatus.push(item)
            });
            response["iStatus"] = true;
            response["iPayload"] = { methodStatus: methodStatus, methodIsStatus: methodIsStatus };
            response["iMessage"] = "Nạp dữ liệu thành công!";
        } else {
            response["iStatus"] = false;
            response["iMessage"] = "Không có dữ liệu!";
        }
        return response;
    }

    async loadMethodPlan(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        if (req.body.customer_code == '*') {
            var query = await this.cfsglobal
                .from("bs_method AS method")
                .select("method.id", "method.method_code", "method.method_name", "method.is_in_out", "method.class_code", "method.is_service", "cfigSrv.customer_code", "cfigSrv.attach_service_code")
                .leftJoin("config_attach_service AS cfigSrv", "cfigSrv.method_code", "method.method_code")
                .catch(err => console.log(err)) || [];
            if (query && query.length) {
                response["iStatus"] = true;
                response["iPayload"] = query;
                response["iMessage"] = "Load dữ liệu thành công!";
            } else {
                response["iStatus"] = false;
                response["iMessage"] = "Không có dữ liệu!";
            }
        } else {
            let arrMethod = [];
            let isCheck = await this.cfsglobal
                .from("config_attach_service")
                .select("rowguid")
                .where("customer_code", req.body.customer_code)
                .catch(err => console.log(err)) || [];

            if (isCheck && isCheck.length) {
                let data = await this.cfsglobal
                    .from("bs_method AS method")
                    .select("method.id", "method.method_code", "method.method_name", "method.is_in_out", "method.class_code", "method.is_service", "cfigSrv.customer_code", "cfigSrv.attach_service_code")
                    .leftJoin("config_attach_service AS cfigSrv", "cfigSrv.method_code", "method.method_code")
                    .catch(err => console.log(err)) || [];
                data?.filter(p => p.customer_code === req.body.customer_code ? arrMethod.push(item) : false);
                response["iStatus"] = true;
                response["iPayload"] = arrMethod;
                response["iMessage"] = "Load dữ liệu thành công!";
            } else {
                response["iStatus"] = false;
                response["iMessage"] = "Đối tượng thanh toán không tồn tại!";
            }
        }
        return response;
    }

    async loadMethodGet(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        if (!req.body.is_in_out && req.body.is_in_out == undefined) {
            response["iStatus"] = false;
            response["iMessage"] = "Vui lòng cung cấp lại cổng!";
            return response;
        }

        if (!req.body.class_code && req.body.class_code == undefined) {
            response["iStatus"] = false;
            response["iMessage"] = "Vui lòng cung cấp lại hướng!";
            return response;
        }
        let whereObj = {};
        req.body.is_in_out ? whereObj['is_in_out'] = req.body.is_in_out.toUpperCase() : '';
        whereObj['class_code'] = req.body.class_code;
        var query = await this.cfsglobal
            .from("bs_method")
            .select("id", "method_code", "method_name", "is_in_out", "class_code", "is_service")
            .where({ whereObj, 'is_service': false })
            .catch(err => console.log(err)) || [];

        if (query && query.length) {
            response["iStatus"] = true;
            response["iPayload"] = query;
            response["iMessage"] = "Truy vấn dữ liệu thành công!";
        } else {
            response["iStatus"] = false;
            response["iMessage"] = "Không có dữ liệu!";
        }
        return response;
    }

    async loadMethodGetSrv(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        if (!req.body.method_code) {
            response["iStatus"] = false;
            response["iMessage"] = "Vui lòng cung cấp mã phương án!";
            return response;
        }

        var dtCfigSrvMethod = await this.cfsglobal
            .from("bs_method AS method")
            .select("method.id", "method.method_code", "method.method_name", "method.is_in_out", "method.class_code", "method.is_service", "cfigSrv.attach_service_code", "cfigSrv.voyagekey", "cfigSrv.customer_code")
            .leftJoin("config_attach_service AS cfigSrv", "cfigSrv.method_code", "method.method_code")
            .where("meThod.method_code", req.body.method_code)
            .catch(err => console.log(err)) || [];

        let dtAchSrvCD = [];
        if (dtCfigSrvMethod && dtCfigSrvMethod.length) {
            dtAchSrvCD = dtCfigSrvMethod.map(item => item.ATTACH_SERVICE_CODE);
            var query = await this.cfsglobal
                .from("bs_method")
                .select("id", "method_code", "method_name", "is_in_out", "class_code", "is_service")
                .whereIn("method_code", dtAchSrvCD)
                .catch(err => console.log(err)) || [];

            if (query && query.length) {
                response["iStatus"] = true;
                response["iPayload"] = query;
                response["iMessage"] = "Truy vấn dữ liệu thành công!";
            } else {
                response["iStatus"] = false;
                response["iMessage"] = "Không có dữ liệu!";
            }
        } else {
            response["iStatus"] = false;
            response["iMessage"] = "Không tìm thấy dịch vụ đính kèm!";
        }
        return response;
    }

    async saveMethod(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.method_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã phương án!';
                        return response;
                    }
                    if (!item.method_name) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên phương án!';
                        return response;
                    }
                    if (!item.is_in_out) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại cổng!';
                        return response;
                    }
                    if (!item.class_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại hướng!';
                        return response;
                    }
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
                        return response;
                    }
                    // ------- check exist gate code --------
                    let checkCode = await this.cfsglobal
                        .from("bs_method")
                        .select("rowguid")
                        .where("method_code", item.method_code)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Mã phương án đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        method_code: item.method_code,
                        method_name: item.method_name,
                        is_in_out: item.is_in_out.toUpperCase() === 'VÀO' ? 'I' : 'O',
                        class_code: item.class_code.toUpperCase() === 'NHẬP' ? 1 : 2,
                        is_service: item.is_service,
                        create_by: item.create_by,
                    };

                    try {
                        if (obj.is_service >= 0 && obj.is_service <= 1) {
                            return await this.cfsglobal.from("bs_method")
                                .insert(obj)
                                .returning('*')
                                .then(data => {
                                    response['iStatus'] = true;
                                    response['iPayload'] = data;
                                    response['iMessage'] = "Lưu dữ liệu thành công!";
                                });
                        } else {
                            response['iStatus'] = false;
                            response['iMessage'] = "Dịch vụ đính kèm bạn cung cấp không đúng vui lòng xem lại!";
                        }
                    } catch (err) {
                        response['iStatus'] = false;
                        response['iPayload'] = err;
                        response['iMessage'] = "Không thể lưu mới dữ liệu!";
                    }
                    break;
                case 'update':
                    if (!item.id) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại số id!';
                        return response;
                    }
                    if (!item.update_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người cập nhật!';
                        return response;
                    }
                    if (!item.is_service) {
                        await this.cfsglobal.from("config_attach_service").where('attach_service_code', item.method_code).del();
                    }
                    item.is_in_out = item.is_in_out === 'Vào' ? 'I' : 'O';
                    item.class_code = item.class_code === 'Nhập' ? 1 : 2;
                    item.is_service = item.is_service;
                    item.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
                    try {
                        delete item.stt;
                        delete item.id;
                        delete item.isChecked;
                        delete item.status;

                        return await this.cfsglobal.from("bs_method").where('id', item.id)
                            .update({
                                method_code: item.method_code || null,
                                method_name: item.method_name || null,
                                is_in_out: item.is_in_out || null,
                                class_code: item.class_code || null,
                                is_service: item.is_service || null,
                                update_by: item.update_by,
                                update_date: item.update_date
                            })
                            .then(() => {
                                response['iStatus'] = true;
                                response['iPayload'].push(item);
                                response['iMessage'] = "Lưu dữ liệu thành công!";
                            });
                    } catch (err) {
                        response['iStatus'] = false;
                        response['iPayload'] = err
                        response['iMessage'] = "Không thể lưu mới dữ liệu!";
                    }
                    break;
                default:
                    return { iStatus: false, iPayload: item.status, iMessage: 'Không tìm thấy trạng thái' };
            }
        })).then(() => {
            return response;
        });
    }

    async delMethod(req) {
        var response = {
            iStatus: false,
            iMessage: "",
        };

        return Promise.all(req.body.map(async item => {
            if (!item.id) {
                response['iStatus'] = false;
                response['iMessage'] = "Vui lòng cung cấp id!";
                return response;
            }
            try {
                await this.cfsglobal.from("bs_method")
                    .where('id', item.id)
                    .del();
                response['iStatus'] = true;
                response['iMessage'] = "Xóa dữ liệu thành công!";
            } catch {
                response['iStatus'] = false;
                response['iMessage'] = "Xóa dữ liệu không thành công!";
            }
        })).then((value) => {
            return response;
        });
    }
}