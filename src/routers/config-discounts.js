import { Router } from "express";
import ConfigDiscounts from "../controllers/config-discounts.js";
import pubFunction from '../libs/functions.js';
class ConfigDiscountsRoutes {
	router = Router();
	controller = new ConfigDiscounts();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewCfgDiscount", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgDiscount', 'scope:CFS_CfgDiscount-view') }, this.controller.viewConfDis);
		this.router.post("/viewCfgDiscountCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgDiscountCode', 'scope:CFS_CfgDiscount-viewCode') }, this.controller.viewCode);
		this.router.post("/saveCfgDiscount", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveCfgDiscount', 'scope:CFS_CfgDiscount-save') }, this.controller.save);
		this.router.post("/delCfgDiscount", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delCfgDiscount', 'scope:CFS_CfgDiscount-delete') }, this.controller.delete);
	}
}
export default new ConfigDiscountsRoutes().router;