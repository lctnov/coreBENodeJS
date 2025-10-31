import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class JobQuantityCheckModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadJobQuantity(req) {
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
		let whereObj = {
			voyagekey: req.body.voyagekey,
			class_code: req.body.class_code,
			[req.body.class_code === 1 ? 'house_bill' : 'booking_fwd']: req.body.class_code === 1 ? req.body.house_bill : req.body.booking_fwd
		};
		var query = await this.cfsglobal
			.from("job_quantity_check")
			.select('id', 'voyagekey', 'warehouse_code', 'class_code', 'method_code', 'truck_no', 'cntrno', 'order_no', 'pin_code', 'house_bill', 'booking_fwd', 'booking_no', 'item_type_code', 'estimated_cargo_piece', 'actual_cargo_piece', 'actual_unit', 'actual_cargo_weight', 'seq', 'pallet_no', 'start_date', 'finish_date', 'is_final', 'job_status', 'note')
			.where(whereObj)
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

	async loadJobQuantityCheck(req) {
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
		let whereObj = {
			voyagekey: req.body.voyagekey,
			class_code: req.body.class_code,
			method_code: req.body.class_code === 1 ? 'XKN' : 'XKX',
			[req.body.class_code === 1 ? 'house_bill' : 'booking_fwd']: req.body.class_code === 1 ? req.body.house_bill : req.body.booking_fwd
		};
		var query = await this.cfsglobal
			.from("job_quantity_check")
			.select('id', 'voyagekey', 'warehouse_code', 'class_code', 'method_code', 'truck_no', 'cntrno', 'order_no', 'pin_code', 'house_bill', 'booking_fwd', 'booking_no', 'item_type_code', 'estimated_cargo_piece', 'actual_cargo_piece', 'actual_unit', 'actual_cargo_weight', 'seq', 'pallet_no', 'start_date', 'finish_date', 'is_final', 'job_status', 'note')
			.where(whereObj)
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

	async getJobQuantityInfo(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let whereObj = {
			order_no: req.body.order_no || '',
		};
		req.body.house_bill ? whereObj['house_bill'] = req.body.house_bill : '';
		req.body.booking_fwd ? whereObj['booking_fwd'] = req.body.booking_fwd : '';
		var query = await this.cfsglobal
			.from("job_quantity_check")
			.select('id', 'voyagekey', 'warehouse_code', 'class_code', 'method_code', 'truck_no', 'cntrno', 'order_no', 'pin_code', 'house_bill', 'booking_fwd', 'booking_no', 'item_type_code', 'estimated_cargo_piece', 'actual_cargo_piece', 'actual_unit', 'actual_cargo_weight', 'seq', 'pallet_no', 'start_date', 'finish_date', 'is_final', 'job_status', 'note')
			.where(whereObj)
			.orderBy("seq", "asc")
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

	async confirmJobQuantityPkgPalletIn(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.id) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp số id!";
				return response;
			}
			if (!req.body.update_by) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp người cập nhật!";
				return response;
			}
			let dtJobQuantity = {
				job_status: 'C',
				actual_cargo_piece: req.body.actual_cargo_piece,
				update_by: req.body.update_by,
				update_date: moment().format('YYYY-MM-DD HH:mm:ss')
			};
			//Generate Pallet Code
			const palletCode = [
				req.body.class_code === 1 ? req.body.house_bill : req.body.booking_fwd,
				req.body.actual_cargo_piece,
				req.body.estimated_cargo_piece,
				req.body.seq
			].join('/');
			dtJobQuantity = Object.assign(dtJobQuantity, { pallet_no: palletCode, seq: req.body.seq });
			await this.cfsglobal
				.from("job_quantity_check")
				.where("id", req.body.id)
				.update(dtJobQuantity);
			response["iStatus"] = true;
			response["iPayload"] = Object.assign({ id: req.body.id }, dtJobQuantity);
			response["iMessage"] = "Cập nhật dữ liệu thành công!";
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async confirmJobQuantityPkgPalletOut(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (!req.body.order_no) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp mã lệnh!";
				return response;
			}
			if (!req.body.class_code) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp hướng!";
				return response;
			}
			if (!req.body.pallet_no) {
				response["iStatus"] = false;
				response["iMessage"] = "Vui lòng cung cấp mã pallet!";
				return response;
			}
			let whereObj = {
				order_no: req.body.order_no,
				class_code: req.body.class_code,
				pallet_no: req.body.pallet_no,
				[req.body.class_code === 1 ? 'house_bill' : 'booking_fwd']: req.body.class_code === 1 ? req.body.house_bill : req.body.booking_fwd
			};
			let checkCode = await this.cfsglobal
				.from("job_quantity_check")
				.where(whereObj)
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				await this.cfsglobal
					.from("job_quantity_check")
					.where(whereObj)
					.update({ job_status: 'C', update_by: req.body.update_by, update_date: moment.format('YYYY-MM-DD HH:mm:ss') });
				response["iStatus"] = true;
				response["iPayload"] = req.body;
				response["iMessage"] = "Cập nhật dữ liệu thành công!";
			} else {
				response['iStatus'] = false;
				response['iMessage'] = "Không có dữ liệu!";
			}
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async saveJobQuantity(req) {
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
		if (!req.body.create_by) {
			response["iStatus"] = false;
			response["iMessage"] = "Vui lòng cung cấp người tạo!";
			return response;
		}
		let whereObj = {
			[req.body.class_code === 1 ? 'house_bill' : 'booking_fwd']: req.body.class_code === 1 ? req.body.house_bill : req.body.booking_fwd
		};
		let dtJobQuantity = await this.cfsglobal
			.from("job_quantity_check")
			.select("rowguid", 'seq')
			.where(whereObj)
			.orderBy("seq", "desc")
			.catch(err => console.log(err)) || [];
		if (dtJobQuantity && !dtJobQuantity.length) {
			req.body['seq'] = 1;
		} else {
			req.body['seq'] = Number(dtJobQuantity[0].seq) + 1;
		}
		let dtNewJobQuantity = {
			voyagekey: req.body.voyagekey || null,
			warehouse_code: req.body.warehouse_code || null,
			class_code: req.body.class_code || null,
			method_code: req.body.method_code || null,
			truck_no: req.body.truck_no || null,
			cntrno: req.body.cntrno || null,
			order_no: req.body.order_no || null,
			pin_code: req.body.pin_code || null,
			house_bill: req.body.house_bill || null,
			booking_fwd: req.body.booking_fwd || null,
			booking_no: req.body.booking_no || null,
			item_type_code: req.body.item_type_code || null,
			estimated_cargo_piece: req.body.estimated_cargo_piece || null,
			actual_cargo_piece: req.body.actual_cargo_piece || null,
			actual_unit: req.body.actual_unit || null,
			actual_cargo_weight: req.body.actual_cargo_weight || null,
			start_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			finish_date: req.body.finish_date || null,
			seq: req.body['seq'],
			is_final: 0,
			job_status: 'A',
			create_by: req.body.create_by
		};
		let chkObjJobQuantity = {
			house_bill: dtNewJobQuantity.house_bill,
			order_no: dtNewJobQuantity.order_no,
		};
		const checkCode = await this.cfsglobal
			.from("job_quantity_check")
			.select("rowguid", "actual_cargo_piece")
			.where(chkObjJobQuantity)
			.catch(err => console.log(err)) || [];
		let sumCargoPiece = 0;
		for (let i = 0; i < checkCode?.length; i++) {
			sumCargoPiece += checkCode[i].actual_cargo_piece;
		}
		let dtEstimateCargoPiece = await this.cfsglobal
			.from("job_quantity_check")
			.select("rowguid", 'estimated_cargo_piece')
			.where(chkObjJobQuantity)
			.then(data => {
				return data[0]?.estimated_cargo_piece || null;
			});
		if (dtEstimateCargoPiece === null || dtEstimateCargoPiece >= sumCargoPiece) {
			try {
				let queryJobQuantity = await this.cfsglobal
					.from("job_quantity_check")
					.returning("*")
					.insert(dtNewJobQuantity);
				response['iStatus'] = true;
				response['iPayload'] = queryJobQuantity;
				response['iMessage'] = 'Tạo dữ liệu thành công!';
			} catch (err) {
				response['iStatus'] = false;
				response['iPayload'] = err;
				response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
			}
		} else {
			response['iStatus'] = false;
			response['iMessage'] = 'Do số lượng thực tế vượt quá số lượng dự kiến!';
		}
		return response;
	}
}