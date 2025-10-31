import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class CustomerModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadCustomer(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_customer")
            .select('id', 'customer_code', 'customer_name', 'customer_type_code', 'acc_type', 'address', 'tax_code', 'email', 'is_active')
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

    async loadCustomerCode(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_customer")
            .select('id', 'customer_code', 'customer_name')
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

    async saveCustomer(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.customer_type_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã loại khách hàng!';
                        return response;
                    }

                    if (!item.customer_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã khách hàng!';
                        return response;
                    }

                    if (!item.customer_name) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên khách hàng!';
                        return response;
                    }

                    if (!item.acc_type) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại loại thanh toán!';
                        return response;
                    }

                    if (!item.tax_code) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại mã số thuế!';
                        return response;
                    }

                    if (!(item.is_active === true || item.is_active === false)) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại trạng thái!';
                        return response;
                    }

                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
                        return response;
                    }
                    // ------- check exist gate code --------
                    let checkCode = await this.cfsglobal
                        .from("bs_customer")
                        .select("rowguid")
                        .where("customer_code", item.customer_code)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Mã khách hàng đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        customer_type_code: item.customer_type_code,
                        customer_code: item.customer_code,
                        customer_name: item.customer_name,
                        acc_type: item.acc_type.toUpperCase(),
                        address: item.address,
                        tax_code: item.tax_code,
                        email: item.email,
                        is_active: item.is_active === true ? 1 : 0,
                        create_by: item.create_by,
                    };
                    try {
                        return await this.cfsglobal.from("bs_customer")
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

                        return await this.cfsglobal.from("BS_CUSTOMER").where('id', item.id)
                            .update({
                                customer_type_code: item.customer_type_code || null,
                                customer_code: item.customer_code || null,
                                customer_name: item.customer_name || null,
                                acc_type: item.acc_type || null,
                                address: item.address || null,
                                tax_code: item.tax_code || null,
                                email: item.email || null,
                                is_active: item.is_active || null,
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

    async delCustomer(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async item => {
            if (!item.id) {
                response['iStatus'] = false;
                response['iMessage'] = "Vui lòng cung cấp id!";
                return response;
            }
            try {
                await this.cfsglobal.from("BS_CUSTOMER_TYPE")
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