import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class WarehouseModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadWarehouse(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_warehouse")
            .select("id", "warehouse_code", "warehouse_name", "acreage")
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

    async saveWarehouse(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        return await Promise.all(req.body.map(async (item) => {
            let status = item.status ? item.status : undefined;
            let id = item.id ? item.id : null;
            let warehouse_code = item.warehouse_code ?? null;
            let acreage = item.acreage ?? null;
            switch (status) {
                case 'insert':
                    if (!warehouse_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Vui lòng nhập mã kho!";
                        return response;
                    }

                    let obj = {
                        warehouse_code: warehouse_code,
                        warehouse_name: item.warehouse_name ? item.warehouse_name : null,
                        acreage: acreage,
                        create_by: item.create_by ? item.create_by : null,
                    };
                    // ------- check exist warehouse --------
                    let checkCode = await this.cfsglobal
                        .from("bs_warehouse")
                        .select("rowguid")
                        .where("warehouse_code", warehouse_code)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Mã kho đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    try {
                        return await this.cfsglobal.from("bs_warehouse")
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
                    item.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
                    try {
                        delete item.stt;
                        delete item.id;
                        delete item.isChecked;
                        delete item.status;

                        return await this.cfsglobal.from("bs_warehouse").where('id', id)
                            .update({
                                warehouse_code: item.warehouse_code,
                                warehouse_name: item.warehouse_name,
                                acreage: item.acreage,
                                update_by: item.update_by,
                                update_date: item.update_date
                            })
                            .then(() => {
                                response['iStatus'] = true;
                                response['iPayload'].push(item);
                                response['iMessage'] = "Lưu dữ liệu thành công!";
                            });
                    } catch {
                        response['iStatus'] = false;
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

    async delWarehouse(req) {
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
                await this.cfsglobal.from("bs_warehouse")
                    .where('id', id)
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