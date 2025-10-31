import { Router } from "express";
import CntrStock from "../controllers/dt-cntr-stocks.js";
import pubFunction from '../libs/functions.js';
class CntrStockRoutes {
	router = Router();
	controller = new CntrStock();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewCntrStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCntrStock', 'scope:CFS_CntrStock-view') }, this.controller.view);
		this.router.post("/getCntrStockVTOS", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getCntrStockVTOS', 'scope:CFS_CntrStock-getVTOS') }, this.controller.getVTOSCntrStock);
		this.router.post("/saveCntrStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveCntrStock', 'scope:CFS_CntrStock-save') }, this.controller.save);
		this.router.post("/delCntrStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delCntrStock', 'scope:CFS_CntrStock-delete') }, this.controller.delete);
	}
}
export default new CntrStockRoutes().router;