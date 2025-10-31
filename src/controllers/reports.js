import 'dotenv/config';
import ReportsModel from '../models/reports_model.js';

export default class ReportsController {
	async getData(req, res) {
		let reportsModel = new ReportsModel();
		try {
			let data = await reportsModel.loadReports(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			});
		}
	}
}