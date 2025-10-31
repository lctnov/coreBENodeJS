import { Router } from "express";
import ConfigFreeDays from "../controllers/config-free-days.js";
import pubFunction from '../libs/functions.js';
class ConfigFreeDaysRoutes {
	router = Router();
	controller = new ConfigFreeDays();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewCfgFreeDay", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgFreeDay', 'scope:CFS_CfgFreeDay-view') }, this.controller.view);
		this.router.post("/viewCfgFreeDayTime", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgFreeDayTime', 'scope:CFS_CfgFreeDay-viewTime') }, this.controller.viewTime);
		this.router.post("/viewCfgFreeDayCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgFreeDayCode', 'scope:CFS_CfgFreeDay-viewCode') }, this.controller.viewCode);
		this.router.post("/saveCfgFreeDay", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveCfgFreeDay', 'scope:CFS_CfgFreeDay-save') }, this.controller.save);
		this.router.post("/delCfgFreeDay", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delCfgFreeDay', 'scope:CFS_CfgFreeDay-delete') }, this.controller.delete);
	}
}
export default new ConfigFreeDaysRoutes().router;