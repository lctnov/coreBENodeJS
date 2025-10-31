import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ConfigDayLevelModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadConfigDayLevel(req) {
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
			.from("config_day_level AS configDayLevel")
			.select("configDayLevel.id", "configDayLevel.name", "configDayLevel.trf_code", "configDayLevel.trf_desc", "configDayLevel.day_level", "configDayLevel.customer_code", "configDayLevel.method_code", "configDayLevel.item_type_code", "configDayLevel.currency_code", "configDayLevel.amt_rt", "configDayLevel.vat", "configDayLevel.include_vat", "configDayLevel.from_date", "configDayLevel.to_date", "configDayLevel.acc_type", "bsCustomer.customer_name")
			.leftJoin("bs_customer AS bsCustomer", "bsCustomer.customer_code", "configDayLevel.customer_code")
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

	async loadConfigDayLevelCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("config_day_level")
			.select("name")
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			let dtRemoveDuplicate = [...new Set(query)];
			response["iStatus"] = true;
			response["iPayload"] = dtRemoveDuplicate;
			response["iMessage"] = "Truy vấn mẫu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async saveConfigDayLevel(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return Promise.all(req.body.map(async (item) => {
			if (!item.trf_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã biểu cước!';
				return response;
			}
			if (!item.trf_desc) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp diễn giải!';
				return response;
			}
			if (!item.class_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp hướng!';
				return response;
			}
			if (!item.customer_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã khách hàng!';
				return response;
			}
			if (!item.method_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp phương án!';
				return response;
			}
			if (!item.item_type_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp loại hàng hóa!';
				return response;
			}
			if (!item.currency_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp loại tiền!';
				return response;
			}
			if (!item.from_date) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp từ ngày!';
				return response;
			}
			if (!item.to_date) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp đến ngày!';
				return response;
			}
			if (!item.acc_type) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp loại thanh toán!';
				return response;
			}
			let obj = {
				trf_code: item.trf_code || null,
				trf_desc: item.trf_desc || null,
				day_level: item.day_level || null,
				class_code: item.class_code || null,
				customer_code: item.customer_code || null,
				method_code: item.method_code || null,
				item_type_code: item.item_type_code || null,
				currency_code: item.currency_code || null,
				amt_rt: item.amt_rt || null,
				vat: item.vat || null,
				include_vat: item.include_vat || null,
				from_date: item.from_date || null,
				to_date: item.to_date || null,
				acc_type: item.acc_type || null,
				name: item.from_date + '-' + item.to_date + '-' + item.customer_code
			};
			// ------- check exist gate code --------
			let checkCode = await this.cfsglobal
				.from("config_day_level")
				.select("rowguid")
				.where("name", obj.name)
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				try {
					await this.cfsglobal
						.from("config_day_level")
						.select("id", "name", "trf_code", "trf_desc", "day_level", "customer_code", "method_code", "item_type_code", "currency_code", "amt_rt", "vat", "include_vat", "from_date", "to_date", "acc_type")
						.where({ trf_code: obj.trf_code, class_code: obj.class_code, method_code: obj.method_code, item_type_code: obj.item_type_code })
						.then(async data => {
							if (data && data.length) {
								return Promise.all(
									await data.map(async item => {
										obj.acc_type = item.acc_type;
										obj.update_by = item.update_by;
										obj.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
										await this.cfsglobal
											.from("config_day_level")
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
								obj.create_by = item.create_by;
								return await this.cfsglobal
									.from("config_day_level")
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
					response['iMessage'] = "Không thể cập nhật cấu hình lũy tuyến!";
				}
			} else {
				return await this.cfsglobal
					.from("config_day_level")
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

	async delConfigDayLevel(req) {
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
				await this.cfsglobal.from("config_day_level")
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