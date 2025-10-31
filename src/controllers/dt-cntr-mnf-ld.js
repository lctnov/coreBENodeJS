import 'dotenv/config';
import ManifestCNTRModel from '../models/dt-cntr-mnf-ld_model.js';

export default class ManifestCNTRController {
	async view(req, res) {
		let manifestCNTRModel = new ManifestCNTRModel();
		try {
			let data = await manifestCNTRModel.loadManifestCNTR(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getMasterBill(req, res) {
		let manifestCNTRModel = new ManifestCNTRModel();
		try {
			let data = await manifestCNTRModel.loadManifestCNTRCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let manifestCNTRModel = new ManifestCNTRModel();
		try {
			let data = await manifestCNTRModel.saveManifestCNTR(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let manifestCNTRModel = new ManifestCNTRModel();
		try {
			let data = await manifestCNTRModel.delManifestCNTR(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getVTOSManifest(req, res) {
		let manifestCNTRModel = new ManifestCNTRModel();
		try {
			let data = await manifestCNTRModel.getVTOSManifest(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}