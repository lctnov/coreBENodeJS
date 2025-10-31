import { Router } from "express";
import ConfigMinValue from "../controllers/config-min-value.js";
import pubFunction from '../libs/functions.js';
class ConfigMinValueRoutes {
	router = Router();
	controller = new ConfigMinValue();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewCfgMinValue", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgMinValue', 'scope:CFS_CfgMinValue-view') }, this.controller.view);
		this.router.post("/saveCfgMinValue", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveCfgMinValue', 'scope:CFS_CfgMinValue-save') }, this.controller.save);
		this.router.post("/delCfgMinValue", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delCfgMinValue', 'scope:CFS_CfgMinValue-delete') }, this.controller.delete);
	}
}
export default new ConfigMinValueRoutes().router;