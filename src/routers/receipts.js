import { Router } from "express";
import Receipts from "../controllers/receipts.js";
import pubFunction from '../libs/functions.js';
class ReceiptRoutes {
	router = Router();
	controller = new Receipts();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/getReceipt", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getReceipt', 'scope:CFS_Receipt-get') }, this.controller.getData);
	}
}
export default new ReceiptRoutes().router;