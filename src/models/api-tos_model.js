import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class ApiTosModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadApiTos(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (!req.body.from_date || !req.body.to_date) {
			response['iStatus'] = false;
			response['iMessage'] = `Vui lòng gửi từ ngày đến ngày!`
			return response;
		}
		let whereObj = {};
		let from_date = moment(req.body.from_date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let to_date = moment(req.body.to_date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
		req.body.mes_status === false || req.body.mes_status === true ? whereObj['mes_status'] = req.body.mes_status : '';
		req.body.function_patch ? whereObj['function_patch'] = req.body.function_patch : '';
		let dtApiTos = await this.cfsglobal
			.from('api_tos')
			.select('id', 'rowguid', 'tos_rowguid', 'function_patch', 'function_name', 'post_data', 'get_data', 'mes_status', 'create_date')
			.whereBetween("create_date", [from_date, to_date])
			.where(whereObj)
			.catch(err => console.log(err)) || [];
		if (dtApiTos && dtApiTos.length) {
			dtApiTos = dtApiTos.map(item => {
				return {
					...item,
					create_date: moment(item.create_date).format('DD/MM/YYYY HH:mm:ss')
				}
			});
			response['iStatus'] = true;
			response['iPayload'] = dtApiTos;
			response['iMessage'] = "Nạp dữ liệu thành công!";
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không có dữ liệu!";
		}
		return response;
	}
}