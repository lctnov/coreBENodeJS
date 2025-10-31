import 'dotenv/config';
import AccountModel from '../models/accounts_model.js';

export default class AccountController {
	async view(req, res) {
		let accountModel = new AccountModel();
		try {
			let data = await accountModel.loadAccount(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			});
		}
	}

	async save(req, res) {
		let accountModel = new AccountModel();
		try {
			let data = await accountModel.saveAccount(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let accountModel = new AccountModel();
		try {
			let data = await accountModel.delAccount(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}