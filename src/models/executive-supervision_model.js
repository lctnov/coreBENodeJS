import databaseInstance from '../config/database.js';
import moment from 'moment';
export default class ExeSupervisionModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadExeSupervisionData(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let dtWarehouse = await this.cfsglobal
				.from('bs_warehouse')
				.select('warehouse_code', 'warehouse_name')
				.catch(err => console.log(err)) || [];
			let dtMethod = await this.cfsglobal
				.from('bs_method')
				.select('method_code', 'method_name')
				.where('is_service', 0)
				.catch(err => console.log(err)) || [];
			let dtGate = await this.cfsglobal
				.from('bs_gate')
				.select('gate_code', 'gate_name')
				.catch(err => console.log(err)) || [];
			response['iStatus'] = true;
			response['iPayload'] = { bsWarehouse: dtWarehouse, bsMethod: dtMethod, bsGate: dtGate };
			response['iMessage'] = 'Load dữ liệu thành công!';
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async loadExeSupervisionDevice(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let dtDevice = await this.cfsglobal
				.from('bs_equipments')
				.select('id', 'equ_type', 'equ_code', 'equ_code_name', 'warehouse_code', 'block')
				.catch(err => console.log(err)) || [];
			let dtGate = await this.cfsglobal
				.from('bs_gate')
				.select('id', 'gate_code', 'gate_name', 'is_in_out')
				.catch(err => console.log(err)) || [];
			response['iStatus'] = true;
			response['iPayload'] = { device: dtDevice, gate: dtGate };
			response['iMessage'] = 'Load dữ liệu thành công!';
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}

	async loadExeSupervisionPortControl(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let whereObj = {
			order_no: req.body.order_no || '',
			cntrno: req.body.cntrno || '',
			truck_no: req.body.truck_no || '',
			method_code: req.body.method_code || '',
			is_in_out: req.body.is_in_out || '',
			class_code: req.body.class_code || '',
			house_bill: req.body.house_bill || '',
			booking_fwd: req.body.booking_fwd || '',
			is_success_out: 1
		};
		let dtWhere = [];
		Object.keys(whereObj).map(key => {
			dtWhere['jobGate.' + key] = whereObj[key];
		});
		let dtJobGate = await this.cfsglobal
			.from('job_gate AS jobGate')
			.select('jobGate.order_no', 'jobGate.cntrno', 'jobGate.house_bill', 'jobGate.booking_fwd', 'jobGate.method_code', 'jobGate.voyagekey', 'jobGate.class_code', 'jobGate.time_in', 'jobGate.time_out', 'jobGate.is_in_out', 'jobGate.quantity_chk', 'dtvessel.vessel_name', 'dtvessel.inbound_voyage', 'dtvessel.outbound_voyage', 'dtvessel.eta', 'dtvessel.etd')
			.leftJoin('dt_vessel_visit AS dtvessel', 'dtvessel.voyagekey', 'jobGate.voyagekey')
			.where(dtWhere)
			.catch(err => console.log(err)) || [];
		if (dtJobGate && dtJobGate.length) {
			dtJobGate = dtJobGate.map(item => {
				return {
					...item,
					[item.class_code === 1 ? 'house_bill' : 'booking_fwd']: item.class_code === 1 ? item.house_bill : item.booking_fwd,
					[item.class_code === 1 ? 'inbound_voyage' : 'outbound_voyage']: item.class_code === 1 ? item.inbound_voyage : item.outbound_voyage,
					[item.class_code === 1 ? 'eta' : 'etd']: item.class_code === 1 ? moment(item.eta).format('DD/MM/YYYY HH:mm:ss') : moment(item.eta).format('DD/MM/YYYY HH:mm:ss'),
					time_in: moment(item.time_in).format('DD/MM/YYYY HH:mm:ss')
				}
			});
			response['iStatus'] = true;
			response['iPayload'] = dtJobGate;
			response['iMessage'] = 'Load dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không có dữ liệu!";
		}
		return response;
	}

	async loadExeSupervisionCheck(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.warehouse_code) {
			response['iStatus'] = false;
			response['iMessage'] = `Vui lòng cung cấp mã kho!`;
			return response;
		}
		let whereObj = {
			JOB_STATUS: 'A'
		};
		req.body.warehouse_code ? whereObj['warehouse_code'] = req.body.warehouse_code : '';
		req.body.cntrno ? whereObj['cntrno'] = req.body.cntrno : '';
		req.body.truck_no ? whereObj['truck_no'] = req.body.truck_no : '';
		req.body.class_code ? whereObj['class_code'] = req.body.class_code : '';
		req.body.method_code ? whereObj['method_code'] = req.body.method_code : '';
		req.body.pallet_no ? whereObj['pallet_no'] = req.body.pallet_no : '';
		req.body.house_bill ? whereObj['house_bill'] = req.body.house_bill : '';
		req.body.booking_fwd ? whereObj['booking_fwd'] = req.body.booking_fwd : '';
		let dtWhere = [];
		Object.keys(whereObj).map(key => {
			dtWhere['jobQuantity.' + key] = whereObj[key];
		});
		let dtJobQuantity = await this.cfsglobal
			.from('job_quantity_check AS jobQuantity')
			.select('jobQuantity.warehouse_code', 'jobQuantity.truck_no', 'jobQuantity.cntrno', 'jobQuantity.house_bill', 'jobQuantity.booking_fwd', 'jobQuantity.class_code', 'jobQuantity.method_code', 'jobQuantity.estimated_cargo_piece', 'jobQuantity.actual_cargo_piece', 'jobQuantity.voyagekey', 'jobQuantity.seq', 'jobQuantity.id', 'dtvessel.vessel_name', 'dtvessel.inbound_voyage', 'dtvessel.outbound_voyage', 'dtvessel.eta', 'dtvessel.etd')
			.leftJoin('dt_vessel_visit AS dtvessel', 'dtvessel.voyagekey', 'jobQuantity.voyagekey')
			.where(dtWhere)
			.orderBy('house_bill', 'booking_fwd', 'SEQ')
			.catch(err => console.log(err)) || [];
		if (dtJobQuantity && dtJobQuantity.length) {
			dtJobQuantity = dtJobQuantity.map(item => {
				return {
					...item,
					[item.class_code === 1 ? 'house_bill' : 'booking_fwd']: item.class_code === 1 ? item.house_bill : item.booking_fwd,
					[item.class_code === 1 ? 'inbound_voyage' : 'outbound_voyage']: item.class_code === 1 ? item.inbound_voyage : item.outbound_voyage,
					[item.class_code === 1 ? 'eta' : 'etd']: item.class_code === 1 ? moment(item.eta).format('DD/MM/YYYY HH:mm:ss') : moment(item.eta).format('DD/MM/YYYY HH:mm:ss'),
				}
			});
			response['iStatus'] = true;
			response['iPayload'] = dtJobQuantity;
			response['iMessage'] = 'Load dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không có dữ liệu!";
		}
		return response;
	}

	async loadExeSupervisionJobStock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let whereObj = {
			JOB_STATUS: 'A'
		};
		req.body.warehouse_code ? whereObj['warehouse_code'] = req.body.warehouse_code : '';
		req.body.block ? whereObj['block'] = req.body.block : '';
		req.body.job_type ? whereObj['job_type'] = req.body.job_type : '';
		req.body.pallet_no ? whereObj['pallet_no'] = req.body.pallet_no : '';
		req.body.house_bill ? whereObj['house_bill'] = req.body.house_bill : '';
		req.body.booking_fwd ? whereObj['booking_fwd'] = req.body.booking_fwd : '';
		let dtJobStock = await this.cfsglobal
			.from('job_stock')
			.select('warehouse_code', 'block', 'pallet_no', 'job_type', 'job_status', 'create_date', 'class_code', 'house_bill', 'booking_fwd', 'id')
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (dtJobStock && dtJobStock.length) {
			dtJobStock = dtJobStock.map(item => {
				return {
					...item,
					[item.class_code === 1 ? 'house_bill' : 'booking_fwd']: item.class_code === 1 ? item.house_bill : item.booking_fwd,
				}
			});
			response['iStatus'] = true;
			response['iPayload'] = dtJobStock;
			response['iMessage'] = 'Load dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không có dữ liệu!";
		}
		return response;
	}

	async loadExeSupervisionblock(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let dtblock = await this.cfsglobal
			.from('bs_block')
			.select('block')
			.where('warehouse_code', req.body.warehouse_code)
			.catch(err => console.log(err)) || [];
		if (dtblock && dtblock.length) {
			dtblock = dtblock.map(p => p.block);
			response['iStatus'] = true;
			response['iPayload'] = [... new Set(dtblock)];
			response['iMessage'] = 'Load dữ liệu thành công!';
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không có dữ liệu!";
		}
		return response;
	}
}