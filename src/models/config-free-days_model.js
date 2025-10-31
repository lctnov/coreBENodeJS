import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ConfigFreeDaysModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadConfigFreeDays(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.name) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp lại mẫu!';
			return response;
		}
		var query = await this.cfsglobal
			.from("config_free_days AS configFreeDay")
			.select("configFreeDay.id", "configFreeDay.name", "configFreeDay.customer_code", "configFreeDay.item_type_code", "configFreeDay.apply_date", "configFreeDay.expire_date", "configFreeDay.class_code", "configFreeDay.start_time", "configFreeDay.free_days", "configFreeDay.acc_type", "bsCustomer.customer_name")
			.leftJoin("bs_customer AS bsCustomer", "bsCustomer.customer_code", "configFreeDay.customer_code")
			.where("name", req.body.name)
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			query = query.map(item => {
				return {
					...item,
					customer_name: item.customer_name || '*'
				}
			});
			response["iStatus"] = true;
			response["iPayload"] = query;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async loadConfigFreeDaysTime(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("dt_package_stock")
			.select("time_in")
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			response["iStatus"] = true;
			response["iPayload"] = query;
			response["iMessage"] = "Truy vấn thời gian nhập kho thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async loadConfigFreeDaysCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("config_free_days")
			.select("name")
			.groupBy("name")
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			response["iStatus"] = true;
			response["iPayload"] = query;
			response["iMessage"] = "Truy vấn mẫu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async saveConfigFreeDays(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return Promise.all(req.body.map(async (item) => {
			if (!item.customer_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã khách hàng!';
				return response;
			}
			if (!item.item_type_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp loại hàng hoá!';
				return response;
			}
			if (!item.apply_date) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp thời gian áp dụng!';
				return response;
			}
			if (!item.expire_date) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp thời gian hết hạn!';
				return response;
			}
			if (!item.class_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp hướng!';
				return response;
			}
			if (!item.start_time) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp thời gian miễn lưu!';
				return response;
			}
			if (!item.free_days) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số ngày miễn lưu!';
				return response;
			}
			if (!item.acc_type) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp loại thanh toán!';
				return response;
			}
			let obj = {
				customer_code: item.customer_code || null,
				item_type_code: item.item_type_code || null,
				apply_date: item.apply_date || null,
				expire_date: item.expire_date || null,
				class_code: item.class_code || null,
				start_time: item.start_time || null,
				free_days: item.free_days || null,
				acc_type: item.acc_type || null,
				name: `${item.customer_code}-${moment(item.apply_date).format('DD/MM/YYYY')}-${moment(item.expire_date).format('DD/MM/YYYY')}`,
			};
			// ------- check exist gate code --------
			let checkCode = await this.cfsglobal
				.from("config_free_days")
				.select("ROWGUid")
				.where("name", obj.name)
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				try {
					await this.cfsglobal
						.from("config_free_days")
						.select("id", "name", "customer_code", "item_type_code", "apply_date", "expire_date", "class_code", "start_time", "free_days", "acc_type")
						.where({ customer_code: obj.customer_code, class_code: obj.class_code, item_type_code: obj.item_type_code })
						.then(async data => {
							if (data && data.length) {
								return Promise.all(
									await data.map(async item => {
										obj.acc_type = item.acc_type;
										obj.update_by = item.update_by;
										obj.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
										await this.cfsglobal
											.from("config_free_days")
											.where('id', item.id)
											.update(obj)
											.then(() => {
												response['iStatus'] = true;
												response['iPayload'].push(item);
												response['iMessage'] = "Lưu dữ liệu thành công!";
											});
									}))
									.then(returnValue => {
										return response;
									})
							} else {
								obj.CREATE_BY = item.CREATE_BY;
								return await this.cfsglobal
									.from("config_free_days")
									.insert(obj)
									.returning('*')
									.then(data => {
										response['iStatus'] = true;
										response['iPayload'] = data;
										response['iMessage'] = "Lưu dữ liệu thành công!";
									});
							}
						})
				} catch (err) {
					response['iStatus'] = false;
					response['iMessage'] = "Không thể cập nhật cấu hình miễn lưu!";
				}
			} else {
				return await this.cfsglobal
					.from("config_free_days")
					.insert(obj)
					.returning('*')
					.then(data => {
						response['iStatus'] = true;
						response['iPayload'] = data;
						response['iMessage'] = "Lưu dữ liệu thành công!";
					});
			}
			// -----------------------------------------------
		})).then(() => {
			return response;
		});
	}

	async delConfigConfigFreeDays(req) {
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
				await this.cfsglobal.from("config_free_days")
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