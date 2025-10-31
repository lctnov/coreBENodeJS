import 'dotenv/config';
import ReceiptsModel from '../models/receipts_model.js';

export default class ReceiptsController {
	async getData(req, res) {
		let receiptsModel = new ReceiptsModel();
		try {
			let data = await receiptsModel.loadReceipts(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}