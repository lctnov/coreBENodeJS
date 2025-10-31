import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ConfigMinValueModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadConfigMinValue(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("config_min_value")
			.select("id", "cntrsztp", "unit_invoice", "min_value")
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

	async saveConfigMinValue(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return Promise.all(req.body.map(async (item) => {
			switch (item.status) {
				case 'insert':
					if (!item.cntrsztp) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp kích cỡ ISO!';
						return response;
					}
					if (!item.unit_invoice) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp đơn vị hóa đơn!';
						return response;
					}
					if (!item.min_value) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp giá trị tối thiểu!';
						return response;
					}
					if (!item.create_by) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
						return response;
					}
					let obj = {
						cntrsztp: item.cntrsztp || null,
						unit_invoice: item.unit_invoice || null,
						min_value: item.min_value || null,
						create_by: item.create_by
					};
					try {
						return await this.cfsglobal.from("config_min_value")
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

						return await this.cfsglobal.from("config_min_value").where('id', item.id)
							.update({
								cntrsztp: item.cntrsztp || null,
								unit_invoice: item.unit_invoice || null,
								min_value: item.min_value || null,
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

	async delConfigMinValue(req) {
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
				await this.cfsglobal.from("config_min_value")
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