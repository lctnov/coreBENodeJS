import 'dotenv/config';
import ExeSupervisionModel from '../models/executive-supervision_model.js';

export default class ExeSupervisionController {
	async viewData(req, res) {
		let exeSupervisionModel = new ExeSupervisionModel();
		try {
			let data = await exeSupervisionModel.loadExeSupervisionData(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewDevices(req, res) {
		let exeSupervisionModel = new ExeSupervisionModel();
		try {
			let data = await exeSupervisionModel.loadExeSupervisionDevice(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getPortControl(req, res) {
		let exeSupervisionModel = new ExeSupervisionModel();
		try {
			let data = await exeSupervisionModel.loadExeSupervisionPortControl(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getCheck(req, res) {
		let exeSupervisionModel = new ExeSupervisionModel();
		try {
			let data = await exeSupervisionModel.loadExeSupervisionCheck(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getJobStock(req, res) {
		let exeSupervisionModel = new ExeSupervisionModel();
		try {
			let data = await exeSupervisionModel.loadExeSupervisionJobStock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getBlock(req, res) {
		let exeSupervisionModel = new ExeSupervisionModel();
		try {
			let data = await exeSupervisionModel.loadExeSupervisionBlock(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}