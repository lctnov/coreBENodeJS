import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class DtPkgStockModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadPkgStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let dtPkgStock = await this.cfsglobal
			.from("DT_PACKAGE_STOCK AS dtPkgStock")
			.select("dtPkgStock.ID", "dtPkgStock.WAREHOUSE_CODE", "dtPkgStock.CLASS_CODE", "dtPkgStock.CUSTOMER_TYPE_CODE", "dtPkgStock.CUSTOMER_CODE", "dtPkgStock.HOUSE_BILL", "dtPkgStock.BOOKING_FWD", "dtPkgStock.CNTRNO", "dtPkgStock.LOT_NO", "dtPkgStock.STATUS", "dtPkgStock.TIME_IN", "dtPkgStock.TIME_OUT", "dtPkgStock.CARGO_PIECE", "dtPkgStock.UNIT_CODE", "dtPkgStock.CARGO_WEIGHT", "dtPkgStock.CBM", "dtPkgStock.TLHQ", "dtPkgStock.GETIN_HQ", "dtPkgStock.VOYAGEKEY", "dtPkgStock.GETOUT_HQ", "dtPkgStock.TKHN_NO", "dtPkgStock.TKHX_NO", "dtPkgStock.CUSTOMER_CAS", "dtPkgStock.NOTE", "dtPkgManifestld.ITEM_TYPE_CODE", "dtVessel.VESSEL_NAME", 'dtVessel.INBOUND_VOYAGE', 'dtVessel.OUTBOUND_VOYAGE', 'dtVessel.ETA', 'dtVessel.ETD')
			.leftJoin("DT_PACKAGE_MNF_LD AS dtPkgManifestld", "dtPkgManifestld.VOYAGEKEY", "dtPkgStock.VOYAGEKEY")
			.leftJoin("DT_VESSEL_VISIT AS dtVessel", "dtVessel.VOYAGEKEY", "dtPkgStock.VOYAGEKEY")
			.catch(err => console.log(err)) || [];
		if (dtPkgStock && dtPkgStock.length) {
			dtPkgStock = dtPkgStock.forEach(item => {
				return {
					...item,
					VESSEL_TRIP: item.CLASS_CODE === 1 ? item.INBOUND_VOYAGE : item.OUTBOUND_VOYAGE,
					VESSEL_DAY: item.CLASS_CODE === 1 ? item.ETA : item.ETD
				}
			});
			response['iPayload'] = dtPkgStock;
			response['iStatus'] = true;
			response['iMessage'] = 'Nạp dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		return response;
	}
	//Thoilc(*Note)-Màn hình kiểm đếm xuất
	async loadPkgStockOut(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.ORDER_NO) {
			response['Status'] = false;
			response['Message'] = "Vui lòng cung cấp số lệnh!";
			return response;
		}
		let query = await this.cfsglobal
			.from("DT_PACKAGE_STOCK")
			.select("ID", "WAREHOUSE_CODE", "CLASS_CODE", "CUSTOMER_TYPE_CODE", "CUSTOMER_CODE", "HOUSE_BILL", "BOOKING_FWD", "CNTRNO", "LOT_NO", "STATUS", "TIME_IN", "TIME_OUT", "CARGO_PIECE", "UNIT_CODE", "CARGO_WEIGHT", "CBM", "TLHQ", "GETIN_HQ", "VOYAGEKEY", "GETOUT_HQ", "TKHN_NO", "TKHX_NO", "CUSTOMER_CAS", "NOTE")
			.where("ORDER_NO", req.body.ORDER_NO)
			.catch(err => console.log(err)) || [];
		if (query && query.length) {
			response['iStatus'] = true;
			response['iPayload'] = query;
			response['iMessage'] = "Nạp dữ liệu thành công!";
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không có dữ liệu!";
		}
		if (response['iStatus']) {
			let dtHousebill = query.map((item) => item.HOUSE_BILL);
			for (let i = 0; i < dtHousebill.length; i++) {
				let sum = 0, note;
				await this.cfsglobal
					.from("JOB_QUANTITY_CHECK")
					.select("ACTUAL_CARGO_PIECE")
					.where({ ORDER_NO: req.body.ORDER_NO, HOUSE_BILL: dtHousebill[i], JOB_STATUS: 'C' })
					.then(data => {
						if (data && data.length) {
							data.map(item => {
								sum += Number(item.ACTUAL_CARGO_PIECE);
							});
						}
					})
					.catch(err => console.log(err));
				await this.cfsglobal
					.from("JOB_QUANTITY_CHECK")
					.select("NOTE")
					.where({ HOUSE_BILL: dtHousebill[i], METHOD_CODE: 'NKN' })
					.then(data => {
						if (data && data.length) {
							data.map(item => {
								note = item.NOTE;
							});
						}
					})
					.catch(err => console.log(err));
				response['iPayload'][i] = { ...query[i], total_ACTUAL_CARGO_PIECE: sum, NOTE: note };
			}
		}
		return response;
	}

	async loadPkgStockWarehouse(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.ORDER_NO) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp số lệnh!";
			return response;
		}
		let query = await this.cfsglobal
			.from("DT_PACKAGE_STOCK")
			.select("ID", "WAREHOUSE_CODE", "CLASS_CODE", "CUSTOMER_TYPE_CODE", "CUSTOMER_CODE", "HOUSE_BILL", "BOOKING_FWD", "CNTRNO", "LOT_NO", "STATUS", "TIME_IN", "TIME_OUT", "CARGO_PIECE", "UNIT_CODE", "CARGO_WEIGHT", "CBM", "TLHQ", "GETIN_HQ", "VOYAGEKEY", "GETOUT_HQ", "TKHN_NO", "TKHX_NO", "CUSTOMER_CAS", "NOTE")
			.where("ORDER_NO", req.body.ORDER_NO)
			.catch(err => console.log(err)) || [];
		if (query && query.length) {
			response['iStatus'] = true;
			response['iPayload'] = query;
			response['iMessage'] = "Nạp dữ liệu thành công!";
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không có dữ liệu!";
		}
		if (response['iStatus']) {
			let dtBookingfwd = query.map((item) => item.BOOKING_FWD);
			for (let i = 0; i < dtBookingfwd.length; i++) {
				let sum = 0, note;
				await this.cfsglobal
					.from("JOB_QUANTITY_CHECK")
					.select("ACTUAL_CARGO_PIECE")
					.where({ ORDER_NO: req.body.ORDER_NO, BOOKING_FWD: dtBookingfwd[i], JOB_STATUS: 'C' })
					.then(data => {
						if (data && data.length) {
							data.map(item => {
								sum += Number(item.ACTUAL_CARGO_PIECE);
							});
						}
					})
					.catch(err => console.log(err));
				response['iPayload'][i] = { ...query[i], total_ACTUAL_CARGO_PIECE: sum, NOTE: note };
			}
		}
		return response;
	}

	async loadPkgStockPallet(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.HB_BK) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số HOUSE_BILL hoặc BOOKING_FWD!';
			return response;
		}
		let dtPkgStock = await this.cfsglobal
			.from("DT_PACKAGE_STOCK AS dtPkgStock")
			.select("dtPkgStock.ID", "dtPkgStock.HOUSE_BILL", "dtPkgStock.BOOKING_FWD", "dtVessel.VOYAGEKEY", "dtVessel.VESSEL_NAME", "dtVessel.INBOUND_VOYAGE", "dtVessel.OUTBOUND_VOYAGE", "dtVessel.ETA", "dtVessel.ETD", 'dtPalletStock.CARGO_PIECE', "dtPalletStock.PALLET_NO", "dtPalletStock.BLOCK", "dtPalletStock.SLOT", "dtPalletStock.TIER", "dtPalletStock.IDREF_STOCK", 'dtPkgStock.TIME_IN')
			.leftJoin("DT_PALLET_STOCK AS dtPalletStock", "dtPalletStock.IDREF_STOCK", "dtPkgStock.ID")
			.leftJoin("DT_VESSEL_VISIT AS dtVessel", "dtVessel.VOYAGEKEY", "dtPkgStock.VOYAGEKEY")
			.orWhere('dtPkgStock.HOUSE_BILL', req.body.HB_BK)
			.orWhere('dtPkgStock.BOOKING_FWD', req.body.HB_BK)
			.catch(err => console.log(err)) || [];
		if (dtPkgStock && dtPkgStock.length) {
			dtPkgStock = dtPkgStock.map(item => {
				return {
					...item,
					vesselVisit: {
						VOYAGEKEY: item.VOYAGEKEY,
						VESSEL_NAME: item.VESSEL_NAME,
						INBOUND_VOYAGE: item.INBOUND_VOYAGE,
						OUTBOUND_VOYAGE: item.OUTBOUND_VOYAGE,
						ETA: item.ETA,
						ETD: item.ETD
					},
					palletStockInfo: {
						PALLET_NO: item.PALLET_NO,
						CARGO_PIECE: item.CARGO_PIECE,
						BLOCK: item.BLOCK,
						SLOT: item.SLOT,
						TIER: item.TIER,
						IDREF_STOCK: item.IDREF_STOCK
					}
				}
			});
			response['iPayload'] = dtPkgStock[0];
			response['iStatus'] = true;
			response['iMessage'] = 'Nạp dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		return response;
	}

	async getPkgStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.HOUSE_BILL) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số Housebill!';
			return response;
		}
		if (!req.body.VOYAGEKEY) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!';
			return response;
		}
		let whereObj = {
			HOUSE_BILL: req.body.HOUSE_BILL || null,
			VOYAGEKEY: req.body.VOYAGEKEY || null,
		};
		let checkCode = await this.cfsglobal
			.from("DT_ORDER")
			.select("GATE_CHK")
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (checkCode && checkCode.length === 0) {
			response['flag'] = false;
		} else if (checkCode.filter(item => item.GATE_CHK === false).length !== 0) {
			response['flag'] = true;
		} else {
			response['flag'] = false;
		}
		if (response['flag']) {
			response['iStatus'] = false;
			response['iMessage'] = `Số House Bill : ${req.body.HOUSE_BILL} đã làm lệnh!`;
			return response;
		}
		let dtPkgStock = await this.cfsglobal
			.from("DT_PACKAGE_STOCK")
			.select("ID", "VOYAGEKEY", "WAREHOUSE_CODE", "CLASS_CODE", "ORDER_NO", "PIN_CODE", "CUSTOMER_TYPE_CODE", "CUSTOMER_CODE", "HOUSE_BILL", "BOOKING_FWD", "CNTRNO", "LOT_NO", "STATUS", "TIME_IN", "TIME_OUT", "CARGO_PIECE", "UNIT_CODE", "CARGO_WEIGHT", "CBM", "TLHQ", "GETIN_HQ", "GETOUT_HQ", "TKHN_NO", "TKHX_NO", "CUSTOMER_CAS", "NOTE", "ITEM_TYPE_CODE", "bsCustomer.CUSTOMER_NAME", "dtOrder.ITEM_TYPE_CODE_CNTR", "dtOrder.CNTRSZTP")
			.leftJoin("BS_CUSTOMER AS bsCustomer", "bsCustomer.CUSTOMER_CODE", "CUSTOMER_CODE")
			.leftJoin("DT_ORDER AS dtOrder", "dtOrder.ORDER_NO", "ORDER_NO")
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (dtPkgStock && !dtPkgStock.length) {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		let TLHQHousebill = dtPkgStock.forEach(item => !item.HOUSE_BILL);
		if (TLHQHousebill && TLHQHousebill.length) {
			response['iStatus'] = false;
			response['iPayload'] = TLHQHousebill;
			response['iMessage'] = `Vui lòng xác nhận thanh lí hải quan cho số Bill :${TLHQHousebill}`
		} else {
			response['iStatus'] = true;
			response['iPayload'] = dtPkgStock;
			response['iMessage'] = 'Nạp dữ liệu thành công!';
		}
		return response;
	}

	async getPkgStockPallet(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.CNTRNO) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp số container!";
			return response;
		}
		let dtWhere = [];
		let whereObj = {
			CNTRNO: req.body.CNTRNO || '',
			CLASS_CODE: req.body.CLASS_CODE || '',
			STATUS: req.body.STATUS || '',
		};
		let _from = req.body.fromDate ? moment(req.body.fromDate).startOf('day').format('YYYY-MM-DD HH:mm:ss') : '';
		let _to = req.body.toDate ? moment(req.body.toDate).endOf('day').format('YYYY-MM-DD HH:mm:ss') : '';
		Object.keys(whereObj).map(key => {
			dtWhere['dtPkgStock.' + key] = whereObj[key];
		});
		let dtPkgStock = await this.cfsglobal
			.from("DT_PACKAGE_STOCK AS dtPkgStock")
			.select("dtPkgStock.ID", "dtPkgStock.VOYAGEKEY", "dtPkgStock.WAREHOUSE_CODE", "dtPkgStock.CLASS_CODE", "dtPkgStock.ORDER_NO", "dtPkgStock.PIN_CODE", "dtPkgStock.CUSTOMER_TYPE_CODE", "dtPkgStock.CUSTOMER_CODE", "dtPkgStock.HOUSE_BILL", "dtPkgStock.BOOKING_FWD", "dtPkgStock.CNTRNO", "dtPkgStock.LOT_NO", "dtPkgStock.STATUS", "dtPkgStock.TIME_IN", "dtPkgStock.TIME_OUT", "dtPkgStock.UNIT_CODE", "dtPkgStock.CARGO_WEIGHT", "dtPkgStock.ITEM_TYPE_CODE", "dtPkgStock.CBM", "dtPkgStock.TLHQ", "dtPkgStock.GETIN_HQ", "dtPkgStock.METHOD_IN", "dtPkgStock.GETOUT_HQ", "dtPkgStock.METHOD_OUT", "dtPkgStock.TKHN_NO", "dtPkgStock.TKHX_NO", "dtPkgStock.CUSTOMER_CAS", "dtPkgStock.NOTE", "dtPkgStock.COMMODITYDESCRIPTION", "dtPkgManild.ITEM_TYPE_CODE", "dtPkgManild.CUSTOMER_NAME", "dtVessel.VESSEL_NAME", "dtVessel.INBOUND_VOYAGE", "dtVessel.OUTBOUND_VOYAGE", "dtVessel.ETA", "dtVessel.ETD")
			.leftJoin("DT_PACKAGE_MNF_LD AS dtPkgManild", "dtPkgManild.VOYAGEKEY", "dtPkgStock.VOYAGEKEY")
			.leftJoin("DT_VESSEL_VISIT AS dtVessel", "dtVessel.VOYAGEKEY", "dtPkgStock.VOYAGEKEY")
			.whereBetween("dtPkgStock.TIME_IN", [_from, _to])
			.where(dtWhere)
			.catch(err => console.log(err)) || [];
		if (dtPkgStock && dtPkgStock.length) {
			dtPkgStock = dtPkgStock.map(item => {
				return {
					...item,
					VESSEL_TRIP: item.CLASS_CODE === 1 ? item.INBOUND_VOYAGE : item.OUTBOUND_VOYAGE,
					VESSEL_DAY: item.CLASS_CODE === 1 ? moment(item.ETA).format('DD/MM/YYYY HH:mm:ss') : moment(item.ETD).format('DD/MM/YYYY HH:mm:ss'),
				};
			});
			response['iPayload'] = dtPkgStock;
			response['iStatus'] = true;
			response['iMessage'] = 'Nạp dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu !';
		}
		return response;
	}

	async savePkgStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.ORDER_NO) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp mã lệnh!';
			return response;
		}
		if (!req.body.CLASS_CODE) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!'
			return response;
		}
		if (!req.body.CREATE_BY) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp tên người tạo!'
			return response;
		}
		let checkField, fieldValue;
		if (req.body.CLASS_CODE === 1) {
			checkField = "HOUSE_BILL";
			fieldValue = req.body.HOUSE_BILL;
		} else {
			checkField = "BOOKING_FWD";
			fieldValue = req.body.BOOKING_FWD;
		}
		// ------- check exist dt package stock --------
		let checkCode = await this.cfsglobal
			.from("DT_PACKAGE_STOCK")
			.select("ROWGUID")
			.where({ ORDER_NO: req.body.ORDER_NO, [checkField]: fieldValue })
			.catch(err => console.log(err)) || [];
		if (checkCode && !checkCode.length) {
			let dtPkgStock = {
				VOYAGEKEY: req.body.VOYAGEKEY || null,
				WAREHOUSE_CODE: req.body.WAREHOUSE_CODE || null,
				CLASS_CODE: req.body.CLASS_CODE || null,
				METHOD_IN: req.body.METHOD_CODE || null,
				ORDER_NO: req.body.ORDER_NO || null,
				PIN_CODE: req.body.PIN_CODE || null,
				CUSTOMER_CODE: req.body.CUSTOMER_CODE || null,
				[checkField]: fieldValue || null,
				CNTRNO: req.body.CNTRNO || null,
				LOT_NO: req.body.LOT_NO || null,
				STATUS: "I",
				TIME_IN: moment().format("YYYY-MM-DD HH:mm:ss"),
				CARGO_PIECE: req.body.CARGO_PIECE || null,
				UNIT_CODE: req.body.UNIT_CODE || null,
				CARGO_WEIGHT: req.body.CARGO_WEIGHT || null,
				ITEM_TYPE_CODE: req.body.ITEM_TYPE_CODE || null,
				CBM: req.body.CBM || null,
				CREATE_BY: req.body.CREATE_BY,
			};
			req.body.NOTE ? dtPkgStock['NOTE'] = req.body.NOTE : '';
			req.body.COMMODITYDESCRIPTION ? dtPkgStock['COMMODITYDESCRIPTION'] = req.body.COMMODITYDESCRIPTION : '';
			let valueDtPkgStock = await this.cfsglobal
				.from("DT_PACKAGE_STOCK")
				.returning("*")
				.insert(dtPkgStock)
				.catch(err => console.log(err)) || [];
			if (valueDtPkgStock && valueDtPkgStock.length) {
				response['iStatus'] = true;
				response['iPayload'] = valueDtPkgStock;
				response['iMessage'] = "Lưu dữ liệu thành công!";
			}
		} else {
			let dtID = await this.cfsglobal
				.from("DT_PACKAGE_STOCK")
				.select("ID")
				.where({ ORDER_NO: req.body.ORDER_NO, [checkField]: fieldValue })
				.catch(err => console.log(err)) || [];
			delete req.body.STT;
			delete req.body.id;
			delete req.body.isChecked;
			delete req.body.status;
			delete req.body.METHOD_CODE;
			await this.cfsglobal
				.from("DT_PACKAGE_STOCK")
				.where("ID", dtID[0].ID)
				.update({
					...req.body,
					UPDATE_BY: req.body.CREATE_BY,
					UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
				});
			response['iStatus'] = true;
			response['iPayload'] = req.body;
			response['iMessage'] = "Lưu dữ liệu thành công!";
		}
		return response;
	}

	async savePkgStockTLHQ(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!Object.values(req.body).length) {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu thay đổi!'
			return response;
		}
		try {
			await this.cfsglobal
				.from("DT_PACKAGE_STOCK")
				.where("ID", req.body.ID)
				.update({
					TLHQ: req.body.TLHQ,
					UPDATE_BY: req.body.UPDATE_BY,
					UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
				});
			response['iStatus'] = true;
			response['iMessage'] = 'Cập nhật dữ liệu thành công!'
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async changePkgStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.VOYAGEKEY) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp thông tin tàu chuyến!'
			return response;
		}
		if (!req.body.CLASS_CODE) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!'
			return response;
		}
		if (!req.body.CNTRNO && req.body.CLASS_CODE === 1) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số container!'
			return response;
		}
		let whereObj = {
			STATUS: 'S',
			VOYAGEKEY: req.body.VOYAGEKEY,
			CNTRNO: req.body.CNTRNO,
			CLASS_CODE: req.body.CLASS_CODE
		};
		req.body.HOUSE_BILL ? whereObj['HOUSE_BILL'] = req.HOUSE_BILL : '';
		req.body.BOOKING_FWD ? whereObj['BOOKING_FWD'] = req.BOOKING_FWD : '';
		let dtPkgStock = await this.cfsglobal
			.from("DT_PACKAGE_STOCK")
			.select("ID", "VOYAGEKEY", "WAREHOUSE_CODE", "CLASS_CODE", "ORDER_NO", "PIN_CODE", "CUSTOMER_TYPE_CODE", "CUSTOMER_CODE", "HOUSE_BILL", "BOOKING_FWD", "CNTRNO", "LOT_NO", "STATUS", "TIME_IN", "TIME_OUT", "CARGO_PIECE", "UNIT_CODE", "CARGO_WEIGHT", "ITEM_TYPE_CODE", "CBM", "TLHQ", "GETIN_HQ", "METHOD_IN", "GETOUT_HQ", "METHOD_OUT", "TKHN_NO", "TKHX_NO", "CUSTOMER_CAS", "NOTE", "COMMODITYDESCRIPTION")
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (dtPkgStock && dtPkgStock.length) {
			response['iStatus'] = true;
			response['iPayload'] = dtPkgStock;
			response['iMessage'] = 'Nạp dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		return response;
	}
}