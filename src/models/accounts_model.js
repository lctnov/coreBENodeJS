import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class AccountModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadAccount(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("accounts")
			.select("id", "acc_cd", "acc_no", "acc_name", "acc_type")
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


	async saveAccount(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return await Promise.all(req.body.map(async (item) => {
			switch (item.status) {
				case 'insert':
					if (!item.acc_cd) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã hình thức!'
						return response;
					}
					if (!item.acc_no) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp tên hình thức!'
						return response;
					}
					if (!item.acc_name) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp diễn giải!'
						return response;
					}
					if (!item.acc_type) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp loại hình thức!'
						return response;
					}
					if (!item.create_by) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp tên người tạo!'
						return this.response;
					}
					let obj = {
						acc_cd: item.acc_cd || null,
						acc_no: item.acc_no || null,
						acc_name: item.acc_name || null,
						acc_type: item.acc_type || null,
						create_by: item.create_by,
					}
					try {
						return await this.cfsglobal.from("accounts")
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
					item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
					try {
						delete item.stt;
						delete item.id;
						delete item.isChecked;
						delete item.status;
						return await this.cfsglobal.from("accounts").where('id', item.id)
							.update({
								acc_cd: item.acc_cd || null,
								acc_no: item.acc_no || null,
								acc_name: item.acc_name || null,
								acc_type: item.acc_type || null,
								update_by: item.update_by,
								update_date: item.UPDATE_DATE,
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

	async delAccount(req) {
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
				await this.cfsglobal.from("accounts")
					.where("id", item.id)
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