import { Router } from "express";
import PackageMnf from "../controllers/dt-package-mnf-ld.js";
import pubFunction from '../libs/functions.js';
class PackageMnfRoutes {
	router = Router();
	controller = new PackageMnf();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewDTPkgMnfLd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTPkgMnfLd', 'scope:CFS_DTPkgMnfLd-view') }, this.controller.view);
		this.router.post("/viewDTPkgMnfLdCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTPkgMnfLdCode', 'scope:CFS_DTPkgMnfLd-viewCode') }, this.controller.viewCode);
		this.router.post("/getDTPkgMnfLdContainer", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTPkgMnfLdContainer', 'scope:CFS_DTPkgMnfLd-getContainer') }, this.controller.getContainer);
		this.router.post("/getDTPkgMnfLdInOutStore", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTPkgMnfLdInOutStore', 'scope:CFS_DTPkgMnfLd-getInOutStore') }, this.controller.getInOutStore);
		this.router.post("/saveDTPkgMnfLd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTPkgMnfLd', 'scope:CFS_DTPkgMnfLd-save') }, this.controller.save);
		this.router.post("/delDTPkgMnfLd", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delDTPkgMnfLd', 'scope:CFS_DTPkgMnfLd-delete') }, this.controller.delete);
	}
}
export default new PackageMnfRoutes().router;