import 'dotenv/config';
import JobStockModel from '../models/job-stock_model.js';

export default class JobStockController {
	async view(req, res) {
		let jobStockModel = new JobStockModel();
		try {
			let data = await jobStockModel.loadJobStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let jobStockModel = new JobStockModel();
		try {
			let data = await jobStockModel.loadJobStockCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let jobStockModel = new JobStockModel();
		try {
			let data = await jobStockModel.saveJobStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}