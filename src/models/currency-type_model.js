import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class CurrentTypeModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadCurrentType(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			Payload: []
		};

		var query = await this.cfsglobal
			.from("currency")
			.select("id", "currency_code", "currency_name")
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

	async loadCurrentTypeCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("currency")
			.select("currency_code")
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			response["iStatus"] = true;
			response["iPayload"] = checkCode;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không tìm thấy thông tin số remooc!";
		}
		return response;
	}

	async saveCurrentType(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		return Promise.all(req.body.map(async (item) => {
			switch (item.status) {
				case 'insert':
					if (!item.currency_code) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp loại tiền!';
						return response;
					}
					if (!item.currency_name) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp tên loại tiền!';
						return response;
					}
					if (!item.create_by) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
						return response;
					}
					// ------- check exist gate code --------
					let checkCode = await this.cfsglobal
						.from("currency")
						.select("rowguid")
						.where("currency_code", item.currency_code)
						.catch(err => console.log(err)) || [];

					if (checkCode && checkCode.length) {
						response['iStatus'] = false;
						response['iMessage'] = "Mã loại tiền đã tồn tại!";
						return response;
					}
					// -----------------------------------------------
					let obj = {
						currency_code: item.currency_code || null,
						currency_name: item.currency_name || null,
						create_by: item.create_by,
					};

					try {
						return await this.cfsglobal.from("currency")
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
						response['iMessage'] = 'Vui lòng cung cấp số id!';
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

						return await this.cfsglobal.from("currency").where('id', item.id)
							.update({
								currency_code: item.currency_code || null,
								currency_name: item.currency_name || null,
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

	async delCurrentType(req) {
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
				await this.cfsglobal.from("currency")
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