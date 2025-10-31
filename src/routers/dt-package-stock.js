import { Router } from "express";
import DtPkgStock from "../controllers/dt-package-stock.js";
import pubFunction from '../libs/functions.js';
class DtPkgStockRoutes {
	router = Router();
	controller = new DtPkgStock();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewDTPkgStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTPkgStock', 'scope:CFS_DTPkgStock-view') }, this.controller.view);
		this.router.post("/viewDTPkgStockOut", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTPkgStockOut', 'scope:CFS_DTPkgStock-viewOut') }, this.controller.viewOut);
		this.router.post("/viewDTPkgStockWarehouse", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTPkgStockWarehouse', 'scope:CFS_DTPkgStock-viewWarehouse') }, this.controller.viewWarehouse);
		this.router.post("/viewDTPkgStockPallet", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTPkgStockPallet', 'scope:CFS_DTPkgStock-viewPallet') }, this.controller.viewPallet);
		this.router.post("/getDTPkgStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTPkgStock', 'scope:CFS_DTPkgStock-get') }, this.controller.get);
		this.router.post("/getDTPkgStockPallet", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTPkgStockPallet', 'scope:CFS_DTPkgStock-getPallet') }, this.controller.getPallet);
		this.router.post("/saveDTPkgStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTPkgStock', 'scope:CFS_DTPkgStock-save') }, this.controller.save);
		this.router.post("/saveDTPkgStockTLHQ", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTPkgStockTLHQ', 'scope:CFS_DTPkgStock-saveTLHQ') }, this.controller.saveTLHQ);
		this.router.post("/filterDTPkgStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_filterDTPkgStock', 'scope:CFS_DTPkgStock-filterPkgStock') }, this.controller.changePkgStock);
	}
}
export default new DtPkgStockRoutes().router;