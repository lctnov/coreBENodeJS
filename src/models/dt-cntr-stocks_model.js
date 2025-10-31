import databaseInstance from '../config/database.js';
import moment from 'moment';
import FunctionModel from '../models/FunctionModel.js';

export default class CntrStockModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }

	async loadCntrStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.voyagekey) {
			response["iStatus"] = false;
			response["iMessage"] = "Vui lòng cung cấp tàu chuyến!";
			return response;
		}
		if (!req.body.class_code) {
			response["iStatus"] = false;
			response["iMessage"] = "Vui lòng cung cấp hướng!";
			return response;
		}
		let whereObj = {};
		req.body.voyagekey ? whereObj["voyagekey"] = req.body.voyagekey : '';
		req.body.class_code ? whereObj["class_code"] = req.body.class_code : '';
		req.body.cntrno ? whereObj["cntrno"] = req.body.cntrno : '';
		var query = await this.cfsglobal
			.from("dt_cntr_stock")
			.select("id", "voyagekey", "class_code", "cntrno", "cntrsztp", "billoflading", "booking_no", "get_in", "get_out", "getout_truck", "jobmode_in", "jobmode_out", "natureoftransport", "commoditydescription", "sealno", "containerlocation", "cargo_weight", "remark", "chk_fe", "chk_lcl", "islocalforeign", "tlhq", "id_tos")
			.where(whereObj)
			.orderBy('create_date', 'desc')
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

	async delCntrStock(req) {
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
				await this.cfsglobal.from("dt_cntr_stock")
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

	async saveCntrStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let insertDataCntrStock = [];
		let updateDataCntrStock = [];
		let flag = 1;
		req.body.map(async item => {
			switch (item.status) {
				case 'insert':
					try {
						if (!item.voyagekey) {
							response['iStatus'] = false;
							response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!';
							return response;
						}
						if (!item.class_code) {
							response['iStatus'] = false;
							response['iMessage'] = 'Vui lòng cung cấp chuyến!';
							return response;
						}
						if (!item.cntrno) {
							response['iStatus'] = false;
							response['iMessage'] = 'Vui lòng cung cấp  cont!';
							return response;
						}
						if (!item.cntrno) {
							response['iStatus'] = false;
							response['iMessage'] = 'Vui lòng cung cấp số container!';
							return response;
						}
						if (!item.cntrsztp) {
							response['iStatus'] = false;
							response['iMessage'] = 'Vui lòng cung cấp lại kích cỡ ISO!';
							return response;
						}
						if (!item.create_by) {
							response['iStatus'] = false;
							response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
							return response;
						}

						let objInsertCntrStock = {
							voyagekey: item.voyagekey,
							class_code: item.class_code,
							cntrno: item.cntrno,
							cntrsztp: item.cntrsztp,
							billoflading: item.billoflading && item.class_code === 1 ? item.billoflading.trim() : '',
							booking_no: item.booking_no && item.class_code === 2 ? item.booking_no.trim() : '',
							get_in: !item.get_in ? null :
								moment(item.get_in, "YYYY-MM-DD HH:mm", true).isValid() ?
									moment(item.get_in, "YYYY-MM-DD HH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
									moment(item.get_in, "YYYY-MM-DD HH:mm:s").format("YYYY-MM-DD HH:mm:ss"),
							get_out: !item.get_out ? null :
								moment(item.get_out, "YYYY-MM-DD[T]HH:mm", true).isValid() ?
									moment(item.get_out, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
									moment(item.get_out, "YYYY-MM-DD HH:mm:s").format("YYYY-MM-DD HH:mm:ss"),
							getout_truck: item.getout_truck || null,
							jobmode_in: item.jobmode_in || null,
							jobmode_out: item.jobmode_out || null,
							natureoftransport: item.natureoftransport || null,
							commoditydescription: item.commoditydescription || null,
							sealno: item.sealno || null,
							containerlocation: item.containerlocation || null,
							cargo_weight: item.cargo_weight,
							remark: item.remark || null,
							chk_fe: item.chk_fe ? 1 : 0,
							chk_lcl: item.chk_lcl ? 1 : 0,
							islocalforeign: item.islocalforeign || null,
							id_tos: item.id_tos || null,
							create_by: item.create_by,
						};
						insertDataCntrStock.push(objInsertCntrStock);
						flag = 1;
						return;
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
						let objUpdateCntrStock = {
							id: item.id,
							class_code: item.class_code,
							voyagekey: item.voyagekey || null,
							cntrno: item.cntrno || null,
							cntrsztp: item.cntrsztp || null,
							billoflading: item.billoflading && item.class_code === 1 ? item.billoflading : '',
							booking_no: item.booking_no && item.class_code === 2 ? item.booking_no : '',
							get_in: item.get_in ? moment(item.get_in).format("YYYY-MM-DD HH:mm:ss") : null,
							get_out: item.get_out ? moment(item.get_out).format("YYYY-MM-DD HH:mm:ss") : null,
							getout_truck: item.getout_truck || null,
							jobmode_in: item.jobmode_in || null,
							jobmode_out: item.jobmode_out || null,
							natureoftransport: item.natureoftransport || null,
							commoditydescription: item.commoditydescription || null,
							sealno: item.sealno || null,
							containerlocation: item.containerlocation || null,
							cargo_weight: item.cargo_weight,
							remark: item.remark || null,
							chk_fe: item.chk_fe ? 1 : 0,
							chk_lcl: item.chk_lcl ? 1 : 0,
							islocalforeign: item.islocalforeign || null,
							tlhq: item.tlhq || null,
							id_tos: item.id_tos || null,
							update_by: item.update_by,
							update_date: item.update_date,
						};
						updateDataCntrStock.push(objUpdateCntrStock);
						flag = 2;
						return;
					} catch (err) {
						response['iStatus'] = false;
						response['iPayload'] = err
						response['iMessage'] = "Không thể lưu mới dữ liệu!";
					}
					break;
				default:
					return { iStatus: false, iPayload: item.status, iMessage: 'Không tìm thấy trạng thái!' };
			}
		});

		let arrDuplicate = [];
		let arrDuplicateCntr = [];
		switch (flag) {
			case 1:
				if (insertDataCntrStock && insertDataCntrStock.length) {
					return Promise.all(insertDataCntrStock.map(async item => {
						let whereObj = {
							class_code: item.class_code,
							voyagekey: item.voyagekey,
							cntrno: item.cntrno
						};
						item.billoflading ? whereObj["billoflading"] = item.billoflading : '';
						item.booking_no ? whereObj["booking_no"] = item.booking_no : '';
						let checkCode = await this.cfsglobal.from("dt_cntr_stock")
							.select("ROWGUid")
							.where(whereObj)
							.catch(err => console.log(err)) || [];

						if (checkCode && !checkCode.length) {
							await this.cfsglobal.from("dt_cntr_stock")
								.insert(item)
								.returning('*')
								.then(data => {
									response['iStatus'] = true;
									response['iPayload'].push(data);
									response['iMessage'] = "Lưu dữ liệu thành công!";
								})
								.catch(err => console.log(err)) || [];
						} else {
							await arrDuplicate.push(checkCode[0]);
							arrDuplicateCntr = arrDuplicate.map(item => item.cntrno);
						}
					}))
						.then(() => {
							if (arrDuplicate && arrDuplicate.length) {
								response["iStatus"] = false;
								response["iPayload"] = arrDuplicate;
								response["iMessage"] = `Số Cont: ${arrDuplicateCntr} đã tạo!`;
								return response;
							} else {
								return response;
							}
						});
				}
				break;
			case 2:
				if (updateDataCntrStock && updateDataCntrStock.length) {
					return Promise.all(updateDataCntrStock.map(async item => {
						let dtUpdate = {
							class_code: item.class_code,
							voyagekey: item.voyagekey,
							cntrno: item.cntrno,
							cntrsztp: item.cntrsztp,
							billoflading: item.billoflading,
							booking_no: item.booking_no,
							get_in: item.get_in,
							get_out: item.get_out,
							getout_truck: item.getout_truck,
							jobmode_in: item.jobmode_in,
							jobmode_out: item.jobmode_out,
							natureoftransport: item.natureoftransport,
							commoditydescription: item.commoditydescription,
							sealno: item.sealno,
							containerlocation: item.containerlocation,
							cargo_weight: item.cargo_weight,
							remark: item.remark,
							chk_fe: item.chk_fe,
							chk_lcl: item.chk_lcl,
							islocalforeign: item.islocalforeign,
							tlhq: item.tlhq,
							id_tos: item.id_tos,
							update_by: item.update_by,
							update_date: item.update_date,
						};

						await this.cfsglobal.from("dt_cntr_stock")
							.where('id', item.id)
							.update(dtUpdate)
							.then(() => {
								response['iStatus'] = true;
								response['iPayload'].push(dtUpdate);
								response['iMessage'] = "Lưu dữ liệu thành công!";
							})
							.catch(err => console.log(err)) || [];
					})).then(() => {
						return response;
					});
				}
				break;
			default: return;
		}
	}

	async getVTOSCntrStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.voyagekey) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!';
				return response;
			}
			if (!req.body.cntrno) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số cont!';
				return response;
			}
			if (!req.body.class_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp hướng!';
				return response;
			}
			if (!req.body.tos_shipkey) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp mã tàu từ TOS!";
				return response;
			}
			if (!item.create_by) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
				return response;
			}
			const dataSend = JSON.stringify({
				CLASS_CODE: req.body.class_code,
				TOS_SHIPKEY: req.body.tos_shipkey,
				CNTRNO: req.body.cntrno
			});

			const opts = {
				hostname: process.env.API_TOS_URL,
				path: '/index.php/api_server/CFStoVTOS_getCntrStock',
				method: 'GET',
				headers: {
					'Content-Type': 'text/plain',
				},
				body: dataSend,
			}
			const responseData = await FunctionModel.ccurl(dataSend, opts);
			const data = JSON.parse(responseData);
			let objTOS = {
				tos_rowguid: null,
				function_patch: 'Container',
				function_name: 'Insert',
				post_data: '',
				get_data: JSON.stringify(req.body),
				mes_status: response['Status'],
				create_by: req.body.create_by,
			}
			if (data.Payload && data.Payload.length) {
				let dtCntrStock = data.Payload.map(item => {
					return {
						cntrno: item.CntrNo,
						cntrsztp: item.ISO_SZTP,
						billoflading: item.BLNo,
						booking_no: item.BookingNo,
						get_in: item.DateIn,
						get_out: item.DateOut,
						getout_truck: item.TruckNo,
						jobmode_in: item.CJMode_CD,
						jobmode_out: item.CJMode_OUT_CD,
						natureoftransport: item.Transist,
						commoditydescription: item.CmdID,
						sealno: item.SealNo,
						containerlocation: 'CFS',
						cargo_weight: item.CMDWeight,
						remark: item.Note,
						chk_fe: item.Status === 'F' ? true : false,
						chk_lcl: 1,
						tlhq: 0,
						islocalforeign: item.IsLocal,
						id_tos: item.rowguid,
						class_code: req.body.CLASS_CODE
					};
				});
				objTOS.post_data = JSON.stringify({
					iStatus: true,
					iPayload: dtCntrStock,
					iMessage: "Truy vấn dữ liệu thành công!"
				});
				objTOS.mes_status = true;
				response["iStatus"] = true;
				response["iPayload"] = dtCntrStock;
				response["iMessage"] = "Nạp dữ liệu thành công!";
				await this.cfsglobal.from("api_tos").insert(objTOS);
				return response;
			} else {
				objTOS.post_data = JSON.stringify({
					iStatus: false,
					iPayload: [],
					iMessage: "Không tìm thấy dữ liệu!"
				});
				objTOS.mes_status = false;
				response["iStatus"] = false;
				response["iPayload"] = [];
				response["iMessage"] = "Không tìm thấy dữ liệu!";
				await this.cfsglobal.from("api_tos").insert(objTOS);
				return response;
			}
		} catch (err) {
			response["iStatus"] = false;
			response["iPayload"] = err;
			response["iMessage"] = "Phát sinh lỗi, vui lòng liên hệ bộ phận kỹ thuật!";
			return response;
		}
	}
}