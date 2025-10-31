import 'dotenv/config';
import ConfigMinValueModel from '../models/config-min-value_model.js';

export default class ConfigMinValueController {
	async view(req, res) {
		let configMinValueModel = new ConfigMinValueModel();
		try {
			let data = await configMinValueModel.loadConfigMinValue(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let configMinValueModel = new ConfigMinValueModel();
		try {
			let data = await configMinValueModel.saveConfigMinValue(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let configMinValueModel = new ConfigMinValueModel();
		try {
			let data = await configMinValueModel.delConfigMinValue(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}