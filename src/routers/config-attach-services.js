import { Router } from "express";
import ConfigAttachServices from "../controllers/config-attach-services.js";
import pubFunction from '../libs/functions.js';
class ConfigAttachServicesRoutes {
	router = Router();
	controller = new ConfigAttachServices();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewCfgAttachSrv", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCfgAttachSrv', 'scope:CFS_CfgAttachSrv-view') }, this.controller.view);
		this.router.post("/saveCfgAttachSrv", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveCfgAttachSrv', 'scope:CFS_CfgAttachSrv-save') }, this.controller.save);
	}
}
export default new ConfigAttachServicesRoutes().router;