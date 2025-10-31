import { Router } from "express";
import JobQuantityCheck from "../controllers/job-quantity-check.js";
import pubFunction from '../libs/functions.js';
class JobQuantityCheckRoutes {
	router = Router();
	controller = new JobQuantityCheck();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewJobQuantity", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewJobQuantity', 'scope:CFS_JobQuantity-view') }, this.controller.view);
		this.router.post("/viewJobQuantityCheck", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewJobQuantityCheck', 'scope:CFS_JobQuantity-viewCheck') }, this.controller.viewCheck);
		this.router.post("/getJobQuantityInfo", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getJobQuantityInfo', 'scope:CFS_JobQuantity-getInfo') }, this.controller.getInfo);
		this.router.post("/confirmJobQuantityIn", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmJobQuantityIn', 'scope:CFS_JobQuantity-confirmIn') }, this.controller.confirmPkgPalletIn);
		this.router.post("/confirmJobQuantityOut", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmJobQuantityOut', 'scope:CFS_JobQuantity-confirmOut') }, this.controller.confirmPkgPalletOut);
		this.router.post("/saveJobQuantity", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveJobQuantity', 'scope:CFS_JobQuantity-save') }, this.controller.save);
	}
}
export default new JobQuantityCheckRoutes().router;