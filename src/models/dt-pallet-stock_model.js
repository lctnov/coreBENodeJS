import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class DtPalletStockModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let dtPalletStock = await this.cfsglobal
			.from("DT_PALLET_STOCK")
			.select("ID", "IDREF_STOCK", "HOUSE_BILL", "BOOKING_FWD", "PALLET_NO", "CARGO_PIECE", "UNIT_CODE", "WAREHOUSE_CODE", "BLOCK", "SLOT", "TIER", "STATUS", "NOTE")
			.catch(err => console.log(err)) || [];
		if (dtPalletStock && dtPalletStock.length) {
			response['iPayload'] = dtPalletStock;
			response['iStatus'] = true;
			response['iMessage'] = 'Nạp dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		return response;
	}

	async loadPalletStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.CLASS_CODE) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!'
			return response;
		}
		let checkField, fieldValue;
		let whereObj = {};
		if (req.body.CLASS_CODE === 1) {
			checkField = 'HOUSE_BILL';
			fieldValue = req.body.HOUSE_BILL;
		} else {
			checkField = 'BOOKING_FWD';
			fieldValue = req.body.BOOKING_FWD;
		}
		whereObj[checkField] = fieldValue;
		let dtPalletStock = await this.cfsglobal
			.from("DT_PALLET_STOCK")
			.select("ID", "IDREF_STOCK", "HOUSE_BILL", "BOOKING_FWD", "PALLET_NO", "CARGO_PIECE", "UNIT_CODE", "WAREHOUSE_CODE", "BLOCK", "SLOT", "TIER", "STATUS", "NOTE")
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (dtPalletStock && dtPalletStock.length) {
			response['iPayload'] = dtPalletStock;
			response['iStatus'] = true;
			response['iMessage'] = 'Nạp dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		return response;
	}

	async savePalletStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.NewCell?.ID) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp ID!'
				return response;
			}
			if (!req.body.NewCell?.UPDATE_BY) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp tên người cập nhật!'
				return response;
			}
			req.body.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
			const updateNewCell = { STATUS: 1, UPDATE_BY: req.body.NewCell?.UPDATE_BY, UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss") };
			const updateOldCell = { STATUS: 0, UPDATE_BY: req.body.NewCell?.UPDATE_BY, UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss") };
			let whereNewCellBlock = {
				SLOT_COUNT: req.body.NewCell?.SLOT,
				TIER_COUNT: req.body.NewCell?.TIER,
				BLOCK: req.body.NewCell?.BLOCK,
				WAREHOUSE_CODE: req.body.NewCell?.WAREHOUSE_CODE
			};
			let whereOldCellBlock = {
				SLOT_COUNT: req.body.OldCell?.SLOT,
				TIER_COUNT: req.body.OldCell?.TIER,
				BLOCK: req.body.OldCell?.BLOCK,
				WAREHOUSE_CODE: req.body.OldCell?.WAREHOUSE_CODE
			};
			await this.cfsglobal
				.from("BS_BLOCK")
				.where(whereNewCellBlock)
				.update(updateNewCell);
			await this.cfsglobal
				.from("BS_BLOCK")
				.where(whereOldCellBlock)
				.update(updateOldCell);
			await this.cfsglobal
				.from("DT_PALLET_STOCK")
				.where("ID", req.body.NewCell?.ID)
				.update(req.body.NewCell)
			response["iStatus"] = true;
			response["iPayload"] = req.body.NewCell;
			response["iMessage"] = "Cập nhật dữ liệu thành công!";
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async saveJobStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.CLASS_CODE) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp hướng!';
			return response;
		}
		if (!req.body.CREATE_BY) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp người confirm!';
			return response;
		}
		let whereObj = {
			VOYAGEKEY: req.body.VOYAGEKEY,
			WAREHOUSE_CODE: req.body.WAREHOUSE_CODE,
			CLASS_CODE: req.body.CLASS_CODE,
			[req.body.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: req.body.CLASS_CODE === 1 ? req.body.HOUSE_BILL : req.body.BOOKING_FWD,
			ORDER_NO: req.body.ORDER_NO
		};
		let dtID = await this.cfsglobal
			.from('DT_PACKAGE_STOCK')
			.select('ID')
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (dtID && dtID.length) {
			response["iStatus"] = true;
			dtID = dtID[0].ID;
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		if (!response['iStatus']) {
			return response;
		}
		try {
			let whereObjBlock = {
				SLOT_COUNT: req.body.SLOT,
				TIER_COUNT: req.body.TIER,
				BLOCK: req.body.BLOCK,
				WAREHOUSE_CODE: req.body.WAREHOUSE_CODE
			};
			await this.cfsglobal
				.from('BS_BLOCK')
				.where(whereObjBlock)
				.update({
					STATUS: 1,
					UPDATE_BY: req.body.CREATE_BY,
					UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			await this.cfsglobal
				.from('JOB_STOCK')
				.where("ID", req.body.ID)
				.update({
					JOB_STATUS: 'C',
					UPDATE_BY: req.body.CREATE_BY,
					UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			response['iStatus'] = true;
		} catch (err) {
			response['iStatus'] = false;
			response['iMessage'] = 'Lỗi không thể cập nhật dữ liệu!';
		}
		if (!response['iStatus']) {
			return response;
		}
		let objPallet = {
			IDREF_STOCK: dtID,
			HOUSE_BILL: req.body.HOUSE_BILL || null,
			BOOKING_FWD: req.body.BOOKING_FWD || null,
			PALLET_NO: req.body.PALLET_NO || null,
			CARGO_PIECE: req.body.ACTUAL_CARGO_PIECE || null,
			UNIT_CODE: req.body.ACTUAL_UNIT || null,
			WAREHOUSE_CODE: req.body.WAREHOUSE_CODE || null,
			BLOCK: req.body.BLOCK || null,
			SLOT: req.body.SLOT || null,
			TIER: req.body.TIER || null,
			NOTE: req.body.NOTE || null,
			STATUS: 'S',
			CREATE_BY: req.body.CREATE_BY,
			CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
		};
		delete whereObj['WAREHOUSE_CODE'];
		whereObj['JOB_STATUS'] = 'A';
		// ------- check exist pallet stock --------
		let checkCode = await this.cfsglobal
			.from("JOB_STOCK")
			.select("ROWGUID")
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (checkCode && !checkCode.length) {
			delete whereObj['VOYAGEKEY'];
			delete whereObj['JOB_STATUS'];
			try {
				await this.cfsglobal
					.from('DT_PALLET_STOCK')
					.where(whereObj)
					.update({
						STATUS: 'S',
						UPDATE_BY: req.body.CREATE_BY,
						UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
					});
			} catch (err) {
				response['iStatus'] = false;
				response['iPayload'] = err;
				response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
			}
		}
		// -----------------------------------------------
		try {
			let dtPalletStock = await this.cfsglobal
				.from('DT_PALLET_STOCK')
				.insert(objPallet)
				.returning('*');
			if (dtPalletStock && dtPalletStock.length) {
				response['iStatus'] = true;
				response['iPayload'] = dtPalletStock;
				response['iMessage'] = "Lưu dữ liệu thành công!";
			}
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Không thể lưu mới dữ liệu!";
		}
		return response;
	}

	async confirmJobStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.IDREF_STOCK) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp số id ref';
			return response;
		}
		if (!req.body.CREATE_BY) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp người confirm';
			return response;
		}
		let dtPkgStock = await this.cfsglobal
			.from('DT_PACKAGE_STOCK')
			.select('VOYAGEKEY', 'ITEM_TYPE_CODE', 'WAREHOUSE_CODE', 'CLASS_CODE', 'CNTRNO', 'ORDER_NO', 'HOUSE_BILL', 'CARGO_PIECE', 'UNIT_CODE', 'BOOKING_FWD', 'PIN_CODE')
			.where("ID", req.body.IDREF_STOCK)
			.catch(err => console.log(err)) || [];
		if (dtPkgStock && dtPkgStock.length) {
			return dtPkgStock[0];
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		if (!response['iStatus']) {
			return response;
		}
		let checkField, fieldValue;
		if (dtPkgStock.CLASS_CODE === 1) {
			checkField = 'HOUSE_BILL';
			fieldValue = req.body.HOUSE_BILL;
		} else {
			checkField = 'BOOKING_FWD';
			fieldValue = req.body.BOOKING_FWD;
		}
		try {
			await this.cfsglobal
				.from('JOB_QUANTITY_CHECK')
				.select('SEQ')
				.where(checkField, fieldValue)
				.orderBy("SEQ", "desc")
				.then(data => {
					if (data && data.length) {
						req.body.SEQ = Number(data[0].SEQ) + 1;
					} else {
						req.body.SEQ = 1;
					}
				});
			let whereObj = {
				SLOT_COUNT: req.body.SLOT,
				TIER_COUNT: req.body.TIER,
				BLOCK: req.body.BLOCK,
				WAREHOUSE_CODE: req.body.WAREHOUSE_CODE
			};
			await this.cfsglobal
				.from('BS_BLOCK')
				.where(whereObj)
				.update({
					STATUS: 0,
					UPDATE_BY: req.body.CREATE_BY,
					UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			let whereJobGate = {
				VOYAGEKEY: dtPkgStock.VOYAGEKEY,
				CLASS_CODE: dtPkgStock.CLASS_CODE
			};
			dtPkgStock.HOUSE_BILL ? whereJobGate['HOUSE_BILL'] = dtPkgStock.HOUSE_BILL : '';
			dtPkgStock.BOOKING_FWD ? whereJobGate['BOOKING_FWD'] = dtPkgStock.BOOKING_FWD : '';
			let checkCode = await this.cfsglobal
				.from("JOB_GATE")
				.select("TRUCK_NO")
				.where(whereJobGate)
				.catch(err => console.log(err)) || [];
			let addWhereJobQuantity = {};
			Object.keys(whereJobGate).map(key => {
				addWhereJobQuantity['jobQuantity_' + key] = whereJobGate[key];
			});
			let isCheckQuantity = await this.cfsglobal
				.from('JOB_QUANTITY_CHECK AS jobQuantity')
				.select('jobQuantity.ACTUAL_CARGO_WEIGHT', 'dtVessel.VESSEL_NAME', 'dtVessel.INBOUND_VOYAGE', 'dtVessel.OUTBOUND_VOYAGE', 'dtVessel.ETA', 'dtVessel.ETD')
				.leftJoin('DT_VESSEL_VISIT AS dtVessel', 'dtVessel.VOYAGEKEY', 'jobQuantity.VOYAGEKEY')
				.where(addWhereJobQuantity)
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				let dtVessel = {
					VESSEL_NAME: isCheckQuantity[0].VESSEL_NAME,
					INBOUND_VOYAGE: isCheckQuantity[0].INBOUND_VOYAGE,
					OUTBOUND_VOYAGE: isCheckQuantity[0].OUTBOUND_VOYAGE,
					ETA: isCheckQuantity[0].ETA,
					ETD: isCheckQuantity[0].ETD
				};
				let dtObj = {
					VOYAGEKEY: dtPkgStock.VOYAGEKEY,
					ITEM_TYPE_CODE: dtPkgStock.ITEM_TYPE_CODE,
					WAREHOUSE_CODE: dtPkgStock.WAREHOUSE_CODE,
					CLASS_CODE: dtPkgStock.CLASS_CODE,
					METHOD_CODE: dtPkgStock.METHOD_CODE,
					TRUCK_NO: checkCode[0].TRUCK_NO,
					CNTRNO: dtPkgStock.CNTRNO,
					ORDER_NO: dtPkgStock.ORDER_NO,
					HOUSE_BILL: dtPkgStock.HOUSE_BILL,
					ESTIMATED_CARGO_PIECE: dtPkgStock.CARGO_PIECE,
					ACTUAL_UNIT: dtPkgStock.UNIT_CODE,
					ACTUAL_CARGO_PIECE: req.body.CARGO_PIECE,
					ACTUAL_CARGO_WEIGHT: isCheckQuantity[0].ACTUAL_CARGO_WEIGHT,
					SEQ: req.body.SEQ,
					PALLET_NO: req.body.PALLET_NO,
					BOOKING_FWD: dtPkgStock.BOOKING_FWD,
					PIN_CODE: dtPkgStock.PIN_CODE,
					START_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
					JOB_STATUS: 'A',
					CREATE_BY: req.body.CREATE_BY,
					CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
				};
				delete whereJobGate['VOYAGEKEY'];
				delete whereJobGate['CLASS_CODE'];
				whereJobGate['PALLET_NO'] = req.body.PALLET_NO,
					whereJobGate['JOB_STATUS'] = 'A';
				await this.cfsglobal
					.from('JOB_STOCK')
					.where(whereJobGate)
					.update({
						JOB_STATUS: 'C',
						UPDATE_BY: req.body.CREATE_BY,
						UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
					});
				delete whereJobGate['JOB_STATUS'];
				whereJobGate['BLOCK'] = req.body.BLOCK;
				whereJobGate['SLOT'] = req.body.SLOT;
				whereJobGate['TIER'] = req.body.TIER;
				await this.cfsglobal
					.from('DT_PALLET_STOCK')
					.where(whereJobGate)
					.update({
						STATUS: 'D',
						UPDATE_BY: req.body.CREATE_BY,
						UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
					});
				let dtJobQuantityChk = await this.cfsglobal
					.from('JOB_QUANTITY_CHECK')
					.returning('*')
					.insert(dtObj);
				response['iStatus'] = true;
				response['iPayload'] = Object.assign(dtVessel, dtJobQuantityChk);
				response['iMessage'] = 'Xe nâng hoàn tất công việc!';
			} else {
				response['iStatus'] = false;
				response['iMessage'] = 'Không tìm thấy thông tin xe qua cổng!';
			}
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}
}