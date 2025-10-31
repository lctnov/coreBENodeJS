import { Router } from "express";
import Account from "../controllers/accounts.js";
import pubFunction from '../libs/functions.js';
class AccountRoutes {
	router = Router();
	controller = new Account();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewAccount", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewAccount', 'scope:CFS_Account-view') }, this.controller.view);
		this.router.post("/saveAccount", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveAccount', 'scope:CFS_Account-save') }, this.controller.save);
		this.router.post("/delAccount", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delAccount', 'scope:CFS_Account-delete') }, this.controller.delete);
	}
}
export default new AccountRoutes().router;