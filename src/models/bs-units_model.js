import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class UnitModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadUnit(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_unit")
            .select("id", "unit_code", "unit_name")
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

    async loadUnitCode(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_unit")
            .select("unit_code")
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

    async saveUnit(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.unit_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã đơn vị tính!';
                        return response;
                    }
                    if (!item.unit_name) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên đơn vị tính!';
                        return response;
                    }
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
                        return response;
                    }
                    // ------- check exist gate code --------
                    let checkCode = await this.cfsglobal
                        .from("bs_unit")
                        .select("rowguid")
                        .where("unit_code", item.unit_code)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Mã biểu cước đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        unit_code: (item.unit_code).length <= 3 ? item.unit_code.toUpperCase() : null,
                        unit_name: item.unit_name,
                        create_by: item.create_by,
                    };
                    if (!obj.unit_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Mã đơn vị phải nhỏ hơn 3 ký tự!';
                        return response;
                    }
                    try {
                        return await this.cfsglobal.from("bs_unit")
                            .insert(obj)
                            .returning('*')
                            .then(data => {
                                response['iStatus'] = true;
                                response['iPayload'] = data;
                                response['iMessage'] = "Lưu dữ liệu thành công!";
                            });
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
                    item.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
                    try {
                        delete item.stt;
                        delete item.id;
                        delete item.isChecked;
                        delete item.status;

                        return await this.cfsglobal.from("bs_unit").where('id', item.id)
                            .update({
                                unit_code: item.unit_code || null,
                                unit_name: item.unit_name || null,
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

    async delUnit(req) {
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
                await this.cfsglobal.from("bs_unit")
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