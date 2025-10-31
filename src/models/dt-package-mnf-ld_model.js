import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class PkgManifestladingModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }

	async loadPkgManifestld(req) {
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
		if (!req.body.cntrno && req.body.class_code === 1) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số container!';
			return response;
		}
		let tempObj = {};
		let whereObj = {
			voyagekey: req.body.voyagekey,
			class_code: req.body.class_code,
			item_type_code: req.body.item_type_code
		};
		req.body.cntrno ? whereObj["cntrno"] = req.body.cntrno : '';
		req.body.cntrsztp ? whereObj["cntrsztp"] = req.body.cntrsztp : '';
		Object.keys(whereObj).map(key => {
			tempObj['dtPkgManifestld.' + key] = whereObj[key];
		});
		let query = await this.cfsglobal
			.from("dt_package_mnf_ld AS dtPkgManifestld")
			.select(
				"dtPkgManifestld.id",
				"dtPkgManifestld.voyagekey",
				"dtPkgManifestld.transportidentity",
				"dtPkgManifestld.numberofjourney",
				"dtPkgManifestld.arrivaldeparture",
				"dtPkgManifestld.billoflading",
				"dtPkgManifestld.booking_no",
				"dtPkgManifestld.cntrno",
				"dtPkgManifestld.cntrsztp",
				"dtPkgManifestld.item_type_code_cntr",
				"dtPkgManifestld.house_bill",
				"dtPkgManifestld.booking_fwd",
				"dtPkgManifestld.lot_no",
				"dtPkgManifestld.shipmarks",
				"dtPkgManifestld.item_type_code",
				"dtPkgManifestld.commoditydescription",
				"dtPkgManifestld.cargo_piece",
				"dtPkgManifestld.unit_code",
				"dtPkgManifestld.cargo_weight",
				"dtPkgManifestld.cbm",
				"dtPkgManifestld.declare_no",
				"dtPkgManifestld.note",
				"dtPkgManifestld.class_code",
				"dtPkgManifestld.customer_name",
				"dtPkgManifestld.consignee",
				"bsCustomer.customer_code",
				"bsCustomer.customer_name"
			)
			.leftJoin("bs_customer AS bsCustomer", "bsCustomer.customer_code", "dtPkgManifestld.consignee")
			.where(tempObj)
			.orderBy('dtPkgManifestld.create_date', 'desc')
			.catch(err => console.log(err)) || [];
		if (query && query.length) {
			query = query.map(item => {
				return {
					...item,
					consigneeInfo: { customer_code: item.customer_code, customer_name: item.customer_name }
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

	async loadPkgManifestldCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		let mUnitCode = await this.cfsglobal.from("bs_unit").select("id", "unit_code").orderBy('create_date', 'desc').catch(err => console.log(err)) || [];
		let mItemTypeCode = await this.cfsglobal.from("bs_item_type").select("id", "item_type_code").orderBy('create_date', 'desc').catch(err => console.log(err)) || [];
		let mCustomerCode = await this.cfsglobal.from("bs_customer").select("id", "customer_code", "customer_name").orderBy('create_date', 'desc').catch(err => console.log(err)) || [];
		response['iStatus'] = true;
		response['iMessage'] = 'Load dữ liệu thành công!';
		response['iPayload'] = { Unit: mUnitCode, ItemType: mItemTypeCode, Customer: mCustomerCode };
		return response;
	}

	async delPkgManifestld(req) {
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
				let whereObj = {
					[item.class_code === 1 ? 'billoflading' : 'booking_no']: item[item.class_code === 1 ? 'house_bill' : 'booking_no'],
					voyagekey: item.voyagekey,
					cntrno: item.cntrno
				};

				await this.cfsglobal
					.from("dt_package_mnf_ld")
					.where("id", item.id)
					.del();
				await this.cfsglobal
					.from("dt_cntr_mnf_ld")
					.where(whereObj)
					.del();
				response['iStatus'] = true;
				response['iMessage'] = "Xóa dữ liệu thành công!";
			} catch {
				response['iStatus'] = false;
				response['iMessage'] = "Xóa dữ liệu không thành công!";
			}
		}))
			.then((value) => {
				return response;
			});
	}

	async savePkgManifestld(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let flagManifestld = 1;
		let dtInsertPkgManifestld = [];
		let dtUpdatePkgManifestld = [];
		req.body.map(async item => {
			switch (item.status) {
				case 'insert':
					if (!item.voyagekey) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp tàu chuyến!";
						return response;
					}
					if (!item.class_code) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp hướng nhập/xuất!";
						return response;
					}
					if (!item.transportidentity) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp tên tàu!";
						return response;
					}
					if (!item.numberofjourney) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp số chuyến!";
						return response;
					}
					if (!item.arrivaldeparture) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp ngày tàu đến hoặc tàu rời!";
						return response;
					}
					if (!item.customer_name) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp lại tên khách hàng!";
						return response;
					}
					if (!item.cargo_piece) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp số lượng!";
						return response;
					}
					if (!item.unit_code) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp đơn vị tính!";
						return response;
					}
					if (!item.cargo_weight) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp trọng lượng!";
						return response;
					}
					if (!item.cbm) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp số khối!";
						return response;
					}
					if (!item.consignee) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp tên đại lý!";
						return response;
					}
					if (!item.create_by) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp tên người tạo!";
						return response;
					}
					let whereObjInsert = {
						voyagekey: item.voyagekey,
						class_code: item.class_code,
						transportidentity: item.transportidentity,
						numberofjourney: item.numberofjourney,
						arrivaldeparture: moment(item.arrivaldeparture).format('YYYY-MM-DD HH:mm:ss'),
						cntrno: item.cntrno,
						cntrsztp: item.cntrsztp,
						billoflading: item.class_code === 1 ? item.house_bill : item.billoflading,
						[item.class_code === 1 ? 'booking_no' : 'booking_fwd']: item.class_code === 1 ? item.booking_no : item.booking_fwd,
						item_type_code_cntr: item.item_type_code_cntr,
						house_bill: item.house_bill,
						lot_no: item.lot_no,
						shipmarks: item.shipmarks,
						customer_name: item.customer_name,
						item_type_code: item.item_type_code,
						commoditydescription: item.commoditydescription,
						cargo_piece: item.cargo_piece,
						unit_code: item.unit_code,
						cargo_weight: item.cargo_weight,
						cbm: item.cbm,
						declare_no: item.declare_no,
						note: item.note,
						consignee: item.consignee,
						create_by: item.create_by
					};
					try {
						dtInsertPkgManifestld.push(whereObjInsert);
						flagManifestld = 1;
						return;
					} catch {
						response['iStatus'] = false;
						response['iMessage'] = "Không thể lưu mới dữ liệu, nguyên nhân bạn cung cấp dữ liệu chưa đúng hoặc độ dài vượt quá ký tự!";
					}
					break;
				case 'update':
					if (!item.id) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp số id!";
						return response;
					}
					if (!item.update_by) {
						response['iStatus'] = false;
						response['iMessage'] = "Vui lòng cung cấp tên người cập nhật!";
						return response;
					}
					try {
						let dtCntrManifest = await this.cfsglobal.from("DT_CNTR_MNF_LD").select("id", "voyagekey", "class_code", "transportidentity", "numberofjourney", "arrivaldeparture", "billoflading", "booking_no", "SEALNO", "cntrno", "cntrsztp", "STATUSOFGOOD", "item_type_code", "commoditydescription")
							.where({ "cntrno": item.cntrno, "voyagekey": item.voyagekey })
							.catch(err => console.log(err)) || [];
						item.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
						let whereObjUpdate = {
							id: item.id,
							voyagekey: item.voyagekey,
							class_code: item.class_code,
							transportidentity: item.transportidentity,
							numberofjourney: item.numberofjourney,
							arrivaldeparture: moment(item.arrivaldeparture).format('YYYY-MM-DD HH:mm:ss'),
							cntrno: item.cntrno,
							cntrsztp: dtCntrManifest[0]?.cntrsztp ?? null,
							billoflading: item.billoflading,
							booking_no: item.booking_no,
							item_type_code_cntr: item.item_type_code_cntr,
							house_bill: item.house_bill,
							lot_no: item.lot_no,
							shipmarks: item.shipmarks,
							customer_name: item.customer_name,
							item_type_code: item.item_type_code,
							commoditydescription: item.commoditydescription,
							cargo_piece: item.cargo_piece,
							unit_code: item.unit_code,
							cargo_weight: parseFloat(item.cargo_weight),
							cbm: parseFloat(item.cbm),
							declare_no: item.declare_no,
							note: item.note,
							consignee: item.consignee,
							update_by: item.update_by,
							update_date: item.update_date
						};
						dtUpdatePkgManifestld.push(whereObjUpdate);
						flagManifestld = 2;
						return;
					} catch {
						response['iStatus'] = false;
						response['iMessage'] = "Không thể lưu mới dữ liệu, nguyên nhân bạn cung cấp dữ liệu chưa đúng hoặc độ dài vượt quá ký tự!";
					}
					break;
				default:
					response['iStatus'] = false;
					response['iMessage'] = "Vui lòng cung cấp trạng thái!";
					return response;
			}
		});
		switch (flagManifestld) {
			case 1:
				if (dtInsertPkgManifestld && dtInsertPkgManifestld.length) {
					let flag = false;
					await this.cfsglobal.from("dt_package_mnf_ld")
						.select("id", "voyagekey", "transportidentity", "numberofjourney", "arrivaldeparture", "billoflading", "booking_no", "cntrno", "cntrsztp", "item_type_code_cntr", "house_bill", "booking_fwd", "lot_no", "shipmarks", "item_type_code", "commoditydescription", "cargo_piece", "unit_code", "cargo_weight", "cbm", "declare_no", "note", "class_code", "customer_name", "consignee")
						.where({ "voyagekey": dtInsertPkgManifestld[0]?.voyagekey, "cntrno": dtInsertPkgManifestld[0]?.cntrno })
						.then(data => {
							if (data.length && data[0].consignee !== dtInsertPkgManifestld[0].consignee) {
								flag = true;
							}
						})
						.catch(err => console.log(err)) || [];
					if (flag) {
						await this.cfsglobal.from("dt_package_mnf_ld")
							.where({ "voyagekey": dtInsertPkgManifestld[0].voyagekey, "cntrno": dtInsertPkgManifestld[0].cntrno })
							.update({ "consignee": dtInsertPkgManifestld[0].consignee, "update_by": dtInsertPkgManifestld[0].create_by, "update_date": moment().format("YYYY-MM-DD HH:mm:ss") })
							.catch(err => console.log(err)) || [];
					}

					let dtFilter = dtInsertPkgManifestld.map(item => {
						if (item.house_bill) {
							return [
								{ voyagekey: item.voyagekey },
								{ house_bill: item.house_bill },
								{ class_code: item.class_code }
							];
						}
						if (item.booking_fwd) {
							return [
								{ voyagekey: item.voyagekey },
								{ booking_fwd: item.booking_fwd },
								{ class_code: item.class_code }
							];
						}
					});
					const checkCode = await this.cfsglobal.from("dt_package_mnf_ld")
						.select("id", "voyagekey", "transportidentity", "numberofjourney", "arrivaldeparture", "billoflading", "booking_no", "cntrno", "cntrsztp", "item_type_code_cntr", "house_bill", "booking_fwd", "lot_no", "shipmarks", "item_type_code", "commoditydescription", "cargo_piece", "unit_code", "cargo_weight", "cbm", "declare_no", "note", "class_code", "customer_name", "consignee")
						.where((innerBuilder) => {
							dtFilter.forEach(item => {
								const voyagekey = item[0].voyagekey;
								const house_bill = item[1].house_bill;
								const class_code = item[2].class_code;
								innerBuilder.orWhere({ "voyagekey": voyagekey, "house_bill": house_bill, "class_code": class_code });
							})
						})
						.catch(err => console.log(err)) || [];

					if (checkCode && !checkCode.length) {
						await this.cfsglobal.from("dt_package_mnf_ld")
							.returning("*")
							.insert(dtInsertPkgManifestld)
							.then(data => {
								response['iStatus'] = true;
								response['iPayload'] = data;
								response['iMessage'] = "Lưu dữ liệu thành công!";
							})
							.catch(err => console.log(err)) || [];
					} else {
						if (checkCode[0].house_bill) {
							response['iStatus'] = false;
							response['iMessage'] = "Hiện tại thông tin house_bill này đã được đăng ký từ trước!";
						}
						if (checkCode[0].booking_fwd) {
							response['iStatus'] = false;
							response['iMessage'] = "Hiện tại thông tin booking_no này đã được đăng ký từ trước!";
						}
					}
				} else {
					response['iStatus'] = false;
					response['iMessage'] = 'Không có dữ liệu để thêm mới hoặc độ dài ký tự vượt quá giới hạn cho phép!';
				}
				break;
			case 2:
				if (dtUpdatePkgManifestld && dtUpdatePkgManifestld.length) {
					return Promise.all(dtUpdatePkgManifestld.map(async item => {
						let dtUpdate = {
							voyagekey: item.voyagekey,
							class_code: item.class_code,
							transportidentity: item.transportidentity,
							numberofjourney: item.numberofjourney,
							arrivaldeparture: item.arrivaldeparture,
							cntrno: item.cntrno,
							cntrsztp: item.cntrsztp,
							billoflading: item.billoflading,
							booking_no: item.booking_no,
							item_type_code_cntr: item.item_type_code_cntr,
							house_bill: item.house_bill,
							lot_no: item.lot_no,
							shipmarks: item.shipmarks,
							customer_name: item.customer_name,
							item_type_code: item.item_type_code,
							commoditydescription: item.commoditydescription,
							cargo_piece: item.cargo_piece,
							unit_code: item.unit_code,
							cargo_weight: item.cargo_weight,
							cbm: item.cbm,
							declare_no: item.declare_no,
							note: item.note,
							consignee: item.consignee,
							update_by: item.update_by,
							update_date: item.update_date
						};
						await this.cfsglobal.from("dt_package_mnf_ld")
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
				} else {
					response['iStatus'] = false;
					response['iPayload'] = [];
					response['iMessage'] = 'Không có dữ liệu để cập nhật hoặc độ dài ký tự vượt quá giới hạn cho phép!';
				}
				break;
			default: return;
		}
		return response;
	}

	async getPkgManifestld(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		if (!req.body.voyagekey) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp tàu chuyến!";
			return response;
		}
		if (!req.body.cntrno) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp số cont!";
			return response;
		}
		if (!req.body.class_code) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp hướng!";
			return response;
		}
		let whereObj = { voyagekey: req.body.voyagekey };
		req.body.billoflading ? whereObj["billoflading"] = req.body.billoflading : '';
		req.body.cntrno ? whereObj["cntrno"] = req.body.cntrno : '';
		req.body.class_code ? whereObj["class_code"] = req.body.class_code : '';
		// ------- check exist code --------
		let checkCode = await this.cfsglobal
			.from("dt_order")
			.select("rowguid")
			.where(whereObj)
			.then(item => {
				if (item.length === 0) {
					return false;
				} else if ((item.filter(p => !p.gate_chk).length !== 0)) {
					return true;
				} else {
					return false;
				}
			})
			.catch(err => console.log(err)) || [];

		if (checkCode && checkCode.length) {
			response['iStatus'] = false;
			response['iMessage'] = `Số container: ${req.body.cntrno} đã làm lệnh!`;
			return response;
		}
		let tempObj = {};
		let obj = {
			voyagekey: whereObj.voyagekey
		};
		req.body.billoflading ? obj["billoflading"] = req.body.billoflading : '';
		req.body.cntrno ? obj["cntrno"] = req.body.cntrno : '';
		req.body.class_code ? obj["class_code"] = req.body.class_code : '';
		Object.keys(obj).map(key => {
			tempObj['dtPkgManifestld.' + key] = obj[key];
		});
		// -----------------------------------------------
		let dtPkgManifest = await this.cfsglobal
			.from("dt_package_mnf_ld AS dtPkgManifestld")
			.distinct("dtPkgManifestld.id", "dtPkgManifestld.ROWGUid", "dtPkgManifestld.transportidentity", "dtPkgManifestld.numberofjourney", "dtPkgManifestld.arrivaldeparture", "dtPkgManifestld.billoflading", "dtPkgManifestld.cntrno", "dtPkgManifestld.item_type_code_cntr", "dtPkgManifestld.house_bill", "dtPkgManifestld.booking_fwd", "dtPkgManifestld.lot_no", "dtPkgManifestld.shipmarks", "dtPkgManifestld.commoditydescription", "dtPkgManifestld.cargo_piece", "dtPkgManifestld.unit_code", "dtPkgManifestld.cargo_weight", "dtPkgManifestld.cbm", "dtPkgManifestld.declare_no", "dtPkgManifestld.note", "dtPkgManifestld.class_code", "dtPkgManifestld.customer_name", "dtCntrManifestld.booking_no", "dtCntrManifestld.cntrsztp", "dtCntrManifestld.item_type_code")
			.leftJoin("DT_CNTR_MNF_LD AS dtCntrManifestld", "dtCntrManifestld.cntrno", "dtPkgManifestld.cntrno")
			.where(tempObj)
			.catch(err => console.log(err)) || [];
		if (dtPkgManifest && dtPkgManifest.length) {
			response["iStatus"] = true;
			response["iPayload"] = dtPkgManifest;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async getPkgManifestldStore(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.voyagekey) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp tàu chuyến!";
			return response;
		}
		if (!req.body.booking_fwd) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp số booking_fwd!";
			return response;
		}
		let whereObj = {
			voyagekey: req.body.voyagekey,
			METHOD_CODE: 'XKX'
		};
		req.body.booking_fwd ? whereObj["booking_fwd"] = req.body.booking_fwd : '';
		// ------- check exist code --------
		let checkCode = await this.cfsglobal
			.from("DT_ORDER")
			.select("ROWGUid")
			.where(whereObj)
			.then(item => {
				if (item.length === 0) {
					return false;
				} else if ((item.filter(p => !p.gate_chk).length !== 0)) {
					return true;
				} else {
					return false;
				}
			})
			.catch(err => console.log(err)) || [];

		if (checkCode && checkCode.length) {
			response['iStatus'] = false;
			response['iMessage'] = `Số booking_fwd: ${req.body.booking_fwd} đã làm lệnh!`;
			return response;
		}
		// -----------------------------------------------
		let dtPkgManifest = await this.cfsglobal
			.from("dt_package_mnf_ld AS dtPkgManifestld")
			.select(
				"dtPkgManifestld.id",
				"dtPkgManifestld.voyagekey",
				"dtPkgManifestld.transportidentity",
				"dtPkgManifestld.numberofjourney",
				"dtPkgManifestld.arrivaldeparture",
				"dtPkgManifestld.billoflading",
				"dtPkgManifestld.booking_no",
				"dtPkgManifestld.cntrno",
				"dtPkgManifestld.cntrsztp",
				"dtPkgManifestld.item_type_code_cntr",
				"dtPkgManifestld.house_bill",
				"dtPkgManifestld.booking_fwd",
				"dtPkgManifestld.lot_no",
				"dtPkgManifestld.shipmarks",
				"dtPkgManifestld.item_type_code",
				"dtPkgManifestld.commoditydescription",
				"dtPkgManifestld.cargo_piece",
				"dtPkgManifestld.unit_code",
				"dtPkgManifestld.cargo_weight",
				"dtPkgManifestld.cbm",
				"dtPkgManifestld.declare_no",
				"dtPkgManifestld.note",
				"dtPkgManifestld.class_code",
				"dtPkgManifestld.customer_name",
				"dtPkgManifestld.consignee",
				"bsCustomer.acc_type",
				"bsCustomer.customer_code"
			)
			.leftJoin("bs_customer AS bsCustomer", "bsCustomer.customer_code", "dtPkgManifestld.consignee")
			.where({
				"dtPkgManifestld.voyagekey": whereObj.voyagekey,
				"dtPkgManifestld.method_code": whereObj.method_code,
				"dtPkgManifestld.booking_fwd": whereObj.booking_fwd
			})
			.catch(err => console.log(err)) || [];


		if (dtPkgManifest && dtPkgManifest.length) {
			response["iStatus"] = true;
			response["iPayload"] = dtPkgManifest;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}
}