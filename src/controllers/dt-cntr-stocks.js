import 'dotenv/config';
import CntrStockModel from '../models/dt-cntr-stocks_model.js';

export default class CntrStockController {
	async view(req, res) {
		let cntrStockModel = new CntrStockModel();
		try {
			let data = await cntrStockModel.loadCntrStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let cntrStockModel = new CntrStockModel();
		try {
			let data = await cntrStockModel.saveCntrStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let cntrStockModel = new CntrStockModel();
		try {
			let data = await cntrStockModel.delCntrStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getVTOSCntrStock(req, res) {
		let cntrStockModel = new CntrStockModel();
		try {
			let data = await cntrStockModel.getVTOSCntrStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}