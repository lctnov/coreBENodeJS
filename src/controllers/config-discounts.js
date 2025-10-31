import 'dotenv/config';
import ConfigDiscountsModel from '../models/config-discounts_model.js';

export default class ConfigDiscountsController {
	async viewConfDis(req, res) {
		let configDiscountsModel = new ConfigDiscountsModel();
		try {
			let data = await configDiscountsModel.loadConfigDiscount(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewCode(req, res) {
		let configDiscountsModel = new ConfigDiscountsModel();
		try {
			let data = await configDiscountsModel.loadConfigDiscountCode(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async save(req, res) {
		let configDiscountsModel = new ConfigDiscountsModel();
		try {
			let data = await configDiscountsModel.saveConfigDiscounts(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async delete(req, res) {
		let configDiscountsModel = new ConfigDiscountsModel();
		try {
			let data = await configDiscountsModel.delConfigDiscounts(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}