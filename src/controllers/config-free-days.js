import 'dotenv/config';
import ConfigFreeDaysModel from '../models/config-free-days_model.js';

export default class ConfigFreeDaysController {
	async view(req, res) {
		let configFreeDaysModel = new ConfigFreeDaysModel();
		try {
			let data = await configFreeDaysModel.loadConfigFreeDays(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewTime(req, res) {
		let configFreeDaysModel = new ConfigFreeDaysModel();
		try {
			let data = await configFreeDaysModel.loadConfigFreeDaysTime(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let configFreeDaysModel = new ConfigFreeDaysModel();
		try {
			let data = await configFreeDaysModel.loadConfigFreeDaysCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let configFreeDaysModel = new ConfigFreeDaysModel();
		try {
			let data = await configFreeDaysModel.saveConfigFreeDays(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let configFreeDaysModel = new ConfigFreeDaysModel();
		try {
			let data = await configFreeDaysModel.delConfigConfigFreeDays(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}