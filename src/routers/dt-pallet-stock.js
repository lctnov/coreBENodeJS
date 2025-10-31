import { Router } from "express";
import DtPalletStock from "../controllers/dt-pallet-stock.js";
import pubFunction from '../libs/functions.js';
class DtPalletStockRoutes {
	router = Router();
	controller = new DtPalletStock();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewDTPalletStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTPalletStock', 'scope:CFS_DTPalletStock-view') }, this.controller.view);
		this.router.post("/getDTPalletStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTPalletStock', 'scope:CFS_DTPalletStock-viewPallet') }, this.controller.viewPallet);
		this.router.post("/saveDTPalletStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTPalletStock', 'scope:CFS_DTPalletStock-savePallet') }, this.controller.savePallet);
		this.router.post("/saveDTPalletStockJob", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTPalletStockJob', 'scope:CFS_DTPalletStock-saveJob') }, this.controller.saveJob);
		this.router.post("/confirmDTPalletStock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmDTPalletStock', 'scope:CFS_DTPalletStock-confirmJob') }, this.controller.confirmJob);

	}
}
export default new DtPalletStockRoutes().router;