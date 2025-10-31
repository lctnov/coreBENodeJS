import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class EquipmentTypeModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadEquipmentType(req) {
        var response = {
            iStatus: false,
            iMessage: "",
        };
        var query = await this.cfsglobal
            .from("bs_equipments_type")
            .select("id", "equ_type", "equ_type_name")
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


    async saveEquipmentType(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.equ_type) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp mã loại thiết bị!';
                        return response;
                    }
                    if (!item.equ_type_name) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp tên loại thiết bị!';
                        return response;
                    }
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp tên người tạo!';
                        return response;
                    }
                    // ------- check exist gate code --------
                    let checkCode = await this.cfsglobal
                        .from("bs_equipments_type")
                        .select("rowguid")
                        .where("equ_type", item.equ_type)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Mã loại thiết bị đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        equ_type: item.equ_type,
                        equ_type_name: item.equ_type_name,
                        create_by: item.create_by,
                    };
                    try {
                        return await this.cfsglobal.from("bs_equipments_type")
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

                        return await this.cfsglobal.from("bs_equipments_type").where('id', id)
                            .update({
                                equ_type: item.equ_type || null,
                                equ_type_name: item.equ_type_name || null,
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

    async delEquipmentType(req) {
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
                await this.cfsglobal.from("bs_equipments_type")
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