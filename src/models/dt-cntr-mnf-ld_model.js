import databaseInstance from '../config/database.js';
import moment from 'moment';
import FunctionModel from '../models/FunctionModel.js';

export default class ManifestCNTRModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadManifestCNTR(req) {
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
		var query = await this.cfsglobal
			.from("dt_cntr_mnf_ld")
			.select("id", "rowguid", "voyagekey", "class_code", "transportidentity", "numberofjourney", "arrivaldeparture", "billoflading", "booking_no", "sealno", "cntrno", "cntrsztp", "statusofgood", "item_type_code", "commoditydescription")
			.where({ "voyagekey": req.body.voyagekey, "class_code": req.body.class_code })
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

	async loadManifestCNTRCode(req) {
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
		if (!(req.body.billoflading || req.body.booking_no)) {
			response["iStatus"] = false;
			response["iMessage"] = "Vui lòng cung cấp số vận đơn hoặc số booking!";
			return response;
		}
		if (!req.body.class_code) {
			response["iStatus"] = false;
			response["iMessage"] = "Vui lòng cung cấp hướng!";
			return response;
		}
		let obj = {
			voyagekey: req.body.voyagekey,
			class_code: req.body.class_code,
			[req.body.class_code === 1 ? 'billoflading' : 'booking_no']: req.body[req.body.class_code === 1 ? 'billoflading' : 'booking_no'],
		};
		let dtCont = await this.cfsglobal
			.from("dt_cntr_mnf_ld")
			.select("cntrno")
			.where(obj)
			.catch(err => console.log(err)) || [];

		let dtOrder = await this.cfsglobal
			.from("dt_order")
			.select("cntrno")
			.where({ "voyagekey": obj.voyagekey, "gate_chk": 0 })
			.whereIn("cntrno", dtCont)
			.catch(err => console.log(err)) || [];

		dtOrder = [...new Set(dtOrder)];
		let arrCont = [];
		for (let i = 0; i < dtCont.length; i++) {
			if (!dtOrder.includes(dtCont[i])) {
				arrCont.push(dtCont[i]);
			}
		}
		arrCont = arrCont.map(item => item.cntrno);
		let checkField, fieldValue;
		if (req.body.class_code === 1) {
			checkField = 'billoflading';
			fieldValue = req.body.billoflading;
		} else {
			checkField = 'booking_no';
			fieldValue = req.body.booking_no;
		}
		// Column "dtPkgManifestld.house_bill", "dtPkgManifestld.LOT_NO", "dtPkgManifestld.CARGO_PIECE", "dtPkgManifestld.CARGO_WEIGHT", "dtPkgManifestld.CBM", "dtPkgManifestld.NOTE",
		let query = await this.cfsglobal
			.from("dt_cntr_mnf_ld AS dtCntrManifestld")
			.distinct("dtCntrManifestld.id", "dtCntrManifestld.voyagekey", "dtCntrManifestld.class_code", "dtCntrManifestld.transportidentity", "dtCntrManifestld.numberofjourney", "dtCntrManifestld.arrivaldeparture", "dtCntrManifestld.billoflading", "dtCntrManifestld.booking_no", "dtCntrManifestld.sealno", "dtCntrManifestld.cntrno", "dtCntrManifestld.cntrsztp", "dtCntrManifestld.statusofgood", "dtCntrManifestld.item_type_code", "dtCntrManifestld.commoditydescription", "dtPkgManifestld.item_type_code_cntr", "dtPkgManifestld.booking_fwd", "dtPkgManifestld.shipmarks", "dtPkgManifestld.unit_code", "dtPkgManifestld.declare_no", "dtPkgManifestld.customer_name", "dtPkgManifestld.consignee")
			.leftJoin("dt_package_mnf_ld AS dtPkgManifestld", "dtPkgManifestld.cntrno", "dtCntrManifestld.cntrno")
			.where({ "dtCntrManifestld.voyagekey": obj.voyagekey, "dtCntrManifestld.class_code": obj.class_code })
			.whereIn("dtCntrManifestld.cntrno", arrCont)
			.catch(err => console.log(err)) || [];
		if (query && query.length) {
			response["iStatus"] = true;
			response["iPayload"] = query.filter(p => p.cntrno != undefined);
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async delManifestCNTR(req) {
		var response = {
			iStatus: false,
			iMessage: "",
		};
		if (!req.body.id) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp id!";
			return response;
		}
		try {
			await this.cfsglobal
				.from("dt_cntr_mnf_ld")
				.where("id", req.body.id)
				.del();
			await this.cfsglobal
				.from("dt_package_mnf_ld")
				.where({ "house_bill": req.body.house_bill ? req.body.house_bill : null, "cntrno": req.body.cntrno, "voyagekey": req.body.voyagekey })
				.del();
			response['iStatus'] = true;
			response['iMessage'] = "Xóa dữ liệu thành công!";
			return response;
		} catch {
			response['iStatus'] = false;
			response['iMessage'] = "Xóa dữ liệu không thành công!";
			return response;
		}
	}

	async saveManifestCNTR(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return Promise.all(req.body.map(async (item) => {
			switch (item.status) {
				case 'insert':
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
					if (!item.transportidentity) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp tên tàu!';
						return response;
					}
					if (!item.numberofjourney) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp số chuyến!';
						return response;
					}
					if (!item.arrivaldeparture) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp ngày tàu cập/rời!';
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
					if (!(item.statusofgood == true || item.statusofgood == false)) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp trạng thái hàng hoá!';
						return response;
					}
					if (!item.item_type_code) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp loại hàng hoá!';
						return response;
					}
					if (!item.create_by) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
						return response;
					}
					if (item.class_code === 1 ? !item.billoflading : !item.booking_no) {
						return;
					}
					let dtManifestCNTR = {
						voyagekey: item.voyagekey,
						class_code: item.class_code,
						transportidentity: item.transportidentity,
						numberofjourney: item.numberofjourney,
						arrivaldeparture: item.arrivaldeparture,
						billoflading: item.billoflading,
						booking_no: item.booking_no,
						sealno: item.sealno,
						cntrno: item.cntrno,
						cntrsztp: item.cntrsztp,
						statusofgood: item.statusofgood,
						item_type_code: item.item_type_code,
						commoditydescription: item.commoditydescription,
						create_by: item.create_by
					};
					try {
						await this.cfsglobal.from("dt_cntr_mnf_ld")
							.insert(dtManifestCNTR)
							.returning('*')
							.then(data => {
								response['iStatus'] = true;
								response['iPayload'] = data;
								response['iMessage'] = "Lưu dữ liệu thành công!";
							});
						if (item.class_code === 2) {
							item.booking_fwd.forEach(async itemBK_FWD => {
								await this.cfsglobal.from("dt_package_mnf_ld")
									.where({ "voyagekey": item.voyagekey, "booking_fwd": itemBK_FWD })
									.update({
										cntrno: item.cntrno,
										cntrsztp: item.cntrsztp,
										item_type_code_CNTR: item.item_type_code_CNTR,
										update_by: item.update_by,
										update_date: moment().format("YYYY-MM-DD HH:mm:ss")
									});
							});
						}
					} catch (err) {
						response['iStatus'] = false;
						response['iPayload'] = err;
						response['iMessage'] = "Không thể lưu mới dữ liệu!";
					}
					break;
				case 'update':
					let whereObj = {
						[item.class_code === 1 ? "billoflading" : "booking_no"]: item.class_code === 1 ? item.billoflading : item.booking_no,
						voyagekey: item.voyagekey
					};

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

						await this.cfsglobal.from("dt_cntr_mnf_ld").where('id', item.id)
							.update({
								voyagekey: item.voyagekey || null,
								class_code: item.class_code || null,
								transportidentity: item.transportidentity || null,
								numberofjourney: item.numberofjourney || null,
								arrivaldeparture: item.arrivaldeparture || null,
								billoflading: item.billoflading || null,
								booking_no: item.booking_no || null,
								sealno: item.sealno || null,
								cntrno: item.cntrno || null,
								cntrsztp: item.cntrsztp || null,
								statusofgood: item.statusofgood || null,
								item_type_code: item.item_type_code || null,
								commoditydescription: item.commoditydescription || null,
								update_by: item.update_by,
								update_date: item.update_date
							})
							.then(() => {
								response['iStatus'] = true;
								response['iPayload'].push(item);
								response['iMessage'] = "Lưu dữ liệu thành công!";
							});
						await this.cfsglobal.from("dt_package_mnf_ld")
							.where({ whereObj })
							.update({
								cntrsztp: item.cntrsztp,
								update_by: item.update_by,
								update_date: item.update_date
							});
					} catch (err) {
						response['iStatus'] = false;
						response['iPayload'] = err
						response['iMessage'] = "Không thể lưu mới dữ liệu!";
					}
					break;
				default:
					return { iStatus: false, iPayload: item.status, iMessage: 'Không tìm thấy trạng thái!' };
			}
		})).then(() => {
			return response;
		});
	}

	async getVTOSManifest(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.tos_shipkey) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp mã tàu từ TOS!";
				return response;
			}
			if (req.body.class_code) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp hướng!";
				return response;
			}
			if (!item.create_by) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
				return response;
			}

			const dataSend = JSON.stringify({
				tos_shipkey: req.body.tos_shipkey,
				class_code: req.body.class_code,
				cntrno: req.body.cntrno ? req.body.cntrno : ''
			});
			const opts = {
				hostname: process.env.api_tos_URL,
				path: '/index.php/api_server/CFStoVTOS_getManifestCntr',
				method: 'POST',
				headers: {
					'Content-Type': 'text/plain',
				},
				body: dataSend,
			};
			const responseData = await FunctionModel.ccurl(dataSend, opts);
			const data = JSON.parse(responseData);
			let objTOS = {
				tos_rowguid: null,
				function_patch: 'Manifest',
				function_name: 'Insert',
				post_data: '',
				get_data: JSON.stringify(req.body),
				mes_status: response['Status'],
				create_by: req.body.create_by
			};
			if (data.Payload && data.Payload.length) {
				let dtManifest = data.Payload.map(item => {
					return {
						billoflading: item.BLNo,
						booking_no: item.BookingNo,
						sealno: item.SealNo,
						cntrno: item.CntrNo,
						cntrsztp: item.ISO_SZTP,
						item_type_code: item.CARGO_TYPE,
						statusofgood: item.Status,
						commoditydescription: item.CmdID
					};
				});
				objTOS.post_data = JSON.stringify({
					iStatus: true,
					iPayload: dtManifest,
					iMessage: "Truy vấn dữ liệu thành công!"
				});
				objTOS.mes_status = true;
				response["iStatus"] = true;
				response["iPayload"] = dtManifest;
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