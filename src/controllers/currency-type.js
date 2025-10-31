import 'dotenv/config';
import CurrentTypeModel from '../models/currency-type_model.js';

export default class CurrentTypeController {
	async view(req, res) {
		let currentTypeModel = new CurrentTypeModel();
		try {
			let data = await currentTypeModel.loadCurrentType(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let currentTypeModel = new CurrentTypeModel();
		try {
			let data = await currentTypeModel.loadCurrentTypeCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let currentTypeModel = new CurrentTypeModel();
		try {
			let data = await currentTypeModel.saveCurrentType(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let currentTypeModel = new CurrentTypeModel();
		try {
			let data = await currentTypeModel.delCurrentType(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}