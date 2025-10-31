import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class TruckModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadTruck(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("bs_truck")
            .select("id", "truck_no", "weight_regis", "weight_regis_allow", "truck_date_exp")
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

    async loadTruckCode(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        if (!req.body.truck_no) {
            response['iStatus'] = false;
            response['iMessage'] = 'Vui lòng cung cấp số xe!';
            return response;
        }
        // ------- check exist gate code --------
        let checkCode = await this.cfsglobal
            .from("bs_truck")
            .select("id", "truck_no", "weight_regis", "weight_regis_allow", "truck_date_exp")
            .where("truck_no", req.body.truck_no)
            .catch(err => console.log(err)) || [];

        if (checkCode && checkCode.length) {
            let isSuccessOut = checkCode.map(item => item.is_success_out);
            if (isSuccessOut[0] == false) {
                response['iStatus'] = false;
                response['iMessage'] = `Số xe ${req.body.truck_no} chưa ra cổng!`;
                return response;
            }
        }
        // -----------------------------------------------
        if (checkCode && checkCode.length) {
            response["iStatus"] = true;
            response["iPayload"] = checkCode;
            response["iMessage"] = "Nạp dữ liệu thành công!";
        } else {
            response["iStatus"] = false;
            response["iMessage"] = "Không tìm thấy số xe!";
        }
        return response;
    }

    async saveTruck(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.truck_no) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp số xe!';
                        return response;
                    }
                    if (!item.weight_regis_allow) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại trọng lượng!';
                        return response;
                    }
                    if (!item.weight_regis) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại trọng lượng đăng kiểm!';
                        return response;
                    }
                    if (!item.truck_date_exp) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại hạn đăng kiểm đầu kéo!';
                        return response;
                    }
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
                        return response;
                    }
                    // ------- check exist gate code --------
                    let checkCode = await this.cfsglobal
                        .from("bs_truck")
                        .select("rowguid")
                        .where("truck_no", item.truck_no)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Số xe đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        truck_no: item.truck_no,
                        weight_regis_allow: item.weight_regis_allow,
                        weight_regis: item.weight_regis,
                        truck_date_exp: item.truck_date_exp,
                        create_by: item.create_by,
                    };

                    try {
                        return await this.cfsglobal.from("bs_truck")
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

                        return await this.cfsglobal.from("BS_ROMOOC").where('id', item.id)
                            .update({
                                truck_no: item.truck_no || null,
                                weight_regis: item.weight_regis || null,
                                weight_regis_allow: item.weight_regis_allow || null,
                                truck_date_exp: item.truck_date_exp || null,
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

    async delTruck(req) {
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
                await this.cfsglobal.from("bs_truck")
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