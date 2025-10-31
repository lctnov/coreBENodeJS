import { Router } from "express";
import ManifestCNTR from "../controllers/dt-cntr-mnf-ld.js";
import pubFunction from '../libs/functions.js';
class ManifestCNTRRoutes {
	router = Router();
	controller = new ManifestCNTR();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewDTCntrMnfLd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTCntrMnfLd', 'scope:CFS_DTCntrMnfLd-view') }, this.controller.view);
		this.router.post("/getDTCntrMnfLdBill", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTCntrMnfLdBill', 'scope:CFS_DTCntrMnfLd-getBill') }, this.controller.getMasterBill);
		this.router.post("/getDTCntrMnfLdVTOS", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTCntrMnfLdVTOS', 'scope:CFS_DTCntrMnfLd-getVTOS') }, this.controller.getVTOSManifest);
		this.router.post("/saveDTCntrMnfLd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTCntrMnfLd', 'scope:CFS_DTCntrMnfLd-save') }, this.controller.save);
		this.router.post("/delDTCntrMnfLd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delDTCntrMnfLd', 'scope:CFS_DTCntrMnfLd-delete') }, this.controller.delete);
	}
}
export default new ManifestCNTRRoutes().router;