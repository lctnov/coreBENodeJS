import { Router } from "express";
import ApiTos from "../controllers/api-tos.js";
import pubFunction from '../libs/functions.js';
class ApiTosRoutes {
	router = Router();
	controller = new ApiTos();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/getAPITOS", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getAPITOS', 'scope:CFS_APITOS-view') }, this.controller.getData);
	}
}
export default new ApiTosRoutes().router;