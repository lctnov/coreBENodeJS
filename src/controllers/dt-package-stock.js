import 'dotenv/config';
import DtPkgStockModel from '../models/dt-package-stock_model.js';

export default class DtPkgStockController {
	async view(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.loadPkgStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewOut(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.loadPkgStockOut(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewWarehouse(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.loadPkgStockWarehouse(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewPallet(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.loadPkgStockPallet(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async get(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.getPkgStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getPallet(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.getPkgStockPallet(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.savePkgStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async saveTLHQ(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.savePkgStockTLHQ(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async changePkgStock(req, res) {
		let dtPkgStockModel = new DtPkgStockModel();
		try {
			let data = await dtPkgStockModel.changePkgStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}