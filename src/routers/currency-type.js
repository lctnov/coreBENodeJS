import { Router } from "express";
import CurrentType from "../controllers/currency-type.js";
import pubFunction from '../libs/functions.js';
class CurrentTypeRoutes {
	router = Router();
	controller = new CurrentType();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewCurrentType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCurrentType', 'scope:CFS_CurrentType-view') }, this.controller.view);
		this.router.post("/viewCurrentTypeCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewCurrentTypeCode', 'scope:CFS_CurrentType-viewCode') }, this.controller.viewCode);
		this.router.post("/saveCurrentType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveCurrentType', 'scope:CFS_CurrentType-save') }, this.controller.save);
		this.router.post("/delCurrentType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delCurrentType', 'scope:CFS_CurrentType-delete') }, this.controller.delete);
	}
}
export default new CurrentTypeRoutes().router;