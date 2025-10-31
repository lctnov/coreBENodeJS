import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ConfigAttachServicesModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadConfigAttachServices(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			Payload: []
		};
		var query = await this.cfsglobal
			.from("config_attach_service")
			.select("id", "voyagekey", "customer_code", "method_code", "attach_service_code")
			.where("customer_code", req.body.customer_code)
			.orderBy("create_date", "desc")
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

	async saveConfigAttachServices(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		return Promise.all(req.body.map(async (item) => {
			switch (item.status) {
				case 'insert':
					if (!item.create_by) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
						return response;
					}
					let obj = {
						voyagekey: item.voyagekey || null,
						customer_code: item.customer_code || null,
						method_code: item.method_code || null,
						attach_service_code: item.attach_service_code || null,
						create_by: item.create_by
					};

					try {
						return await this.cfsglobal.from("config_attach_service")
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
				case 'delete':
					if (!item.customer_code) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp đối tượng thanh toán!';
						return response;
					}
					if (!item.method_code) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã phương án!';
						return response;
					}
					if (!item.attach_service_code) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã dịch vụ!';
						return response;
					}
					try {
						await this.cfsglobal
							.from("config_attach_service")
							.where({ customer_code: item.customer_code, method_code: item.method_code, attach_service_code: item.attach_service_code })
							.del();
						response['iStatus'] = true;
						response['iMessage'] = "Xóa dữ liệu thành công!";
					} catch (err) {
						response['iStatus'] = false;
						response['iMessage'] = "Xóa dữ liệu không thành công!";
					}
					break;
				default:
					return { iStatus: false, iPayload: item.status, iMessage: 'Không tìm thấy trạng thái' };
			}
		})).then(() => {
			return response;
		});
	}
}