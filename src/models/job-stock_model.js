import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class JobStockModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadJobStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.warehouse_code) {
				response['iStatus'] = false;
				response['iMessage'] = 'Vui lòng cung cấp mã kho!';
				return response;
			}
			await this.cfsglobal.transaction(async (trx) => {
				const dtPallet = await this.retrievePallet(req.body.warehouse_code, trx);
				const dtPkgManifest = await this.retievePakage(trx);
				const dtJobStock = await this.processData(dtPallet, dtPkgManifest);
				response['iStatus'] = true;
				response['iPayload'] = dtJobStock;
				response['iMessage'] = 'Nạp dữ liệu thành công!';
			});
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async retrievePallet(wareHouseCode, trx) {
		return await this.cfsglobal
			.from("bs_block")
			.select("warehouse_code", "block", "slot_count", "tier_count", "status")
			.where("warehouse_code", wareHouseCode)
			.orderBy(["tier_count", "slot_count"])
			.transacting(trx);
	}

	async retievePakage(trx) {
		return await this.cfsglobal
			.from("dt_pallet_stock AS dtPalletStock")
			.select("dtPalletStock.warehouse_code", "dtPalletStock.idref_stock", "dtPalletStock.house_bill", "dtPalletStock.booking_fwd", "dtPalletStock.pallet_no", "dtPalletStock.block", "dtPalletStock.tier", "dtPalletStock.slot", "dtPakageStock.cargo_piece", "jobStock.job_type")
			.leftJoin("dt_package_stock AS dtPakageStock", "dtPakageStock.id", "dtPalletStock.idref_stock")
			.leftJoin("job_stock AS jobStock", "jobStock.pallet_no", "dtPalletStock.pallet_no")
			.transacting(trx);
	}

	async processData(dtPallet, dtPkgManifest) {
		const dtJobStock = [];
		dtPallet.forEach(itemCell => {
			dtPkgManifest.forEach(itemCelNot => {
				const dtObjJobStock = {};
				if (
					itemCell.warehouse_code === itemCelNot.warehouse_code &&
					itemCell.block === itemCelNot.block &&
					itemCell.slot_count === itemCelNot.slot_count &&
					itemCell.tier_count === itemCelNot.tier_count
				) {
					dtObjJobStock = {
						house_bill: itemCelNot.house_bill || '',
						booking_fwd: itemCelNot.booking_fwd || '',
						pallet_no: itemCelNot.pallet_no || '',
						cargo_piece: itemCelNot.cargo_piece || '',
						job_type: itemCelNot.job_type || ''
					};
				}
				dtObjJobStock['warehouse_code'] = itemCell.warehouse_code || '';
				dtObjJobStock['block'] = itemCell.block || '';
				dtObjJobStock['tier'] = itemCell.tier || '';
				dtObjJobStock['slot'] = itemCell.slot || '';
				dtObjJobStock['status'] = itemCell.status || '';
				dtJobStock.push(dtObjJobStock);
			});
		});
		let dtFilter = dtJobStock.filter(item => item.house_bill || item.booking_fwd ? true : false);
		let dtNotFilter = dtJobStock.filter(item => !item.house_bill || !item.booking_fwd ? true : false);
		let dtNew = dtFilter.concat(dtNotFilter).filter((item, idx, data) => {
			return data.findIndex(p => (p.warehouse_code === item.warehouse_code && p.block === item.block && p.tier === item.tier && p.slot === item.slot)) === idx;
		});
		let dtStock = dtNew.map(data => {
			let dtNewJobStock = {};
			Object.keys(data).map(key => {
				dtNewJobStock['wareHouse_' + key] = data[key];
			});
			return dtNewJobStock;
		});
		// Lấy giá trị để so sanh và sx, hiện tại index là STT = 1, 2, 3...
		// ascending = [{STT: 1},{STT: 2}].sort((a,b) => 1 - 2)
		// descending = [{STT: 1},{STT: 2}].sort((a,b) => 2 - 1)
		return dtStock.sort((a, b) => Number(a.wareHouse_index) - Number(b.wareHouse_index));
	}

	async loadJobStockCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (req.body.block && !req.body.block.length) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp mã dãy!';
			return response;
		}
		let query = await this.cfsglobal
			.from("job_stock")
			.select("id", "voyagekey", "warehouse_code", "class_code", "job_type", "house_bill", "booking_fwd", "order_no", "pin_code", "pallet_no", "seq", "actual_cargo_piece", "actual_unit", "actual_cargo_weight", "block", "slot", "tier", "job_status")
			.where("warehouse_code", req.body.warehouse_code)
			.whereNot("job_status", "C")
			.catch(err => console.log(err)) || [];
		if (query && query.length) {
			let dtJobStock = query.filter(p => p.job_type === 'NK' || req.body.block.includes(p?.block));
			if (dtJobStock && dtJobStock.length) {
				response['iStatus'] = true;
				response['iPayload'] = dtJobStock;
				response['iMessage'] = 'Nạp dữ liệu thành công!';
			} else {
				response['iStatus'] = false;
				response['iMessage'] = 'Không có dữ liệu từ vị trí ô!';
			}
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Không có dữ liệu!';
		}
		return response;
	}

	async saveJobStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.class_code) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung lại hướng!";
			return response;
		}
		if (!req.body.create_by) {
			response['iStatus'] = false;
			response['iMessage'] = 'Vui lòng cung cấp tên người tạo!'
			return response;
		}
		let dtJobStock = {
			voyagekey: req.body.voyagekey,
			warehouse_code: req.body.warehouse_code,
			class_code: req.body.class_code,
			job_type: "NK",
			[req.body.class_code === 1 ? 'house_bill' : 'booking_fwd']: req.body.class_code === 1 ? req.body.house_bill : req.body.booking_fwd,
			order_no: req.body.order_no,
			pin_code: req.body.pin_code,
			pallet_no: req.body.pallet_no,
			seq: req.body.seq,
			actual_cargo_piece: req.body.actual_cargo_piece,
			actual_unit: req.body.actual_unit,
			actual_cargo_weight: req.body.actual_cargo_weight,
			block: req.body.block,
			slot: req.body.slot,
			tier: req.body.tier,
			job_status: req.body.job_status,
			create_by: req.body.create_by,
		};
		let dtNewJobStock = await this.cfsglobal
			.from("job_stock")
			.returning("*")
			.insert(dtJobStock)
			.catch(err => console.log(err)) || [];
		if (dtNewJobStock && dtNewJobStock.length) {
			response['iStatus'] = true;
			response['iPayload'] = dtNewJobStock;
			response['iMessage'] = "Thêm dữ liệu thành công!"
		} else {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Thêm dữ liệu thất bại!"
		}
		return response;
	}
}