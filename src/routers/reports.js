import { Router } from "express";
import Reports from "../controllers/reports.js";
import pubFunction from '../libs/functions.js';
class ReportsRoutes {
	router = Router();
	controller = new Reports();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/getReport", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getReport', 'scope:CFS_Report-get') }, this.controller.getData);
	}
}
export default new ReportsRoutes().router;