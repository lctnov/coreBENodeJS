import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class RomoocModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadRommoc(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            Payload: []
        };

        var query = await this.cfsglobal
            .from("bs_romooc")
            .select("id", "remooc_no", "remooc_weight", "remooc_weight_regis", "remooc_date_exp")
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

    async loadRommocCode(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        if (!req.body.remooc_no) {
            response['iStatus'] = false;
            response['iMessage'] = 'Vui lòng cung cấp số xe!';
            return response;
        }
        let query = await this.cfsglobal
            .from("bs_romooc")
            .select("id", "remooc_no", "remooc_weight", "remooc_weight_regis", "remooc_date_exp")
            .where("remooc_no", req.body.remooc_no)
            .catch(err => console.log(err)) || [];

        if (query && query.length) {
            response["iStatus"] = true;
            response["iPayload"] = query;
            response["iMessage"] = "Nạp dữ liệu thành công!";
        } else {
            response["iStatus"] = false;
            response["iMessage"] = "Không tìm thấy thông tin số remooc!";
        }
        return response;
    }

    async saveRommoc(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.remooc_no) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp số xe!';
                        return response;
                    }
                    if (!item.remooc_weight) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại trọng lượng!';
                        return response;
                    }
                    if (!item.remooc_weight_regis) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại trọng lượng đăng kiểm!';
                        return response;
                    }
                    if (!item.remooc_date_exp) {
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
                        .from("bs_romooc")
                        .select("rowguid")
                        .where("remooc_no", item.remooc_no)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['iStatus'] = false;
                        response['iMessage'] = "Số Romooc đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let obj = {
                        remooc_no: item.remooc_no,
                        remooc_weight: item.remooc_weight,
                        remooc_weight_regis: item.remooc_weight_regis,
                        remooc_date_exp: item.remooc_date_exp,
                        create_by: item.create_by,
                    };

                    try {
                        return await this.cfsglobal.from("bs_romooc")
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

                        return await this.cfsglobal.from("bs_romooc").where('id', item.id)
                            .update({
                                remooc_no: item.remooc_no || null,
                                remooc_weight: item.remooc_weight || null,
                                remooc_weight_regis: item.remooc_weight_regis || null,
                                remooc_date_exp: item.remooc_date_exp || null,
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

    async delRommoc(req) {
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
                await this.cfsglobal.from("bs_romooc")
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