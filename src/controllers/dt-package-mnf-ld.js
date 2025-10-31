import 'dotenv/config';
import PkgManifestladingModel from '../models/dt-package-mnf-ld_model.js';

export default class CntrStockController {
	async view(req, res) {
		let pkgManifestladingModel = new PkgManifestladingModel();
		try {
			let data = await pkgManifestladingModel.loadPkgManifestld(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let pkgManifestladingModel = new PkgManifestladingModel();
		try {
			let data = await pkgManifestladingModel.loadPkgManifestldCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let pkgManifestladingModel = new PkgManifestladingModel();
		try {
			let data = await pkgManifestladingModel.savePkgManifestld(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let pkgManifestladingModel = new PkgManifestladingModel();
		try {
			let data = await pkgManifestladingModel.delPkgManifestld(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getContainer(req, res) {
		let pkgManifestladingModel = new PkgManifestladingModel();
		try {
			let data = await pkgManifestladingModel.getPkgManifestld(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async getInOutStore(req, res) {
		let pkgManifestladingModel = new PkgManifestladingModel();
		try {
			let data = await pkgManifestladingModel.getPkgManifestldStore(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}