import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ReceiptsModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadReceipts(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let whereObj = {};
			if (!req.body.from_date && !req.body.to_date) {
				response['iStatus'] = false;
				response['iMessage'] = `Vui lòng cung cấp thông tin từ ngày đến ngày!`;
				return response;
			}
			req.body.billoflading ? whereObj['billoflading'] = req.body.billoflading : '';
			req.body.booking_no ? whereObj['booking_no'] = req.body.booking_no : '';
			req.body.house_bill ? whereObj['house_bill'] = req.body.house_bill : '';
			req.body.booking_fwd ? whereObj['booking_fwd'] = req.body.booking_fwd : '';
			req.body.cntrno ? whereObj['cntrno'] = req.body.cntrno : '';
			req.body.job_type ? whereObj['job_type'] = req.body.job_type : '';
			req.body.class_code ? whereObj['class_code'] = req.body.class_code : '';
			req.body.payer ? whereObj['payer'] = req.body.payer : '';
			let _from = req.body.fromDate ? moment(req.body.from_date).startOf('day').format('YYYY-MM-DD HH:mm:ss') : '';
			let _to = req.body.toDate ? moment(req.body.to_date).endOf('day').format('YYYY-MM-DD HH:mm:ss') : '';
			// ------- check exist receipts --------
			let checkCode = await this.cfsglobal
				.from("receipts")
				.select('receipt_no', 'order_no', 'owner', 'payer', 'cntrno', 'job_type', 'vessel_name', 'commoditydescription', 'receipt_date', 'warehouse_code', 'cntrsztp', 'truck_no', 'vessel_bound', 'address', 'class_code')
				.where(whereObj)
				.whereBetween("create_date", [_from, _to])
				.catch(err => console.log(err)) || [];
			if (checkCode && checkCode.length) {
				let dtReturn = [];
				let dtFilter = checkCode.map(item => item.order_no + "__" + item.receipt_no).filter((item, idx, self) => self.indexOf(item) === idx);
				for (let i = 0; i < dtFilter.length; i++) {
					let orderNo = dtFilter[i].split("__")[0];
					let receiptNo = dtFilter[i].split("__")[1];
					let dtDetailNew = [];
					let dtChkFilter = checkCode.filter(p => p.order_no == orderNo && p.receipt_no == receiptNo);
					let dtOrder = await this.cfsglobal
						.from('dt_order')
						.select('note')
						.where('order_no', orderNo)
						.catch(err => console.log(err)) || [];
					let dtHeader = {
						receipt_no: dtChkFilter[0].receipt_no || '',
						order_no: dtChkFilter[0].order_no || '',
						owner: dtChkFilter[0].owner || '',
						payer: dtChkFilter[0].payer || '',
						cntrno: dtChkFilter[0].cntrno || '',
						job_type: dtChkFilter[0].job_type || '',
						vessel_name: dtChkFilter[0].vessel_name || '',
						note: dtOrder[0].note || '',
						commoditydescription: dtChkFilter[0].commoditydescription || '',
						receipt_date: dtChkFilter[0].receipt_date || '',
						warehouse_code: dtChkFilter[0].warehouse_code || '',
						cntrsztp: dtChkFilter[0].cntrsztp || '',
						truck_no: dtChkFilter[0].truck_no || '',
						vessel_bound: dtChkFilter[0].vessel_bound || '',
						address: dtChkFilter[0].address || '',
						class_code: dtChkFilter[0].class_code || '',
					};
					dtHeader['billoflading'] = dtChkFilter[0].billoflading || '';
					dtHeader['booking_no'] = dtChkFilter[0].booking_no || '';
					dtChkFilter.map(item => {
						let dtDetail = {
							item_type_code_cntr: item.item_type_code_cntr || '',
							actual_cargo_piece: item.actual_cargo_piece || '',
							cargo_weight: item.cargo_weight || '',
							unit_code: item.unit_code || '',
							cbm: item.cbm || '',
							note: item.note || '',
							commoditydescription: item.commoditydescription || '',
							owner: item.owner || ''
						};
						dtDetail['house_bill'] = item.house_bill || '';
						dtDetail['booking_fwd'] = item.booking_fwd || '';
						dtDetailNew.push(dataDetail);
					});
					dtHeader['Details'] = dtDetailNew;
					dtReturn.push(dtHeader);
				}
				response['iStatus'] = true;
				response['iPayload'] = dtReturn;
				response['iMessage'] = "Load dữ liệu thành công!";
			} else {
				response['iStatus'] = false;
				response['iMessage'] = "Không có dữ liệu cần tìm!";
				return response;
			}
			// -----------------------------------------------
		} catch (err) {
			response['iStatus'] = false;
			response['iPayload'] = err;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}
}