import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ConfigDiscountsModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadConfigDiscount(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("config_discount AS confDiscount")
			.select("confDiscount.id", "confDiscount.name", "confDiscount.trf_code", "confDiscount.trf_desc", "confDiscount.class_code", "confDiscount.method_code", "confDiscount.item_type_code", "confDiscount.currency_code", "confDiscount.amt_rt", "confDiscount.vat", "confDiscount.include_vat", "confDiscount.from_date", "confDiscount.to_date", "confDiscount.acc_type", "confDiscount.customer_code", "bsCustomer.customer_name")
			.leftJoin("bs_customer AS bsCustomer", "bsCustomer.customer_code", "confDiscount.customer_code")
			.orderBy("confDiscount.create_date", "desc")
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			query = query.map(item => {
				return {
					...item,
					customer_name: item.customer_name || '*'
				};
			})
			response["iStatus"] = true;
			response["iPayload"] = query;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async loadConfigDiscountCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let trfConfDiscount = await this.cfsglobal
			.from("config_discount")
			.select("name", "from_date", "to_date")
			.groupBy("name", "from_date", "to_date")
			.catch(err => console.log(err)) || [];
		let trfCode = await this.cfsglobal
			.from("trf_codes")
			.select("id", "trf_code", "trf_desc")
			.catch(err => console.log(err)) || [];
		let bsMethod = await this.cfsglobal
			.from("bs_method")
			.select("id", "method_code")
			.catch(err => console.log(err)) || [];
		let bsItemType = await this.cfsglobal
			.from("bs_item_type")
			.select("id", "item_type_code")
			.catch(err => console.log(err)) || [];
		let bsCurrency = await this.cfsglobal
			.from("currency")
			.select("id", "currency_code")
			.catch(err => console.log(err)) || [];
		response["iStatus"] = true;
		response["iMessage"] = "Nạp dữ liệu thành công!";
		response["iPayload"] = { confDiscount: trfConfDiscount, trfCode: trfCode, bsMethod: bsMethod, bsItemType: bsItemType, bsCurrent: bsCurrency };
		return response;
	}

	async saveConfigDiscounts(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return Promise.all(req.body.map(async (item) => {
			if (!item.trf_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp tên biểu cước!';
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
			if (!item.method_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp phương án!';
				return response;
			}
			if (!item.item_type_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp loại hàng hoá!';
				return response;
			}
			if (!item.currency_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp tên loại tiền!';
				return response;
			}
			let obj = {
				trf_code: item.trf_code || null,
				trf_desc: item.trf_desc || null,
				method_code: item.method_code || null,
				class_code: item.class_code || null,
				item_type_code: item.item_type_code || null,
				currency_code: item.currency_code || null,
				amt_rt: item.amt_rt || null,
				vat: item.vat || null,
				include_vat: item.include_vat ? 1 : 0,
				from_date: item.from_date || null,
				to_date: item.to_date || null,
				acc_type: item.acc_type || null,
				customer_code: item.customer_code || null,
				name: item.from_date + "-" + item.to_date + "-" + item.customer_code
			};
			// ------- check exist gate code --------
			let checkCode = await this.cfsglobal
				.from("config_discount")
				.select("rowguid")
				.where("name", obj.name)
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				try {
					await this.cfsglobal
						.from("config_discount")
						.select("id", "name", "trf_code", "trf_desc", "class_code", "method_code", "item_type_code", "currency_code", "amt_rt", "vat", "include_vat", "from_date", "to_date", "acc_type", "customer_code")
						.where({ trf_code: obj.trf_code, class_code: obj.class_code, method_code: obj.method_code, item_type_code: obj.item_type_code })
						.then(async data => {
							if (data && data.length) {
								return Promise.all(await data.map(async item => {
									obj.acc_type = item.acc_type;
									obj.update_by = item.update_by;
									obj.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
									await this.cfsglobal
										.from("config_discount")
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
									});
							} else {
								obj.create_by = item.create_by;
								return await this.cfsglobal
									.from("config_discount")
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
					response['iMessage'] = "Không thể cập nhật cấu hình giảm giá!";
				}
			} else {
				return await this.cfsglobal
					.from("config_discount")
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

	async delConfigDiscounts(req) {
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
				await this.cfsglobal.from("config_discount")
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