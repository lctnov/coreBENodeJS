import 'dotenv/config';
import TrfStdModel from '../models/trf-stds_model.js';

export default class TrfStdController {
	async view(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.loadTrfStd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.loadTrfStdCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewTrfTemplate(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.loadTrfStdTemplate(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.saveTrfStd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.delTrfStd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getToBill(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.getToBillTrfStd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getCusInfo(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.getCusInfoTrfStd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getToBillExOrderIn(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.getToBillExOrderInTrfStd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getToBillExOrderOut(req, res) {
		let trfStdModel = new TrfStdModel();
		try {
			let data = await trfStdModel.getToBillExOrderOutTrfStd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}