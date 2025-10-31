import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ReportsModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadReports(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let from_date = moment(req.body.from_date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
			let to_date = moment(req.body.to_date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
			//Case 1:
			let whereRaw = '';
			whereRaw = whereRaw + `t0.time_in between '${from_date}' and '${to_date}'`;
			if (req.body.class_code) whereRaw += ` and t0.class_code = ${req.body.class_code}`
			if (req.body.item_type_code) whereRaw += ` and t0.item_type_code = '${req.body.item_type_code}'`
			if (req.body.status === 'S,D') {
				let split = req.body.status.split(',');
				whereRaw += `and t0.status in ('${split[0]}', '${split[1]}')`
			} else {
				whereRaw += `and t0.status in ('${req.body.status}')`
			}
			let query = this.cfsglobal.raw(`select
											t0.cntrno as 'cntrno',
											t1.cntrsztp as 'cntrsztp',
											t2.vessel_name as 'vessel_name',
											(case when t0.class_code=1 then t2.inbound_voyage else case when t0.class_code=2 then t2.outbound_voyage end end) as 'inbound_outbound',
											t1.consignee as 'consignee',
											(case when t0.class_code=1 then t0.house_bill else case when t0.class_code=2 then t0.booking_fwd end end) as 'hb_bk',
											t0.item_type_code as 'item_type_code',
											t1.commoditydescription as 'commoditydescription',
											t1.customer_name as 'customer_name',
											t0.cargo_piece as 'cargo_piece',
											t0.unit_code as 'unit_code',
											t0.cargo_weight as 'cargo_weight',
											t0.cbm as 'cbm',
											t0.warehouse_code as 'warehouse_code',
											t0.time_in as 'time_in',
											t0.time_out as 'time_out',
											(case when t0.class_code=1 then t0.tkhn_no else case when t0.class_code=2 then t0.tkhx_no end end) as 'tlhq',
											t0.tkhn_no as 'tkhn_no',
											t3.receipt_no as 'receipt_no',
											t0.order_no as 'order_no',
											(DAY(Getdate() - t0.time_in)+1) as 'stock_time',
											t0.note as 'note',
											*
										from
											dt_package_stock t0 
										inner join 
											dt_package_mnf_ld t1 
										on 
											t0.voyagekey=t1.voyagekey
										and 
											(t0.class_code= 1 and t0.class_code=t1.class_code and t0.house_bill=t1.house_bill) or (t0.class_code=2 and t0.class_code=t1.class_code and t0.booking_fwd=t1.booking_fwd)
										left join 
											dt_vessel_visit t2 
										on 
											t0.voyagekey=t2.voyagekey
										left join 
											receipts t3 
										on 
											t0.voyagekey=t3.voyagekey and t0.order_no=t3.order_no
										and 
											(t0.class_code= 1 and t3.class_code=t1.class_code and t0.house_bill=t3.house_bill) or (t0.class_code=2 and t3.class_code=t1.class_code and t0.booking_fwd=t3.booking_fwd)
										where ${whereRaw}`);
			//============================================================
			//Case 2:
			// let query = this.cfsglobal.select([
			// 't0.cntrno as cntrno',
			// 't1.cntrsztp as cntrsztp',
			// 't2.vessel_name as vessel_name',
			// this.cfsglobal.raw('(case when t0.class_code=1 then t2.inbound_voyage else case when t0.class_code=2 then t2.outbound_voyage end end) as inbound_outbound'),
			// 't1.consignee as consignee',
			// this.cfsglobal.raw('(case when t0.class_code=1 then t0.house_bill else case when t0.class_code=2 then t0.booking_fwd end end) as hb_bk'),
			// 't0.item_type_code as item_type_code',
			// 't1.commoditydescription as commoditydescription',
			// 't1.customer_name as customer_name',
			// 't0.cargo_piece as cargo_piece',
			// 't0.unit_code as unit_code',
			// 't0.cargo_weight as cargo_weight',
			// 't0.cbm as cbm',
			// 't0.warehouse_code as warehouse_code',
			// 't0.time_in as time_in',
			// 't0.time_out as time_out',
			// this.cfsglobal.raw('(case when t0.class_code=1 then t0.tkhn_no else case when t0.class_code=2 then t0.tkhx_no end end) as tlhq'),
			// 't0.tkhn_no as tkhn_no',
			// 't3.receipt_no as receipt_no',
			// 't0.order_no as order_no',
			// this.cfsglobal.raw('(day(getdate() - t0.time_in)+1) as stock_time'),
			// 't0.note as note'
			// ])
			// .from('dt_package_stock as t0')
			// .innerJoin('dt_package_mnf_ld as t1', function () {
			//     this.on('t0.voyagekey', '=', 't1.voyagekey')
			//         .andon(function () {
			//             this.on('t0.class_code', '=', 1)
			//                 .andon('t0.class_code', '=', 't1.class_code')
			//                 .andon('t0.house_bill', '=', 't1.house_bill')
			//                 .orOn(function () {
			//                     this.on('t0.class_code', '=', 2)
			//                         .andon('t0.class_code', '=', 't1.class_code')
			//                         .andon('t0.booking_fwd', '=', 't1.booking_fwd');
			//                 });
			//         });
			// })
			// .leftJoin('dt_vessel_visit as t2', 't0.voyagekey', '=', 't2.voyagekey')
			// .leftJoin('receipts as t3', function () {
			//     this.on('t0.voyagekey', '=', 't3.voyagekey')
			//         .andon('t0.order_no', '=', 't3.order_no')
			//         .andon(function () {
			//             this.on('t0.class_code', '=', 1)
			//                 .andon('t3.class_code', '=', 't1.class_code')
			//                 .andon('t0.house_bill', '=', 't3.house_bill')
			//                 .orOn(function () {
			//                     this.on('t0.class_code', '=', 2)
			//                         .andon('t3.class_code', '=', 't1.class_code')
			//                         .andon('t0.booking_fwd', '=', 't3.booking_fwd');
			//                 });
			//         });
			// })
			// 	.wherebetween('t0.time_in', [from_date, to_date]);
			// if (req.body.class_code) {
			// 	query = query.where('t0.class_code', req.body.class_code);
			// }
			// if (req.body.item_type_code) {
			// 	query = query.where('t0.item_type_code', req.body.item_type_code);
			// }
			// if (req.body.status === 'S,D') {
			// 	let split = req.body.status.split(',');
			// 	query = query.whereIn('t0.status', split);
			// } else {
			// 	query = query.where('t0.status', req.body.status);
			// }
			//============================================================
			let result = await query.catch(err => console.log(err)) || [];
			if (result && result.length) {
				let newData = [];
				if (req.body.status === 'S' && req.body.NumberDays !== '') {
					newData = result.filter(item => {
						let timeIn = new Date(item.time_in[0]);
						let currentTime = new Date();
						let Days = Math.ceil((currentTime.getTime() - timeIn.getTime()) / (1000 * 3600 * 24));
						return Number(Days) === Number(req.body.NumberDays);
					});
				} else {
					newData = result;
				}
				response.data.iPayload = newData;
				response.iStatus = true;
				response.data.iMessage = "Nạp dữ liệu thành công!";
			} else {
				response.iStatus = false;
				response.data.iMessage = "Không có dữ liệu!";
			}
		} catch (err) {
			response.iStatus = false;
			response.data.iPayload = err;
			response.data.iMessage = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;
	}
}