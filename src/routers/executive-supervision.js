import { Router } from "express";
import ExeSupervision from "../controllers/executive-supervision.js";
import pubFunction from '../libs/functions.js';
class ExeSupervisionRoutes {
	router = Router();
	controller = new ExeSupervision();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewExSupervisor", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewExSupervisor', 'scope:CFS_ExSupervisor-view') }, this.controller.viewData);
		this.router.post("/viewExSupervisorDevices", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewExSupervisorDevices', 'scope:CFS_ExSupervisor-viewDevices') }, this.controller.viewDevices);
		this.router.post("/getExSupervisorPortControl", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getExSupervisorPortControl', 'scope:CFS_ExSupervisor-getPortControl') }, this.controller.getPortControl);
		this.router.post("/getExSupervisorCheck", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getExSupervisorCheck', 'scope:CFS_ExSupervisor-getCheck') }, this.controller.getCheck);
		this.router.post("/getExSupervisorJobStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getExSupervisorJobStock', 'scope:CFS_ExSupervisor-getJobStock') }, this.controller.getJobStock);
		this.router.post("/getExSupervisorBlock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getExSupervisorBlock', 'scope:CFS_ExSupervisor-getBlock') }, this.controller.getBlock);
	}
}
export default new ExeSupervisionRoutes().router;