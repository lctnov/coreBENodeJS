import { Router } from "express";
import JobStock from "../controllers/job-stock.js";
import pubFunction from '../libs/functions.js';
class JobStockRoutes {
	router = Router();
	controller = new JobStock();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewJobStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewJobStock', 'scope:CFS_JobStock-view') }, this.controller.view);
		this.router.post("/viewJobStockCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewJobStockCode', 'scope:CFS_JobStock-viewCode') }, this.controller.viewCode);
		this.router.post("/saveJobStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveJobStock', 'scope:CFS_JobStock-save') }, this.controller.save);
	}
}
export default new JobStockRoutes().router;