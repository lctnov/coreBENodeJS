import 'dotenv/config';
import DtOrderModel from '../models/dt-order_model.js';

export default class DtOrderController {
	async view(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.loadDtOrder(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getHousebill(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.getDtOrderHousebill(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getOrder(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.getDtOrder(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getInfo(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.getInfoDtOrder(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmOrderIN(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.confirmOrderINDtOrder(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmOrderOUT(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.confirmOrderOUTDtOrder(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.saveDtOrder(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async saveOrder(req, res) {
		let dtOrderModel = new DtOrderModel();
		try {
			let data = await dtOrderModel.saveOrderDtOder(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}