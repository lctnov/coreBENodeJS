import { Router } from "express";
import DtOrder from "../controllers/dt-order.js";
import pubFunction from '../libs/functions.js';
class DtOrderRoutes {
	router = Router();
	controller = new DtOrder();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewDTOrder", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTOrder', 'scope:CFS_DTOrder-view') }, this.controller.view);
		this.router.post("/getDTOrderBill", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTOrderBill', 'scope:CFS_DTOrder-getBill') }, this.controller.getHousebill);
		this.router.post("/getDTOrder", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTOrder', 'scope:CFS_DTOrder-getOrder') }, this.controller.getOrder);
		this.router.post("/getDTOrderInfo", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTOrderInfo', 'scope:CFS_DTOrder-getInfo') }, this.controller.getInfo);
		this.router.post("/confirmDTOrderIN", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmDTOrderIN', 'scope:CFS_DTOrder-confirmOrderIN') }, this.controller.confirmOrderIN);
		this.router.post("/confirmDTOrderOUT", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmDTOrderOUT', 'scope:CFS_DTOrder-confirmOrderOUT') }, this.controller.confirmOrderOUT);
		this.router.post("/saveDTOrder", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTOrder', 'scope:CFS_DTOrder-save') }, this.controller.save);
		this.router.post("/updateDTOrderCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_updateDTOrder', 'scope:CFS_DTOrder-update') }, this.controller.saveOrder);
	}
}
export default new DtOrderRoutes().router;