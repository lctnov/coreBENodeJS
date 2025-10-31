import 'dotenv/config';
import JobQuantityCheckModel from '../models/job-quantity-check_model.js';

export default class JobQuantityCheckController {
	async view(req, res) {
		let jobQuantityCheckModel = new JobQuantityCheckModel();
		try {
			let data = await jobQuantityCheckModel.loadJobQuantity(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCheck(req, res) {
		let jobQuantityCheckModel = new JobQuantityCheckModel();
		try {
			let data = await jobQuantityCheckModel.loadJobQuantityCheck(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getInfo(req, res) {
		let jobQuantityCheckModel = new JobQuantityCheckModel();
		try {
			let data = await jobQuantityCheckModel.getJobQuantityInfo(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmPkgPalletIn(req, res) {
		let jobQuantityCheckModel = new JobQuantityCheckModel();
		try {
			let data = await jobQuantityCheckModel.confirmJobQuantityPkgPalletIn(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async confirmPkgPalletOut(req, res) {
		let jobQuantityCheckModel = new JobQuantityCheckModel();
		try {
			let data = await jobQuantityCheckModel.confirmJobQuantityPkgPalletOut(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getTruckViaWarehouse(req, res) {
		let jobQuantityCheckModel = new JobQuantityCheckModel();
		try {
			let data = await jobQuantityCheckModel.getJobGetTruckViaWarehouse(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let jobQuantityCheckModel = new JobQuantityCheckModel();
		try {
			let data = await jobQuantityCheckModel.saveJobQuantity(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}