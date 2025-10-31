import 'dotenv/config';
import TrfCodeModel from '../models/trf-codes_model.js';

export default class TrfCodeController {
	async view(req, res) {
		let trfCodeModel = new TrfCodeModel();
		try {
			let data = await trfCodeModel.loadTrfCd(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let trfCodeModel = new TrfCodeModel();
		try {
			let data = await trfCodeModel.loadTrfCdCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let trfCodeModel = new TrfCodeModel();
		try {
			let data = await trfCodeModel.saveTrfCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let trfCodeModel = new TrfCodeModel();
		try {
			let data = await trfCodeModel.delTrfCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}