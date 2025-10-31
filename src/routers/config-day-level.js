import { Router } from "express";
import ConfigDayLevel from "../controllers/config-day-level.js";
import pubFunction from '../libs/functions.js';
class ConfigDayLevelRoutes {
	router = Router();
	controller = new ConfigDayLevel();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewCfgDayLevel", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgDayLevel', 'scope:CFS_CfgDayLevel-view') }, this.controller.view);
		this.router.post("/viewCfgDayLevelCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgDayLevelCode', 'scope:CFS_CfgDayLevel-viewCode') }, this.controller.viewCode);
		this.router.post("/saveCfgDayLevel", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveCfgDayLevel', 'scope:CFS_CfgDayLevel-save') }, this.controller.save);
		this.router.post("/delCfgDayLevel", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delCfgDayLevel', 'scope:CFS_CfgDayLevel-delete') }, this.controller.delete);
	}
}
export default new ConfigDayLevelRoutes().router;