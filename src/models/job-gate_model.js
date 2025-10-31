import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class JobGateModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadJobGate(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.voyagekey) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!'
			return response;
		}
		if (!req.body.order_no) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số lệnh!';
			return response;
		}
		if (!req.body.pin_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số pin!'
			return response;
		}
		if (!req.body.method_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp mã phương án!'
			return response;
		}
		let whereObj = {
			'jobGate.voyagekey': req.body.voyagekey,
			'jobGate.order_no': req.body.order_no,
			'jobGate.pin_code': req.body.pin_code,
			'jobGate.method_code': req.body.method_code,
			'jobGate.truck_no': req.body.truck_no,
			'jobGate.quantity_chk': 1
		};
		var query = await this.cfsglobal
			.from("job_gate AS jobGate")
			.select("jobGate.voyagekey", "jobGate.class_code", "jobGate.method_code", "jobGate.order_no", "jobGate.pin_code", "jobGate.gate_code", "jobGate.is_in_out", "jobGate.driver", "jobGate.tel", "jobGate.truck_no", "jobGate.remooc_no", "jobGate.weight_regis", "jobGate.weight_regis_allow", "jobGate.remooc_weight", "jobGate.remooc_weight_regis", "jobGate.billoflading", "jobGate.booking_no", "jobGate.cntrno", "jobGate.cntrsztp", "jobGate.house_bill", "jobGate.booking_fwd", "jobGate.note", "jobGate.customer_code", "jobGate.time_in", "jobGate.time_out", "jobGate.is_success_in", "jobGate.is_success_out", "jobGate.quantity_chk", "jobGate.vgm", "bstruck.truck_date_exp", "bsremooc.remooc_date_exp")
			.leftJoin("bs_truck AS bstruck", "bstruck.truck_no", "jobGate.truck_no")
			.leftJoin("bs_romooc AS bsremooc", "bsremooc.remooc_no", "jobGate.remooc_no")
			.where(whereObj)
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			response["iStatus"] = true;
			response["iPayload"] = query;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Số xe hiện tại chưa hoàn tất công việc!";
		}
		return response;
	}

	async confirmJobGate(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.order_no) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số lệnh!';
			return response;
		}
		if (!req.body.truck_no) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số xe!'
			return response;
		}
		if (!req.body.class_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!'
			return response;
		}
		if (!req.body.create_by) {
			response['iStatus'] = false;
			response["iMessage"] = "Vui lòng cung cấp lại tên người tạo!";
			return response;
		};
		let whereObj = {
			order_no: req.body.order_no,
			truck_no: req.body.truck_no,
		};
		req.body.cntrno ? whereObj['cntrno'] = req.body.cntrno : '';
		const dtOrderCode = req.body.order_no.substr(0, 3);
		try {
			if (dtOrderCode === 'XKX') {
				if (!req.body.voyagekey) {
					response['iStatus'] = false;
					response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!'
					return response;
				}
				if (!req.body.cntrno) {
					response['iStatus'] = false;
					response['iMessage'] = 'Vui lòng cung cấp số cont!'
					return response;
				}
				let whereObjXKX = {
					voyagekey: req.body.voyagekey,
					class_code: req.body.class_code,
					order_no: req.body.order_no,
				};
				req.body.house_bill ? whereObjXKX['house_bill'] = req.body.house_bill : '';
				let checkCodeXKX = await this.cfsglobal
					.from("dt_order")
					.select("rowguid")
					.where(whereObjXKX)
					.catch(err => console.log(err)) || [];
				if (checkCodeXKX && checkCodeXKX.length) {
					await this.cfsglobal
						.from("dt_package_stock")
						.where(whereObjXKX)
						.update({
							cntrno: checkCodeXKX[0].cntrno,
							update_by: req.body.create_by,
							update_date: moment().format('YYYY-MM-DD HH:mm:ss')
						});
					response["iStatus"] = true;
					response["iMessage"] = "Cập nhật thành công!";
				} else {
					response["iStatus"] = false;
					response["iMessage"] = "Không có dữ liệu!";
				}
			}
			let dtOrderNo = await this.cfsglobal
				.from("dt_order")
				.select(
					"rowguid",
					"voyagekey",
					"class_code",
					"order_no",
					"pin_code",
					"customer_code",
					"acc_type",
					"acc_cd",
					"delivery_order",
					"billoflading",
					"booking_no",
					"cntrno",
					"cntrsztp",
					"item_type_code",
					"item_type_code_cntr",
					"method_code",
					"issue_date",
					"exp_date",
					"house_bill",
					"booking_fwd",
					"cargo_piece",
					"unit_code",
					"cargo_weight",
					"cbm",
					"rt",
					"lot_no",
					"note",
					"owner_phone",
					"owner",
					"commoditydescription"
				)
				.where("order_no", req.body.order_no)
				.catch(err => console.log(err)) || [];
			if (dtOrderNo && !dtOrderNo.length) {
				response['iStatus'] = false;
				response['iMessage'] = `Không tìm thấy dữ liệu của lệnh ${req.body.order_no}!`;
			}
			let dtVessel = await this.cfsglobal
				.from("dt_vessel_visit")
				.select("vessel_name", "inbound_voyage", "outbound_voyage")
				.where("voyagekey", dtOrderNo[0].voyagekey)
				.then(data => {
					if (data && data.length) {
						return {
							name: data[0].vessel_name,
							inbound: data[0].inbound_voyage,
							outbound: data[0].outbound_voyage
						};
					}
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = 'Phát sinh lỗi, vui lòng liên hệ bộ phận kỹ thuật!';
				});
			let dtCustomer = await this.cfsglobal
				.from("bs_customer")
				.select("customer_code", "address", "customer_name")
				.where("customer_code", dtOrderNo[0].customer_code)
				.catch(err => console.log(err)) || [];
			if (dtCustomer && dtCustomer.length) {
				dtCustomer = dtCustomer[0];
			};
			let receiptHeader = {
				truck_no: req.body.truck_no || null,
				voyagekey: dtOrderNo[0].voyagekey || null,
				warehouse_code: req.body.warehouse_code || null,
				order_no: req.body.order_no || null,
				class_code: req.body.class_code || null,
				job_type: ['XKX', 'XKN'].includes(dtOrderCode) ? 'XK' : 'NK',
				receipt_no: `${dtOrderCode}${moment().format('YYMMDDHHmmss')}`,
				receipt_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				billoflading: dtOrderNo[0].billoflading || null,
				booking_no: dtOrderNo[0].booking_no || null,
				cntrno: dtOrderNo[0].cntrno || null,
				cntrsztp: dtOrderNo[0].cntrsztp || null,
				item_type_code: dtOrderNo[0].item_type_code || null,
				item_type_code_cntr: dtOrderNo[0].item_type_code_cntr || null,
				unit_code: dtOrderNo[0].unit_code || null,
				owner: ['NKN', 'XKX'].includes(dtOrderCode) ? dtCustomer.customer_name : dtOrderNo[0].owner,
				owner_phone: ['NKN', 'XKX'].includes(dtOrderCode) ? null : dtOrderNo[0]?.owner_phone,
				vessel_name: dtVessel.name || null,
				address: ['NKN', 'XKX'].includes(dtOrderCode) ? dtCustomer.address : null,
				vessel_bound: req.body.class_code === 1 ? (dtVessel.inbound || null) : (dtVessel.outbound || null),
				create_by: req.body.create_by,
			};
			let whereObjQuantity = {
				voyagekey: '',
				house_bill: [],
				booking_fwd: [],
				order_no: ''
			};
			let insertReceipt = dtOrderNo.map(item => {
				let dtDetail = {};
				whereObjQuantity['order_no'] = item.order_no;
				whereObjQuantity['voyagekey'] = item.voyagekey;
				let checkField, fieldValue;
				if (req.body.class_code === 1) {
					checkField = "house_bill";
					fieldValue = item.house_bill;
				} else {
					checkField = "booking_fwd";
					fieldValue = item.booking_fwd;
				}
				whereObjQuantity[checkField].push(fieldValue);
				dtDetail[checkField] = fieldValue || null;
				dtDetail['commoditydescription'] = item.commoditydescription || null;
				dtDetail['actual_cargo_piece'] = item.cargo_piece || null;
				dtDetail['cargo_weight'] = item.cargo_weight || null;
				dtDetail['cbm'] = item.cbm || null;
				Object.assign(dtDetail, receiptHeader);
				return dtDetail;
			});
			let getQuantity = [];
			whereObjQuantity && whereObjQuantity.house_bill.length ?
				getQuantity = await this.cfsglobal
					.from("job_quantity_check")
					.select("note", "house_bill", "booking_fwd")
					.where({ order_no: whereObjQuantity.order_no, voyagekey: whereObjQuantity.voyagekey })
					.whereIn("house_bill", whereObjQuantity.house_bill)
					.catch(err => console.log(err)) || [] :
				getQuantity = await this.cfsglobal
					.from("job_quantity_check")
					.select("note", "house_bill", "booking_fwd")
					.where({ order_no: whereObjQuantity.order_no, voyagekey: whereObjQuantity.voyagekey })
					.whereIn("booking_fwd", whereObjQuantity.booking_fwd)
					.catch(err => console.log(err)) || [];
			let insertReceiptWithnote = insertReceipt.map(item => {
				let dtFilternote = getQuantity.filter(p => item.house_bill === p.house_bill || item.booking_fwd === p.booking_fwd)[0];
				dtFilternote.note && dtFilternote.note.length ? item['note'] = dtFilternote.note : item['note'] = '';
				return item;
			});
			await this.cfsglobal
				.from("receipts")
				.returning("*")
				.insert(insertReceiptWithnote)
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = 'Phát sinh lỗi, vui lòng liên hệ bộ phận kỹ thuật!';
				});
			let dtJobGate = await this.cfsglobal
				.from("job_gate")
				.select("id")
				.where(whereObj)
				.catch(err => console.log(err)) || [];
			if (dtJobGate && dtJobGate.length) {
				const id = dtJobGate.map(item => item.id);
				await this.cfsglobal
					.from("job_gate")
					.whereIn("id", id)
					.update({
						quantity_chk: 1,
						update_by: req.body.update_by,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
				response['iStatus'] = true;
				response['iPayload'] = req.body;
				response['iMessage'] = 'Xác nhận qua cổng thành công!';
			} else {
				response['iStatus'] = false;
				response['iMessage'] = 'Không có dữ liệu!';
			}
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async confirmJobGateOrderIn(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.voyagekey) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!';
			return response;
		}
		if (!req.body.order_no) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp lệnh!';
			return response;
		}
		if (!req.body.pin_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số pin!';
			return response;
		}
		if (!req.body.method_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp mã phương án!';
			return response;
		}
		if (!req.body.update_by) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp người cập nhật!';
			return response;
		}
		try {
			if (req.body.quantity_chk) {
				let whereObj = {
					order_no: req.body.order_no || null,
					pin_code: req.body.pin_code || null,
					method_code: req.body.method_code || null,
					quantity_chk: req.body.quantity_chk || null,
				};
				let dtJobGate = await this.cfsglobal
					.from("job_gate")
					.select("rowguid")
					.where(whereObj)
					.catch(err => console.log(err)) || [];
				if (dtJobGate && !dtJobGate.length) {
					response['iStatus'] = false;
					response['iMessage'] = 'Lệnh chưa hoàn tất kiểm đếm!';
					return response;
				}
				await this.cfsglobal
					.from("job_gate")
					.where(whereObj)
					.update({
						voyagekey: req.body.voyagekey || null,
						order_no: whereObj.order_no,
						pin_code: whereObj.pin_code,
						method_code: whereObj.method_code,
						quantity_chk: whereObj.quantity_chk,
						is_success_out: 1,
						time_out: moment().format('YYYY-MM-DD HH:mm:ss'),
						note: req.body.note || null,
						update_by: req.body.update_by || null,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
				response['iStatus'] = true;
				response['iPayload'] = req.body;
				response['iMessage'] = 'Hoàn tất xe qua cổng!';
			} else {
				response['iStatus'] = false;
				response['iMessage'] = 'Lệnh chưa hoàn tất kiểm đếm!';
			}
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async confirmOrderTruckOUT(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		if (!req.body.voyagekey) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp lại tàu chuyến!';
			return response;
		}
		if (!req.body.class_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!';
			return response;
		}
		if (req.body.class_code === 1 && !req.body.house_bill) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số house bill!';
			return response;
		} else if (req.body.class_code === 2 && !req.body.booking_no) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số booking!';
			return response;
		}
		if (!req.body.order_no) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số lệnh!';
			return response;
		}
		if (!req.body.pin_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số pin!';
			return response;
		}
		if (!req.body.method_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp mã phương án!';
			return response;
		}
		if (!req.body.update_by) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp người cập nhật!';
			return response;
		}
		try {
			if (req.body.quantity_chk) {
				let whereObj = {
					order_no: req.body.order_no || null,
					pin_code: req.body.pin_code || null,
					method_code: req.body.method_code || null,
					quantity_chk: req.body.quantity_chk || null,
				};
				req.body.house_bill ? whereObj['house_bill'] = req.body.house_bill : null;
				req.body.booking_no ? whereObj['booking_no'] = req.body.booking_no : null;
				let dtJobGate = await this.cfsglobal
					.from("job_gate")
					.select("rowguid")
					.where(whereObj)
					.catch(err => console.log(err)) || [];
				if (dtJobGate && !dtJobGate.length) {
					response['iStatus'] = false;
					response['iMessage'] = 'Lệnh chưa hoàn tất kiểm đếm!';
					return response;
				}
				let whereObjPkgStock = {
					voyagekey: req.body.voyagekey || null,
					order_no: whereObj.order_no,
					class_code: req.body.class_code,
					[req.body.class_code === 1 ? 'house_bill' : 'booking_no']: req.body.class_code === 1 ? whereObj.house_bill : whereObj.booking_no
				};
				await this.cfsglobal
					.from("dt_package_stock")
					.where(whereObjPkgStock)
					.update({
						status: 'D',
						time_out: moment().format('YYYY-MM-DD HH:mm:ss'),
						update_by: whereObj.update_by,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
				await this.cfsglobal
					.from("job_gate")
					.where(whereObj)
					.update({
						voyagekey: req.body.voyagekey || null,
						order_no: whereObj.order_no,
						pin_code: whereObj.pin_code,
						method_code: whereObj.method_code,
						quantity_chk: whereObj.quantity_chk,
						is_success_out: 1,
						time_out: moment().format('YYYY-MM-DD HH:mm:ss'),
						note: req.body.note || null,
						update_by: req.body.update_by || null,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
				response['iStatus'] = true;
				response['iPayload'] = req.body;
				response['iMessage'] = 'Hoàn tất xe qua cổng!';
			} else {
				response['iStatus'] = false;
				response['iMessage'] = 'Lệnh chưa hoàn tất kiểm đếm!';
			}
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async getJobGetTruck(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		var query = await this.cfsglobal
			.from("job_gate")
			.select("is_in_out", "pin_code", "truck_no", "time_in", "method_code", "quantity_chk", "order_no", "voyagekey", "house_bill", "class_code")
			.where("time_out", null)
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

	async getJobGetTruckViaWarehouse(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		if (!req.body.class_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!';
			return response;
		}
		if (!req.body.method_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp phương án!';
			return response;
		}
		let query = await this.cfsglobal
			.from("job_gate")
			.select(
				"id",
				"voyagekey",
				"class_code",
				"method_code",
				"order_no",
				"pin_code",
				"gate_code",
				"is_in_out",
				"driver",
				"tel",
				"truck_no",
				"remooc_no",
				"weight_regis",
				"weight_regis_allow",
				"remooc_weight",
				"remooc_weight_regis",
				"billoflading",
				"booking_no",
				"cntrno",
				"cntrsztp",
				"house_bill",
				"booking_fwd",
				"cargo_piece",
				"unit_code",
				"cargo_weight",
				"cbm",
				"note",
				"customer_code",
				"time_in",
				"time_out",
				"is_success_in",
				"is_success_out",
				"quantity_chk",
				"vgm"
			)
			.where({ class_code: req.body.class_code, method_code: req.body.method_code, quantity_chk: 0 })
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

	async saveJobGateIN(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.class_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp hướng!';
				return response;
			}
			if (!req.body.voyagekey) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!';
				return response;
			}
			if (!req.body.order_no) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số lệnh!';
				return response;
			}
			if (!req.body.pin_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số Pin!';
				return response;
			}
			if (!req.body.gate_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã cổng!';
				return response;
			}
			if (!(req.body.is_in_out.toUpperCase() === 'I' || req.body.is_in_out.toUpperCase() === 'O')) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp cổng!';
				return response;
			}
			if (!req.body.truck_no) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số xe!';
				return response;
			}
			if (!req.body.method_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã phương án!';
				return response;
			}
			if (!req.body.create_by) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp người tạo!';
				return response;
			}
			let dtOrder = await this.cfsglobal
				.from("dt_order")
				.select("rowguid", "pin_code")
				.where("order_no", req.body.order_no)
				.catch(err => console.log(err)) || [];
			if (dtOrder && dtOrder.length) {
				if (!dtOrder.filter(p => p.pin_code?.split('-')[0] === req.body.pin_code).length) {
					response['flag'] = true;
					response['iStatus'] = false;
					response['iMessage'] = 'Số Pin không tồn tại!';
				}
				dtOrder = dtOrder;
			} else {
				response['flag'] = true;
				response['iStatus'] = false;
				response['iMessage'] = 'Số lệnh không tồn tại!';
			}
			if (response['flag']) {
				return response;
			}
			// ------- check exist PIN code --------
			let checkCode = await this.cfsglobal
				.from("job_gate")
				.select("rowguid")
				.where("pin_code", req.body.pin_code)
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				response['iStatus'] = false;
				response['iMessage'] = 'Mã Pin đã tồn tại!';
				return response;
			}
			let dtJobTruck = await this.cfsglobal
				.from("job_gate")
				.select("rowguid", "is_success_out")
				.where("truck_no", req.body.truck_no)
				.catch(err => console.log(err)) || [];
			if (dtJobTruck && dtJobTruck.length) {
				dtJobTruck.map(item => {
					if (item.is_success_out === false) {
						response['flag'] = true;
						response['iStatus'] = false;
						response['iMessage'] = `Số xe ${req.body.truck_no} chưa ra cổng!`;
					}
				});
			}
			if (response['flag']) {
				return response;
			}
			let whereObj = {
				voyagekey: req.body.voyagekey || null,
				[req.body.class_code === 1 ? 'billoflading' : 'booking_fwd']: req.body.class_code === 1 ? req.body.billoflading : req.body.booking_fwd,
				class_code: req.body.class_code || null,
				order_no: req.body.order_no || null,
				pin_code: req.body.pin_code || null,
				gate_code: 'IN',
				is_in_out: 'I',
				driver: req.body.driver || null,
				tel: req.body.tel || null,
				vgm: req.body.vgm ? 1 : 0,
				method_code: req.body.method_code || null,
				truck_no: req.body.truck_no || null,
				weight_regis: req.body.weight_regis || null,
				weight_regis_allow: req.body.weight_regis_allow || null,
				remooc_no: req.body.remooc_no || null,
				remooc_weight: req.body.remooc_weight || null,
				remooc_weight_regis: req.body.remooc_weight_regis || null,
				cntrno: req.body.cntrno || null,
				cntrsztp: req.body.cntrsztp || null,
				note: req.body.note || null,
				customer_code: req.body.customer_code || null,
				time_in: moment().format('YYYY-MM-DD HH:mm:ss'),
				time_out: req.body.time_out || null,
				is_success_in: 1,
				create_by: req.body.create_by || null,
				create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				quantity_chk: 0
			};
			let whereObjTruck = {
				truck_no: whereObj.truck_no || null,
				weight_regis: whereObj.weight_regis || null,
				weight_regis_allow: whereObj.weight_regis_allow || null,
				truck_date_exp: moment(req.body.time_regis, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
				create_by: whereObj.create_by || null,
			};
			let whereObjRemooc = {
				remooc_no: whereObj.remooc_no || null,
				remooc_weight: whereObj.remooc_weight || null,
				remooc_weight_regis: whereObj.remooc_weight_regis || null,
				remooc_date_exp: moment(req.body.TIME_REMOOC, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
				create_by: whereObj.create_by || null,
			};
			//Thoilc(*note)-Nếu không tìm thấy số xe và remooc thì cập nhật / ko tìm thấy thì thêm mới
			let checkTruck = await this.cfsglobal
				.from("bs_truck")
				.select("rowguid", "id")
				.where("truck_no", whereObjTruck.truck_no)
				.catch(err => console.log(err)) || [];
			let checkRemooc = await this.cfsglobal
				.from("bs_romooc")
				.select("rowguid", "id")
				.where("remooc_no", whereObjRemooc.remooc_no)
				.catch(err => console.log(err)) || [];
			if (checkTruck && checkTruck.length) {
				const idTruck = checkTruck[0].id;
				await this.cfsglobal
					.from("bs_truck")
					.where("id", idTruck)
					.update({
						weight_regis: whereObjTruck.weight_regis || null,
						weight_regis_allow: whereObjTruck.weight_regis_allow || null,
						truck_date_exp: whereObjTruck.truck_date_exp || null,
						update_by: whereObj.create_by || null,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
			} else {
				await this.cfsglobal
					.from("bs_truck")
					.returning("*")
					.insert(whereObjTruck);
			}
			if (checkRemooc && checkRemooc.length) {
				const idRemooc = checkRemooc[0].id;
				await this.cfsglobal
					.from("bs_romooc")
					.where("id", idRemooc)
					.update({
						remooc_weight: whereObjRemooc.remooc_weight || null,
						remooc_weight_regis: whereObjRemooc.remooc_weight_regis || null,
						remooc_date_exp: whereObjRemooc.remooc_date_exp || null,
						update_by: whereObj.create_by || null,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
			} else {
				await this.cfsglobal
					.from("bs_romooc")
					.returning("*")
					.insert(whereObjRemooc);
			}
			//-----------------------------------------------
			await this.cfsglobal
				.from("job_gate")
				.returning("*")
				.insert(whereObj)
				.then(async data => {
					if (data && data.length) {
						await this.cfsglobal
							.from("dt_order")
							.where("order_no", whereObj.order_no)
							.update({
								gate_chk: 1,
								update_by: whereObj.create_by,
								update_date: moment().format('YYYY-MM-DD HH:mm:ss')
							});
						response['iStatus'] = true;
						response['iPayload'] = data;
						response['iMessage'] = 'Lưu dữ liệu thành công!';
					}
				});
			return response;
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
			return response;
		}
	}

	async saveJobGateOut(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.class_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp hướng!';
				return response;
			}
			if (!req.body.voyagekey) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!';
				return response;
			}
			if (!req.body.order_no) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số lệnh!';
				return response;
			}
			if (!req.body.pin_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số Pin!';
				return response;
			}
			if (!req.body.gate_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã cổng!';
				return response;
			}
			if (!(req.body.is_in_out.toUpperCase() === 'I' || req.body.is_in_out.toUpperCase() === 'O')) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp cổng!';
				return response;
			}
			if (!req.body.truck_no) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp lại số xe!';
				return response;
			}
			if (!req.body.method_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã phương án!';
				return response;
			}
			if (!req.body.customer_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã khách hàng!';
				return response;
			}
			if (req.body.class_code === 1 || !req.body.house_bill) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp house bill!';
				return response;
			} else if (req.body.class_code === 2 || !req.body.booking_no) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp booking!';
				return response;
			}
			if (!req.body.create_by) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp người tạo!';
				return response;
			}
			let dtOrder = this.cfsglobal
				.from("dt_order")
				.select("rowguid")
				.where("order_no", req.body.order_no)
				.catch(err => console.log(err)) || [];
			if (dtOrder && dtOrder.length) {
				if (!dtOrder.filter(p => p.pin_code?.split('-')[0] === req.body.pin_code).length) {
					response['flag'] = true;
					response['iStatus'] = false;
					response['iMessage'] = 'Số Pin không tồn tại!';
					return response;
				}
				dtOrder = dtOrder;
			} else {
				response['flag'] = true;
				response['iStatus'] = false;
				response['iMessage'] = 'Số lệnh không tồn tại!';
				return response;
			}
			if (response['flag']) {
				return response;
			}
			// ------- check exist PIN code --------
			let checkCode = await this.cfsglobal
				.from("job_gate")
				.select("rowguid")
				.where("pin_code", req.body.pin_code)
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				response['iStatus'] = false;
				response['iMessage'] = 'Mã Pin đã tồn tại!';
				return response;
			}
			let dtJobTruck = await this.cfsglobal
				.from("job_gate")
				.select("rowguid", "is_success_out")
				.where("truck_no", req.body.truck_no)
				.catch(err => console.log(err)) || [];
			if (dtJobTruck && dtJobTruck.length) {
				dtJobTruck.map(item => {
					if (item.is_success_out === false) {
						response['flag'] = true;
						response['iStatus'] = false;
						response['iMessage'] = `Số xe ${req.body.truck_no} chưa ra cổng!`;
					}
				});
			}
			if (response['flag']) {
				return response;
			}
			let whereObj = {
				voyagekey: req.body.voyagekey || null,
				[req.body.class_code === 1 ? 'billoflading' : 'booking_fwd']: req.body.class_code === 1 ? req.body.billoflading : req.body.booking_fwd,
				class_code: req.body.class_code || null,
				order_no: req.body.order_no || null,
				pin_code: req.body.pin_code || null,
				gate_code: req.body.method_code === 'NKN' || req.body.method_code === 'NKX' ? 'IN' : 'OUT',
				is_in_out: req.body.method_code === 'NKN' || req.body.method_code === 'NKX' ? 'I' : 'O',
				driver: req.body.driver || null,
				tel: req.body.tel || null,
				vgm: req.body.vgm ? 1 : 0,
				method_code: req.body.method_code || null,
				truck_no: req.body.truck_no || null,
				weight_regis: req.body.weight_regis || null,
				weight_regis_allow: req.body.weight_regis_allow || null,
				remooc_no: req.body.remooc_no || null,
				remooc_weight: req.body.remooc_weight || null,
				remooc_weight_regis: req.body.remooc_weight_regis || null,
				cntrno: req.body.cntrno || null,
				cntrsztp: req.body.cntrsztp || null,
				[req.body.class_code === 1 ? 'house_bill' : 'booking_no']: req.body.class_code === 1 ? req.body.house_bill : req.body.booking_no,
				note: req.body.note || null,
				customer_code: req.body.customer_code || null,
				time_in: moment().format('YYYY-MM-DD HH:mm:ss'),
				time_out: req.body.time_out || null,
				IS_SUCCESS_IN: 1,
				create_by: req.body.create_by || null,
			};
			let whereObjTruck = {
				truck_no: whereObj.truck_no || null,
				weight_regis: whereObj.weight_regis || null,
				weight_regis_allow: whereObj.weight_regis_allow || null,
				truck_date_exp: moment(jobGate.time_regis, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
				create_by: whereObj.create_by || null,
			};
			let whereObjRemooc = {
				remooc_no: whereObj.remooc_no || null,
				remooc_weight: whereObj.remooc_weight || null,
				remooc_weight_regis: whereObj.remooc_weight_regis || null,
				remooc_date_exp: moment(jobGate.TIME_REMOOC, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
				create_by: obj.create_by || null,
			};
			//Thoilc(*note)-Nếu không tìm thấy số xe và remooc thì cập nhật / ko tìm thấy thì thêm mới
			let checkTruck = await this.cfsglobal
				.from("bs_truck")
				.select("rowguid", "id")
				.where("truck_no", whereObjTruck.truck_no)
				.catch(err => console.log(err)) || [];
			let checkRemooc = await this.cfsglobal
				.from("bs_romooc")
				.select("rowguid", "id")
				.where("remooc_no", whereObjRemooc.remooc_no)
				.catch(err => console.log(err)) || [];
			if (checkTruck && checkTruck.length) {
				const idTruck = checkTruck.id;
				await this.cfsglobal
					.from("bs_truck")
					.where("id", idTruck)
					.update({
						weight_regis: whereObjTruck.weight_regis || null,
						weight_regis_allow: whereObjTruck.weight_regis_allow || null,
						truck_date_exp: whereObjTruck.truck_date_exp || null,
						update_by: whereObj.create_by || null,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
			} else {
				await this.cfsglobal
					.from("bs_truck")
					.returning("*")
					.insert(whereObjTruck);
			}
			if (checkRemooc && checkRemooc.length) {
				const idRemooc = checkRemooc.id;
				await this.cfsglobal
					.from("bs_romooc")
					.where("id", idRemooc)
					.update({
						remooc_weight: whereObjRemooc.remooc_weight || null,
						remooc_weight_regis: whereObjRemooc.remooc_weight_regis || null,
						remooc_date_exp: whereObjRemooc.remooc_date_exp || null,
						update_by: whereObj.create_by || null,
						update_date: moment().format('YYYY-MM-DD HH:mm:ss')
					});
			} else {
				await this.cfsglobal
					.from("bs_romooc")
					.returning("*")
					.insert(whereObjRemooc);
			}
			//-----------------------------------------------
			let dtOrderInfo = await this.cfsglobal
				.from("dt_order")
				.select("rowguid", "house_bill", "booking_fwd")
				.where({ voyagekey: whereObj.voyagekey, class_code: whereObj.class_code, order_no: whereObj.order_no })
				.catch(err => console.log(err)) || [];
			let dataReturn;
			if (dtOrderInfo && dtOrderInfo.length) {
				dtOrderInfo.forEach(async item => {
					let whereObjOrder = {
						voyagekey: whereObj.voyagekey,
						class_code: whereObj.class_code,
						[whereObj.class_code === 1 ? 'house_bill' : 'booking_fwd']: whereObj.class_code === 1 ? item.house_bill : item.booking_fwd
					};
					let checkCodePkgManifest = await this.cfsglobal
						.from("dt_package_stock")
						.select("id", "voyagekey", "warehouse_code", "class_code", "booking_fwd", "house_bill", "order_no", "pin_code", "cargo_weight")
						.where(whereObjOrder)
						.catch(err => console.log(err)) || [];
					if (checkCodePkgManifest && checkCodePkgManifest.length) {
						checkCodePkgManifest.forEach(async item => {
							//Thoilc(*note)-Tìm pallet
							let dtPalletStock = await this.cfsglobal
								.from("dt_pallet_stock")
								.select("pallet_no", "cargo_piece", "unit_code", "block", "slot", "tier")
								.where("idref_stock", item.id)
								.catch(err => console.log(err)) || [];
							if (dtPalletStock && dtPalletStock.length) {
								let dtJobStock = dtPalletStock.forEach((subItem, index) => {
									return {
										...item,
										...subItem,
										job_type: 'XK',
										seq: idx + 1,
										job_status: 'A',
										create_by: whereObj.create_by,
									};
								});
								dataReturn = await this.cfsglobal
									.from("job_stock")
									.returning("*")
									.insert(dtJobStock);
							} else {
								response['iStatus'] = false;
								response['iMessage'] = 'Không tìm thấy pallet!';
							}
						});
					} else {
						response['iStatus'] = false;
						response['iMessage'] = 'Không tìm thấy kiện hàng!';
					}
				});
			} else {
				response['iStatus'] = false;
				response['iMessage'] = 'Không có thông tin từ lệnh!';
			}
			//Thoilc(*note)-Cập nhật order_no lại
			await this.cfsglobal
				.from("dt_package_stock")
				.where(whereObjOrder)
				.update({
					order_no: whereObj.order_no || null,
					method_out: whereObj.class_code === 1 ? 'XKN' : 'XKX',
					update_by: whereObj.create_by || null,
					update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				});
			await this.cfsglobal
				.from("dt_order")
				.where(whereObj)
				.update({
					gate_chk: 1,
					update_by: whereObj.create_by,
					update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				});
			let dtJobGate = await this.cfsglobal
				.from("job_gate")
				.returning("*")
				.insert(whereObj);
			response['iStatus'] = true;
			response['iMessage'] = 'Lưu dữ liệu thành công!';
			response['iPayload'] = { jobStockInfo: dataReturn, jobGateInfo: dtJobGate }
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}
}