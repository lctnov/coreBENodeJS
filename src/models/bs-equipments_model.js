import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class EquipmentModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadEquipment(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_equipments")
            .select("id", "equ_type", "equ_code", "equ_code_name", "warehouse_code", "block")
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


    async loadEquipmentItem(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        if (!req.body.equ_type) {
            response['iStatus'] = false;
            response['iMessage'] = 'Không có loại thiết bị!';
            return response;
        };
        var query = await this.cfsglobal
            .from("bs_equipments AS equip")
            .select("equip.id", "equip.equ_type", "equip.equ_code", "equip.equ_code_name", "equip.warehouse_code", "equip.block", "equipType.equ_type_name")
            .leftJoin("bs_equipments_type AS equipType", "equip.equ_type", "equipType.equ_type")
            .where({ 'equip.warehouse_code': req.body.warehouse_code, 'equip.equ_type': req.body.equ_type })
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

    async saveEquipment(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        return await Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.equ_type) {
                        response['iStatus'] = false;
                        response["iMessage"] = "Vui lòng cung cấp mã loại thiết bị!";
                        return response;
                    };
                    if (!item.equ_code) {
                        response['iStatus'] = false;
                        response["iMessage"] = "Vui lòng cung cấp lại mã thiết bị!";
                        return response;
                    };
                    if (!item.equ_code_name) {
                        response['iStatus'] = false;
                        response["iMessage"] = "Vui lòng cung cấp lại tên thiết bị!";
                        return response;
                    };
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response["iMessage"] = "Vui lòng cung cấp lại tên người tạo!";
                        return response;
                    };
                    // ------- check exist block --------
                    let checkCode = await this.cfsglobal
                        .from("bs_equipments")
                        .select("rowguid")
                        .where("equ_code", item.equ_code)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Mã thiết bị đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        equ_type: item.equ_type,
                        equ_code: item.equ_code,
                        warehouse_code: item.warehouse_code,
                        block: item.block,
                        equ_code_name: item.equ_code_name,
                        create_by: item.create_by,
                    };
                    try {
                        return await this.cfsglobal.from("bs_equipments")
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
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!'
                        return response;
                    }
                    item.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
                    try {
                        delete item.stt;
                        delete item.id;
                        delete item.isChecked;
                        delete item.status;

                        return await this.cfsglobal.from("bs_equipments").where('id', item.id)
                            .update({
                                equ_type: item.equ_type || null,
                                equ_code: item.equ_code || null,
                                equ_code_name: item.equ_code_name || null,
                                warehouse_code: item.warehouse_code || null,
                                block: item.block || null,
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
        })).then(returnValue => {
            return response;
        });
    }

    async delEquipment(req) {
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
                await this.cfsglobal.from("bs_equipments")
                    .where('id', item.id)
                    .del();
                response['iStatus'] = true;
                response['iMessage'] = "Xóa dữ liệu thành công!";
                return response;
            } catch {
                response['iStatus'] = false;
                response['iMessage'] = "Xóa dữ liệu không thành công!";
                return response;
            }
        })).then((value) => {
            return response;
        });
    }
}