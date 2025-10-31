import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class TrfCodeModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadTrfCd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("trf_codes")
			.select("id", "trf_code", "trf_desc", "inv_unit", "vat_chk", "revenue_acc")
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

	async loadTrfCdCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("trf_codes")
			.select("trf_code", "trf_desc")
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

	async saveTrfCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return Promise.all(req.body.map(async (item) => {
			switch (item.status) {
				case 'insert':
					if (!item.trf_code) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng nhập mã biểu cước!';
						return response;
					}
					if (!item.trf_desc) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng nhập tên biểu cước!';
						return response;
					}
					if (!item.inv_unit) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng nhập đơn vị tính!';
						return response;
					}
					if (!(item.vat_chk === 1 || item.vat_chk === 0)) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng nhập thuế!';
						return response;
					}
					if (!item.create_by) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
						return response;
					}
					// ------- check exist gate code --------
					let checkCode = await this.cfsglobal
						.from("trf_codes")
						.select("rowguid")
						.where("trf_code", item.trf_code)
						.catch(err => console.log(err)) || [];

					if (checkCode && checkCode.length) {
						response['iStatus'] = false;
						response['iMessage'] = "Mã biểu cước đã tồn tại!";
						return response;
					}
					// -----------------------------------------------
					let obj = {
						trf_code: item.trf_code,
						trf_desc: item.trf_desc,
						inv_unit: item.inv_unit,
						vat_chk: item.vat_chk,
						create_by: item.create_by,
					};
					try {
						return await this.cfsglobal.from("trf_codeS")
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

						return await this.cfsglobal.from("trf_codes").where('id', item.id)
							.update({
								trf_desc: item.trf_desc || null,
								inv_unit: item.inv_unit || null,
								vat_chk: item.vat_chk,
								revenue_acc: item.revenue_acc || null,
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

	async delTrfCode(req) {
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
				await this.cfsglobal.from("trf_codeS")
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