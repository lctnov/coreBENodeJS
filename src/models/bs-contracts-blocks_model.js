import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ContractblockModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadContractblock(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_contract_block")
            .select('id', 'contract_code', 'warehouse_code', 'block', 'acreage')
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

    async saveContractblock(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.contract_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã hợp đồng!';
                        return response;
                    }
                    if (!item.warehouse_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã kho!';
                        return response;
                    }
                    if (!item.block) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại block!';
                        return response;
                    }
                    if (!item.acreage) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại diện tích kho!';
                        return response;
                    }
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
                        return response;
                    }
                    // ------- check exist gate code --------
                    let checkCode = await this.cfsglobal
                        .from("bs_contract_block")
                        .select("rowguid")
                        .where("contract_code", item.contract_code)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Mã hợp đồng thuê đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        contract_code: item.contract_code,
                        warehouse_code: item.warehouse_code,
                        block: item.block,
                        acreage: item.acreage ?? null,
                        create_by: item.create_by,
                    };
                    if (obj.acreage) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Diện tích kho > 0!';
                        return response;
                    }
                    try {
                        return await this.cfsglobal.from("bs_contract_block")
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
                        delete item.STT;
                        delete item.id;
                        delete item.isChecked;
                        delete item.status;

                        return await this.cfsglobal.from("bs_contract_block").where('id', item.id)
                            .update({
                                contract_code: item.contract_code || null,
                                warehouse_code: item.warehouse_code || null,
                                block: item.block || null,
                                acreage: item.acreage || null,
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

    async delContractblock(req) {
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
                await this.cfsglobal.from("bs_contract_block")
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