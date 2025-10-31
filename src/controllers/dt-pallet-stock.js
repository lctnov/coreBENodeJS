import 'dotenv/config';
import DtPalletStockModel from '../models/dt-pallet-stock_model.js';

export default class DtPalletStockController {
	async view(req, res) {
		let dtPalletStockModel = new DtPalletStockModel();
		try {
			let data = await dtPalletStockModel.loadStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewPallet(req, res) {
		let dtPalletStockModel = new DtPalletStockModel();
		try {
			let data = await dtPalletStockModel.loadPalletStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async savePallet(req, res) {
		let dtPalletStockModel = new DtPalletStockModel();
		try {
			let data = await dtPalletStockModel.savePalletStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async saveJob(req, res) {
		let dtPalletStockModel = new DtPalletStockModel();
		try {
			let data = await dtPalletStockModel.saveJobStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmJob(req, res) {
		let dtPalletStockModel = new DtPalletStockModel();
		try {
			let data = await dtPalletStockModel.confirmJobStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}