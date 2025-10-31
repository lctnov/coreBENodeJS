import { Router } from "express";
import TrfStd from "../controllers/trf-stds.js";
import pubFunction from '../libs/functions.js';
class TrfStdRoutes {
	router = Router();
	controller = new TrfStd();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewTrfStd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewTrfStd', 'scope:CFS_TrfStd-view') }, this.controller.view);
		this.router.post("/viewTrfStdCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewTrfStdCode', 'scope:CFS_TrfStd-viewCode') }, this.controller.viewCode);
		this.router.post("/viewTrfStdTemp", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewTrfStdTemp', 'scope:CFS_TrfStd-viewTemp') }, this.controller.viewTrfTemplate);
		this.router.post("/saveTrfStd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveTrfStd', 'scope:CFS_TrfStd-save') }, this.controller.save);
		this.router.post("/delTrfStd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delTrfStd', 'scope:CFS_TrfStd-delete') }, this.controller.delete);
		this.router.post("/getTrfStdBill", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getTrfStdBill', 'scope:CFS_TrfStd-getBill') }, this.controller.getToBill);
		this.router.post("/getTrfStdInfo", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getTrfStdInfo', 'scope:CFS_TrfStd-getInfo') }, this.controller.getCusInfo);
		this.router.post("/getTrfStdBillIn", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getTrfStdBillIn', 'scope:CFS_TrfStd-getBillIn') }, this.controller.getToBillExOrderIn);
		this.router.post("/getTrfStdBillOut", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getTrfStdBillOut', 'scope:CFS_TrfStd-getBillOut') }, this.controller.getToBillExOrderOut);
	}
}
export default new TrfStdRoutes().router;