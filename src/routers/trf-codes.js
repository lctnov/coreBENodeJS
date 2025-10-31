import { Router } from "express";
import TrfCode from "../controllers/trf-codes.js";
import pubFunction from '../libs/functions.js';
class TrfCodeRoutes {
	router = Router();
	controller = new TrfCode();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewTrfCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewTrfCode', 'scope:CFS_TrfCode-view') }, this.controller.view);
		this.router.post("/getTrfCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getTrfCode', 'scope:CFS_TrfCode-get') }, this.controller.viewCode);
		this.router.post("/saveTrfCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveTrfCode', 'scope:CFS_TrfCode-save') }, this.controller.save);
		this.router.post("/delTrfCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delTrfCode', 'scope:CFS_TrfCode-delete') }, this.controller.delete);
	}
}
export default new TrfCodeRoutes().router;