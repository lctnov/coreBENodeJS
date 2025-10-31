import 'dotenv/config';
import ConfigDayLevelModel from '../models/config-day-level_model.js';

export default class ConfigDayLevelController {
	async view(req, res) {
		let configDayLevelModel = new ConfigDayLevelModel();
		try {
			let data = await configDayLevelModel.loadConfigDayLevel(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let configDayLevelModel = new ConfigDayLevelModel();
		try {
			let data = await configDayLevelModel.loadConfigDayLevelCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let configDayLevelModel = new ConfigDayLevelModel();
		try {
			let data = await configDayLevelModel.saveConfigDayLevel(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let configDayLevelModel = new ConfigDayLevelModel();
		try {
			let data = await configDayLevelModel.delConfigDayLevel(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}