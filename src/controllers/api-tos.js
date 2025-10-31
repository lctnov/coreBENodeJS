import 'dotenv/config';
import ApiTosModel from '../models/api-tos_model.js';

export default class ApiTosController {
	async getData(req, res) {
		let apiTosModel = new ApiTosModel();
		try {
			let data = await apiTosModel.loadApiTos(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}