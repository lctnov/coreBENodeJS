import 'dotenv/config';
import JobGateModel from '../models/job-gate_model.js';

export default class JobGateController {
	async viewTruck(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.loadJobGate(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmOrder(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.confirmJobGate(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmOrderTruckIN(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.confirmJobGateOrderIn(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmOrderTruckOUT(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.confirmJobGateOrderOut(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getTruck(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.getJobGetTruck(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getTruckViaWarehouse(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.getJobGetTruckViaWarehouse(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async saveDataIN(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.saveJobGateIN(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async saveDataOUT(req, res) {
		let jobGateModel = new JobGateModel();
		try {
			let data = await jobGateModel.saveJobGateOut(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}