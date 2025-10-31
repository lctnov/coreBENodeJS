import { Router } from "express";
import invVat from "../controllers/inv-vat.js";
import pubFunction from '../libs/functions.js';
class InvoiceVATRoutes {
	router = Router();
	controller = new invVat();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewInvVAT", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewInvVAT', 'scope:CFS_InvVAT-viewInv') }, this.controller.viewInv);
		this.router.post("/viewDftInvVAT", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDftInvVAT', 'scope:CFS_InvVAT-viewDftInv') }, this.controller.viewDftInv);
		this.router.post("/cancelInvVAT", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_cancelInvVAT', 'scope:CFS_InvVAT-cancelInv') }, this.controller.cancelInv);
		this.router.post("/viewInvVATXML", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewInvVATXML', 'scope:CFS_InvVAT-invXML') }, this.controller.invXML);
		this.router.get("/viewInvVATPDF", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewInvVATPDF', 'scope:CFS_InvVAT-invPDF') }, this.controller.invPDF);
		this.router.post("/releaseInvVAT", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_releaseInvVAT', 'scope:CFS_InvVAT-releaseInvVAT') }, this.controller.releaseInvVAT);
	}
}
export default new InvoiceVATRoutes().router;