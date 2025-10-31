import 'dotenv/config';
import ConfigAttachServicesModel from '../models/config-attach-services_model.js';

export default class ConfigAttachServicesController {
	async view(req, res) {
		let configAttachServicesModel = new ConfigAttachServicesModel();
		try {
			let data = await configAttachServicesModel.loadConfigAttachServices(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let configAttachServicesModel = new ConfigAttachServicesModel();
		try {
			let data = await configAttachServicesModel.saveConfigAttachServices(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}