import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class BlockModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadDtOrder(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let dtOrder = [];
		if (!req.body.order_no && !req.body.pin_code && !req.body.cntrno) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp lại số lệnh, mã PIN và Container!';
			return response;
		}
		try {
			let obj = {
				order_no: req.body.order_no,
				pin_code: req.body.pin_code,
				cntrno: req.body.cntrno,
			};
			if (obj.order_no) {
				dtOrder = await this.cfsglobal
					.from("dt_order as dtOrder")
					.select(
						"dtOrder.voyagekey",
						"dtOrder.order_no",
						"dtOrder.pin_code",
						"dtOrder.cntrno",
						"dtOrder.cntrsztp",
						"dtOrder.customer_code",
						"dtOrder.method_code",
						"dtOrder.class_code",
						"dtOrder.billoflading",
						"dtOrder.house_bill",
						"dtOrder.booking_fwd",
						"dtOrder.booking_no",
						"dtVessel.inbound_voyage",
						"dtVessel.outbound_voyage",
						"dtVessel.eta",
						"dtVessel.etd",
						"dtVessel.vessel_name"
					)
					.leftJoin("dt_vessel_visit as dtVessel", "dtVessel.voyagekey", "dtOrder.voyagekey")
					.where({ "dtOrder.order_no": req.body.order_no, "dtOrder.gate_chk": 0 })
					.orderBy([
						"dtOrder.voyagekey",
						"dtOrder.order_no",
						"dtOrder.pin_code",
						"dtOrder.cntrno",
						"dtOrder.cntrsztp",
						"dtOrder.customer_code",
						"dtOrder.method_code",
						"dtOrder.class_code",
						"dtOrder.billoflading",
						"dtOrder.house_bill",
						"dtOrder.booking_fwd",
						"dtOrder.booking_no",
						"dtVessel.inbound_voyage",
						"dtVessel.outbound_voyage",
						"dtVessel.eta",
						"dtVessel.etd",
						"dtVessel.vessel_name"
					])
					.then(data => {
						if (data && data.length) {
							return data.map(item => {
								return {
									...item,
									pin_code: item.pin_code.split('-')[0]
								};
							})
						} else {
							response['iStatus'] = false;
							response['iMessage'] = 'Không có dữ liệu!';
							return response;
						}
					})
					.catch(err => {
						response['iStatus'] = false;
						response['iPayload'] = err;
						response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
						return response;
					});
			} else if (obj.pin_code) {
				dtOrder = await this.cfsglobal
					.from("dt_order as dtOrder")
					.select(
						"dtOrder.voyagekey",
						"dtOrder.order_no",
						"dtOrder.pin_code",
						"dtOrder.cntrno",
						"dtOrder.cntrsztp",
						"dtOrder.customer_code",
						"dtOrder.method_code",
						"dtOrder.class_code",
						"dtOrder.billoflading",
						"dtOrder.house_bill",
						"dtOrder.booking_fwd",
						"dtOrder.booking_no",
						"dtVessel.inbound_voyage",
						"dtVessel.outbound_voyage",
						"dtVessel.eta",
						"dtVessel.etd",
						"dtVessel.vessel_name"
					)
					.leftJoin("dt_vessel_visit as dtVessel", "dtVessel.voyagekey", "dtOrder.voyagekey")
					.where("dtOrder.gate_chk", 0)
					.where("dtOrder.pin_code", "LIKE", `${req.body.pin_code}%`)
					.orderBy([
						"dtOrder.voyagekey",
						"dtOrder.order_no",
						"dtOrder.pin_code",
						"dtOrder.cntrno",
						"dtOrder.cntrsztp",
						"dtOrder.customer_code",
						"dtOrder.method_code",
						"dtOrder.class_code",
						"dtOrder.billoflading",
						"dtOrder.house_bill",
						"dtOrder.booking_fwd",
						"dtOrder.booking_no",
						"dtVessel.inbound_voyage",
						"dtVessel.outbound_voyage",
						"dtVessel.eta",
						"dtVessel.etd",
						"dtVessel.vessel_name"
					])
					.then(data => {
						if (data && data.length) {
							data.map(item => {
								return {
									...item,
									pin_code: item.pin_code.split('-')[0]
								};
							});
						} else {
							response['iStatus'] = false;
							response['iMessage'] = 'Không có dữ liệu!';
							return response;
						}
					})
					.catch(err => {
						response['iStatus'] = false;
						response['iPayload'] = err;
						response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
						return response;
					});
			} else {
				dtOrder = await this.cfsglobal
					.from("dt_order as dtOrder")
					.select(
						"dtOrder.voyagekey",
						"dtOrder.order_no",
						"dtOrder.pin_code",
						"dtOrder.cntrno",
						"dtOrder.cntrsztp",
						"dtOrder.customer_code",
						"dtOrder.method_code",
						"dtOrder.class_code",
						"dtOrder.billoflading",
						"dtOrder.house_bill",
						"dtOrder.booking_fwd",
						"dtOrder.booking_no",
						"dtVessel.inbound_voyage",
						"dtVessel.outbound_voyage",
						"dtVessel.eta",
						"dtVessel.etd",
						"dtVessel.vessel_name"
					)
					.leftJoin("dt_vessel_visit as dtVessel", "dtVessel.voyagekey", "dtOrder.voyagekey")
					.where({ "dtOrder.cntrno": req.body.cntrno, "dtOrder.gate_chk": 0 })
					.orderBy([
						"dtOrder.voyagekey",
						"dtOrder.order_no",
						"dtOrder.pin_code",
						"dtOrder.cntrno",
						"dtOrder.cntrsztp",
						"dtOrder.customer_code",
						"dtOrder.method_code",
						"dtOrder.class_code",
						"dtOrder.billoflading",
						"dtOrder.house_bill",
						"dtOrder.booking_fwd",
						"dtOrder.booking_no",
						"dtVessel.inbound_voyage",
						"dtVessel.outbound_voyage",
						"dtVessel.eta",
						"dtVessel.etd",
						"dtVessel.vessel_name"
					])
					.then(data => {
						if (data && data.length) {
							data.map(item => {
								return {
									...item,
									pin_code: item.pin_code.split('-')[0]
								};
							});
						} else {
							response['iStatus'] = false;
							response['iMessage'] = 'Không có dữ liệu!';
							return response;
						}
					})
					.catch(err => {
						response['iStatus'] = false;
						response['iPayload'] = err;
						response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
						return response;
					});
			}
			if (dtOrder && dtOrder.length) {
				response['iPayload'] = dtOrder[0];
				response['iStatus'] = true;
				response['iMessage'] = 'Truy vấn dữ liệu thành công!';
			} else {
				response['iStatus'] = false;
				response['iMessage'] = 'Không tìm thấy dữ liệu cần tìm!';
			}
			return response;
		} catch {
			response['iStatus'] = false;
			response['iMessage'] = 'Không thể lưu mới dữ liệu!';
			return response;
		}
	}

	async getDtOrderHousebill(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.order_no) {
				response["iStatus"] = false;
				response["iMessage"] = 'Vui lòng cung cấp số lệnh!';
				return response;
			}
			var query = await this.cfsglobal
				.from("dt_order as dtOrder")
				.select(
					"dtOrder.id",
					"dtOrder.voyagekey",
					"dtOrder.class_code",
					"dtOrder.order_no",
					"dtOrder.pin_code",
					"dtOrder.customer_code",
					"dtOrder.acc_type",
					"dtOrder.acc_cd",
					"dtOrder.delivery_order",
					"dtOrder.billoflading",
					"dtOrder.booking_no",
					"dtOrder.cntrno",
					"dtOrder.cntrsztp",
					"dtOrder.item_type_code",
					"dtOrder.item_type_code_cntr",
					"dtOrder.method_code",
					"dtOrder.issue_date",
					"dtOrder.exp_date",
					"dtOrder.house_bill",
					"dtOrder.booking_fwd",
					"dtOrder.cargo_piece",
					"dtOrder.unit_code",
					"dtOrder.cargo_weight",
					"dtOrder.cbm",
					"dtOrder.rt",
					"dtOrder.lot_no",
					"dtOrder.note",
					"dtOrder.draft_no",
					"dtOrder.inv_no",
					"dtOrder.gate_chk",
					"dtOrder.quantity_chk",
					"dtOrder.owner_represent",
					"dtOrder.owner_phone",
					"dtOrder.owner",
					"dtOrder.payment_chk",
					"dtOrder.commoditydescription",
					"dtVessel.vessel_name",
					"dtVessel.inbound_voyage",
					"dtVessel.outbound_voyage",
					"dtVessel.eta",
					"dtVessel.etd"
				)
				.leftJoin("dt_vessel_visit as dtVessel", "dtVessel.voyagekey", "dtOrder.voyagekey")
				.where("dtOrder.order_no", req.body.order_no)
				.catch(err => console.log(err)) || [];
			if (query && !query.length) {
				response["iStatus"] = false;
				response["iMessage"] = "Không có dữ liệu!";
				return response;
			}
			// query = query.map(item => {
			// 	return {
			// 		...item,
			// 		vesselInfo: [{
			// 			vessel_name: item.vessel_name,
			// 			inbound_voyage: item.inbound_voyage,
			// 			outbound_voyage: item.outbound_voyage,
			// 			eta: item.eta,
			// 			etd: item.etd
			// 		}]
			// 	};
			// });
			const dtField = req.body.class_code === 1 ? 'house_bill' : 'booking_fwd';
			const dtValue = query.map(item => item[dtField]);
			const dtPromise = dtValue.map(async (dtItem, index) => {
				let sum = 0;
				const dtJobQuantity = await this.cfsglobal
					.from("job_quantity_check")
					.select(
						"id",
						"voyagekey",
						"warehouse_code",
						"class_code",
						"method_code",
						"truck_no",
						"cntrno",
						"order_no",
						"pin_code",
						"house_bill",
						"booking_fwd",
						"booking_no",
						"item_type_code",
						"estimated_cargo_piece",
						"actual_cargo_piece",
						"actual_unit",
						"actual_cargo_weight",
						"seq",
						"pallet_no",
						"start_date",
						"finish_date",
						"is_final",
						"job_status",
						"note"
					)
					.where({ order_no: req.body.order_no, [dtField]: dtItem, job_status: 'C' })
					.then(data => {
						data.map(item => {
							return sum += item.actual_cargo_piece;
						});
					})
					.catch(err => console.log(err)) || [];
				dtJobQuantity.forEach(item => sum += item.actual_cargo_piece);
				query[index] = {
					...query[index],
					total_actual_cargo_piece: sum,
				}
			});
			await Promise.all(dtPromise);
			response['iStatus'] = true;
			response['iPayload'] = query;
			response['iMessage'] = "Truy vấn dữ liệu thành công!";
			return response;
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
			return response;
		}
	}

	async getDtOrder(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let whereObj = {};
			let dtOrder = [];
			req.body.order_no ? whereObj['order_no'] = req.body.order_no : '';
			req.body.billoflading ? whereObj['billoflading'] = req.body.billoflading : '';
			req.body.booking_no ? whereObj['booking_no'] = req.body.booking_no : '';
			if (!Object.keys(whereObj).length) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp số bill hoặc số booking!';
				return response;
			}
			var query = await this.cfsglobal
				.from("dt_order as dtOrder")
				.select(
					"dtOrder.voyagekey",
					"dtOrder.order_no",
					"dtOrder.billoflading",
					"dtOrder.booking_no",
					"dtOrder.class_code",
					"dtOrder.method_code",
					"dtOrder.cntrno",
					"dtOrder.owner",
					"dtOrder.owner_phone",
					"dtOrder.exp_date",
					"dtOrder.item_type_code",
					"dtOrder.acc_type",
					"dtOrder.house_bill",
					"dtOrder.booking_fwd",
					"dtOrder.cargo_piece",
					"dtOrder.unit_code",
					"dtOrder.cargo_weight",
					"dtOrder.cbm",
					"dtOrder.note",
					"dtOrder.cntrsztp",
					"bsCustomer.customer_name",
					"dtOrder.lot_no",
					"dtOrder.gate_chk",
					"dtOrder.quantity_chk",
					"dtOrder.payment_chk",
					"dtVessel.vessel_name",
					"dtVessel.inbound_voyage",
					"dtVessel.outbound_voyage",
					"dtVessel.eta",
					"dtVessel.etd"
				)
				.leftJoin("dt_vessel_visit as dtVessel", "dtVessel.voyagekey", "dtOrder.voyagekey")
				.leftJoin("bs_customer as bsCustomer", "bsCustomer.customer_code", "dtOrder.customer_code")
				.where(whereObj)
				.catch(err => console.log(err)) || [];
			if (query && !query.length) {
				response["iStatus"] = false;
				response["iMessage"] = "Không có dữ liệu!";
				return response;
			}
			let whereObjPkg = {
				voyagekey: query[0].voyagekey,
				class_code: query[0].class_code,
				[query[0].class_code === 1 ? 'house_bill' : 'booking_fwd']: query[0].class_code === 1 ? query[0].house_bill : query[0].booking_fwd
			};
			let dtPkgManifestld = await this.cfsglobal
				.from("dt_package_mnf_ld")
				.select("shipmarks", "declare_no")
				.where(whereObjPkg)
				.catch(err => console.log(err)) || [];

			for (let i = 0; i < query.length; i++) {
				dtOrder.push(Object.assign(query[i], { shipmarks: dtPkgManifestld[0]?.shipmarks, declare_no: dtPkgManifestld[0]?.declare_no }));
			}
			response['iStatus'] = true;
			response['iPayload'] = dtOrder;
			response['iMessage'] = 'Truy vấn dữ liệu thành công!';
			return response;
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Truy vấn dữ liệu thất bại!";
			return response;
		}
	}

	async getInfoDtOrder(req) {
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

		var query = await this.cfsglobal
			.from("dt_order as dtOrder")
			.select(
				"dtOrder.voyagekey",
				"dtOrder.order_no",
				"dtOrder.billoflading",
				"dtOrder.booking_no",
				"dtOrder.class_code",
				"dtOrder.cntrno",
				"dtOrder.owner",
				"dtOrder.owner_phone",
				"dtOrder.item_type_code",
				"dtOrder.house_bill",
				"dtOrder.booking_fwd",
				"dtOrder.cargo_piece",
				"dtOrder.cbm",
				"dtOrder.note",
				"bsCustomer.customer_name",
				"dtOrder.commoditydescription",
				"dtOrder.rt",
				"dtOrder.inv_no",
				"dtOrder.pin_code"
			)
			.leftJoin("bs_customer as bsCustomer", "bsCustomer.customer_code", "dtOrder.customer_code")
			.where("dtOrder.order_no", req.body.order_no)
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			let total_rt = query.map(item => item.cbm);
			let dtHeader = query.map(item => {
				return {
					class_code: item[0].class_code || '',
					order_no: item[0].order_no || '',
					voyagekey: item[0].voyagekey || '',
					cntrno: item[0].cntrno || '',
					billoflading: item[0].billoflading || '',
					booking_no: item[0].booking_no || '',
					total_rt: total_rt / 1.5,
					owner: item[0].owner || '',
					customer_name: item[0].customer_name || '',
					inv_no: item[0].inv_no || '',
					owner_phone: item[0].owner_phone || '',
					note: item[0].note || ''
				};
			})
			response["iStatus"] = true;
			response["iPayload"] = { header: dtHeader, details: query };
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async confirmOrderINDtOrder(req) {
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
		if (!req.body.class_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!';
			return response;
		}
		let whereObj = {
			order_no: req.body.order_no,
			class_code: req.body.class_code,
			[req.body.class_code === 1 ? 'house_bill' : 'booking_fwd']: req.body.class_code === 1 ? req.body.house_bill : req.body.booking_fwd
		};
		var query = await this.cfsglobal
			.from("dt_order")
			.select(
				"id",
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
				"draft_no",
				"inv_no",
				"gate_chk",
				"quantity_chk",
				"owner_represent",
				"owner_phone",
				"owner",
				"payment_chk",
				"commoditydescription"
			)
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (query && !query.length) {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
			return response;
		}
		try {
			await this.cfsglobal
				.from("job_quantity_check")
				.where(whereObj)
				.update({
					note: req.body.note || null,
					is_final: 1,
					update_by: req.body.update_by || null,
					update_date: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			let id = query.map(item => item.id);
			await this.cfsglobal
				.from("dt_order")
				.whereIn("id", id)
				.update({
					quantity_chk: 1,
					update_by: req.body.update_by || null,
					update_date: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			response['iStatus'] = true;
			response['iMessage'] = "Lưu dữ liệu thành công!";
			response['iPayload'] = req.body;
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async confirmOrderOUTDtOrder(req) {
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
		if (!req.body.class_code) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!';
			return response;
		}
		let whereObj = {
			order_no: req.body.order_no,
			class_code: req.body.class_code
		};
		let whereObjQuantity = {
			...whereObj,
			[whereObj.class_code === 1 ? 'house_bill' : 'booking_fwd']: whereObj.class_code === 1 ? req.body.house_bill : req.body.booking_fwd
		};
		try {
			await this.cfsglobal
				.from("job_quantity_check")
				.where(whereObjQuantity)
				.update("is_final", 1);
			let query = await this.cfsglobal
				.from("dt_order")
				.select(
					"id",
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
					"draft_no",
					"inv_no",
					"gate_chk",
					"quantity_chk",
					"owner_represent",
					"owner_phone",
					"owner",
					"payment_chk",
					"commoditydescription"
				)
				.where(whereObj)
				.catch(err => console.log(err)) || [];
			if (query && !query.length) {
				response["iStatus"] = false;
				response["iMessage"] = "Không có dữ liệu!";
				return response;
			}
			let id = query.map(item => item.id);
			await this.cfsglobal
				.from("dt_package_stock")
				.where(whereObj)
				.update({
					status: 'O',
					update_by: req.body.update_by || null,
					update_date: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			await this.cfsglobal
				.from("job_quantity_check")
				.where(whereObj)
				.update({
					note: req.body.note || null,
					update_by: req.body.update_by || null,
					update_date: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			await this.cfsglobal
				.from("dt_order")
				.whereIn("id", id)
				.update({
					quantity_chk: 1,
					update_by: req.body.update_by || null,
					update_date: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			response['iStatus'] = true;
			response['iMessage'] = "Lưu dữ liệu thành công!";
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async saveDtOrder(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		const dttime_in = await this.cfsglobal
			.from("dt_package_stock")
			.select("house_bill", "voyagekey", "time_in")
			.where({ house_bill: req.body[0].house_bill, voyagekey: req.body[0].voyagekey })
			.catch(err => console.log(err)) || [];

		return await Promise.all(req.body.map(async (item, index) => {
			let countPIN = `000${index + 1}`.substr(-3);
			if (!item.voyagekey) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!'
				return response;
			}
			if (!item.class_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp hướng!'
				return response;
			}
			if (!item.method_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã phương án!'
				return response;
			}
			if (item.method_code !== 'NKX' && !item.acc_cd) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã và hình thức thanh toán!'
				return response;
			}
			if (!item.item_type_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã loại hàng hóa!';
				return response;
			}
			if (!item.owner) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp thông tin chủ hàng!';
				return response;
			}
			if (!item.owner_represent) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp thông tin người đại diện!';
				return response;
			}
			if (!item.owner_phone) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp thông tin số điện thoại!';
				return response;
			}
			if (!item.create_by) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
				return response;
			}
			//Tạo pin_code
			let pinCode = `${moment().format('YYMMDD')}`;
			try {
				await this.cfsglobal
					.from("dt_order")
					.select("pin_code")
					.whereLike("pin_code", `${pinCode}%`)
					.orderBy("pin_code", "DESC")
					.then(data => {
						if (data && data.length) {
							let dtPin = data[0].pin_code?.slice(6, 9);
							dtPin = `000${Number(dtPin) + 1}`.substr(-3);
							pinCode = `${pinCode}${dtPin}-${countPIN}`;
						} else {
							return pinCode = `${pinCode}001-${countPIN}`;
						}
					});
				//Sinh order_no
				let orderNo = `${item.method_code}${item.class_code}${moment().format('YYMMDD')}`;
				await this.cfsglobal
					.from("dt_order")
					.select("order_no")
					.whereLike("order_no", `${orderNo}%`)
					.orderBy("order_no", "DESC")
					.then(data => {
						if (data && data.length) {
							let dtOrder = data[0].order_no?.substr(-3);
							dtOrder = `000${Number(dtOrder) + 1}`.substr(-3);
							orderNo = `${orderNo}${dtOrder}`;
						} else {
							return orderNo = `${orderNo}001`;
						}
					});
				let obj = {
					voyagekey: item.voyagekey || null,
					class_code: item.class_code || null,
					order_no: orderNo,
					pin_code: pinCode,
					customer_code: item.customer_code || null,
					acc_type: item.acc_type || null,
					acc_cd: item.acc_cd || null,
					delivery_order: item.delivery_order || null,
					billoflading: item.billoflading || null,
					booking_no: item.booking_no || null,
					cntrno: item.cntrno || null,
					cntrsztp: item.cntrsztp || null,
					item_type_code: item.item_type_code || null,
					item_type_code_cntr: item.item_type_code_cntr || null,
					method_code: item.method_code || null,
					issue_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					exp_date: moment(item.exp_date).format('YYYY-MM-DD HH:mm:ss'),
					house_bill: item.house_bill || null,
					booking_fwd: item.booking_fwd || null,
					cargo_piece: item.cargo_piece || null,
					unit_code: item.unit_code || null,
					cargo_weight: item.cargo_weight || null,
					cbm: item.cbm || null,
					rt: item.rt || null,
					lot_no: item.lot_no || null,
					note: item.note || null,
					draft_no: item.draft_no || null,
					inv_no: item.inv_no || null,
					gate_chk: item.gate_chk || 0,
					quantity_chk: item.quantity_chk || 0,
					payment_chk: item.payment_chk || 0,
					owner: item.owner || null,
					owner_represent: item.owner_represent || null,
					owner_phone: item.owner_phone || null,
					commoditydescription: item.commoditydescription || null,
					create_by: item.create_by
				};
				let whereObj = {
					'dtPkgManifestld.voyagekey': obj.voyagekey,
					'dtPkgManifestld.class_code': obj.class_code,
					[obj.class_code === 1 ? 'dtPkgManifestld.house_bill' : 'dtPkgManifestld.booking_fwd']: obj.class_code === 1 ? obj.house_bill : obj.booking_fwd
				};
				let dtPkgManifest = await this.cfsglobal
					.from("dt_package_mnf_ld as dtPkgManifestld")
					.select("dtPkgManifestld.shipmarks", "dtPkgManifestld.declare_no", "dtPkgManifestld.voyagekey", "dtVessel.vessel_name")
					.leftJoin("dt_vessel_visit as dtVessel", "dtVessel.voyagekey", "dtPkgManifestld.voyagekey")
					.where(whereObj)
					.catch(err => console.log(err)) || [];
				if (dtPkgManifest && !dtPkgManifest.length) {
					response['iStatus'] = false;
					response['iMessage'] = 'Không có dữ liệu!';
					return response;
				}
				await this.cfsglobal
					.from("dt_order")
					.returning('*')
					.insert(obj)
					.then(data => {
						data.map(item => {
							response['iStatus'] = true;
							response['iPayload'].push(Object.assign({
								shipmarks: dtPkgManifest[0]?.shipmarks,
								declare_no: dtPkgManifest[0]?.declare_no,
								vessel_name: dtPkgManifest[0]?.vessel_name,
								time_in: dttime_in[0]?.time_in || null,
								time_in_day: Math.floor((new Date(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')) - new Date(dttime_in[0]?.time_in)) / 86400000) || 0,
							}, item));
							response['iMessage'] = 'Lưu dữ liệu thành công!';
						});
					});
			} catch (err) {
				response['iStatus'] = false;
				response['iPayload'] = err;
				response['iMessage'] = 'Không thể lưu mới dữ liệu!';
			}
		})).then(async returnValue => {
			if (response['iStatus'] && req.body[0].method_code !== 'NKX') {
				try {
					let checkCode = await this.cfsglobal
						.from("inv_dft")
						.select("id", "draft_inv_no", "inv_no", "draft_inv_date", "ref_no", "payer_type", "payer", "amount", "vat", "dis_amt", "remark", "payment_status", "currencyid", "rate", "inv_type", "tplt_nm", "is_manual_inv", "tamount")
						.orderBy("draft_inv_no", "desc")
						.catch(err => console.log(err)) || [];

					if (checkCode && !checkCode.length) {
						response['iStatus'] = false;
						response['iMessage'] = 'Không có dữ liệu!';
						return response;
					}
					let amount = req.body[0]?.inv_draft?.datainvDraft?.amount;
					let vat = req.body[0]?.inv_draft?.datainvDraft?.vat;
					let tAmount = req.body[0]?.inv_draft?.datainvDraft?.tamount;
					let idxDraftInvNo = parseInt(checkCode[0]?.draft_inv_no.substr(8));
					let currencyCode = req.body[0]?.inv_draft?.datainvDraft?.currency_code;
					let customerCode = req.body[0]?.inv_draft?.datainvDraft?.customer_code;
					let accType = req.body[0]?.inv_draft?.datainvDraft?.acc_type;

					let invDftData = {
						draft_inv_no: idxDraftInvNo
							? 'DR' +
							'/' +
							moment(new Date()).format('YYYY') +
							'/' +
							(parseInt('0000000', 10) + idxDraftInvNo + 1)
								.toString()
								.padStart('0000000'.length, '0')
							: 'DR' +
							'/' +
							moment(new Date()).format('YYYY') +
							'/' +
							`000000${'1'}`,
						draft_inv_date: moment().format('YYYY-MM-DD HH:mm:ss'),
						ref_no: response['iPayload'][0]?.order_no,
						payer_type: accType,
						payer: customerCode,
						amount: amount,
						vat: vat,
						payment_status: 'U',
						currencyid: currencyCode,
						tplt_nm: 'CFS',
						tamount: tAmount,
						create_by: req.body[0]?.create_by,
					};
					await this.cfsglobal
						.from("inv_dft")
						.returning("*")
						.insert(invDftData);
					let dataDetail = req.body[0]?.inv_draft?.detail_draft.map((itemDetail, idx) => {
						let objINV_DETAIL = {
							draft_inv_no: invDftData.draft_inv_no,
							seq: idx + 1,
							trf_code: itemDetail.trf_code,
							inv_unit: itemDetail.unit_code,
							ix_cd: itemDetail.class_code,
							cargo_type: itemDetail.item_type_code,
							amount: itemDetail.amount.toLocaleString().replace(/\D/g, ''),
							vat: itemDetail.vat.toLocaleString().replace(/\D/g, ''),
							vat_rate: parseFloat(itemDetail.vat_rate),
							tamount: itemDetail.tamount.toLocaleString().replace(/\D/g, ''),
							sz: itemDetail.cntrsztp,
							qty: Number(itemDetail.qty),
							unit_rate: itemDetail.unit_rate.toLocaleString().replace(/\D/g, ''),
							trf_desc: itemDetail.trf_desc,
							job_type: itemDetail.method_code,
							vat_chk: itemDetail.vat_chk,
							create_by: response['iPayload'][0]?.create_by,
						};
						return objINV_DETAIL;
					});
					await this.cfsglobal
						.from("inv_dft_dtl")
						.returning("*")
						.insert(dataDetail);
					response['iPayload'] = {
						order_noInfo: response['iPayload'],
						inv_vatInfo: {}
					}
				} catch (err) {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
				}
			}
			return response;
		});
	}

	async saveOrderDtOder(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		if (!req.body.order_no) {
			response['iStatus'] = false;
			response['iMessage'] = `Vui lòng cung cấp số lệnh!`;
			return response;
		}
		let dataUpdate = {};
		req.body.owner_phone ? (dataUpdate['owner_phone'] = req.body.owner_phone) : '';
		req.body.note ? (dataUpdate['note'] = req.body.note) : '';
		try {
			await this.cfsglobal
				.from("dt_order")
				.where("order_no", req.body.order_no)
				.update(dataUpdate);
			response['iStatus'] = true;
			response['iMessage'] = `Cập nhật dữ liệu thành công!`;
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
			return response;
		}
		return response;
	}
}