import databaseInstance from '../config/database.js';
import moment from 'moment';
export default class ContractModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadContract(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_contract")
            .select('id', 'customer_code', 'contract_code', 'contract_name', 'from_date', 'to_date', 'note')
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

    async saveContract(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.customer_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã khách hàng!';
                        return response;
                    }
                    if (!item.contract_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã hợp đồng!';
                        return response;
                    }
                    if (!item.contract_name) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên hợp đồng!';
                        return response;
                    }
                    if (!item.from_date) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại ngày bắt đầu!';
                        return response;
                    }
                    if (!item.to_date) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại ngày hết hạn!';
                        return response;
                    }
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
                        return response;
                    }
                    // ------- check exist gate code --------
                    let checkCode = await this.cfsglobal
                        .from("bs_contract")
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
                        customer_code: item.customer_code,
                        contract_code: item.contract_code,
                        contract_name: item.contract_name,
                        from_date: moment(item.from_date, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss"),
                        to_date: moment(item.to_date, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss"),
                        note: item.note,
                        create_by: item.create_by,
                    };
                    try {
                        return await this.cfsglobal.from("bs_contract")
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

                        return await this.cfsglobal.from("bs_contract").where('id', item.id)
                            .update({
                                customer_code: item.customer_code || null,
                                contract_code: item.contract_code || null,
                                contract_name: item.contract_name || null,
                                from_date: item.from_date || null,
                                to_date: item.to_date || null,
                                note: item.note || null,
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

    async delContract(req) {
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
                await this.cfsglobal.from("bs_contract")
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