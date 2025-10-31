import { Router } from "express";
import Method from "../controllers/bs-method.js";
import pubFunction from '../libs/functions.js';
class MethodRoutes {
    router = Router();
    controller = new Method();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSMethod", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSMethod', 'scope:CFS_BSMethod-view') }, this.controller.view);
        this.router.post("/viewBSMethodStatus", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSMethodStatus', 'scope:CFS_BSMethod-viewStatus') }, this.controller.viewStatus);
        this.router.post("/viewBSMethodPlan", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSMethodPlan', 'scope:CFS_BSMethod-viewPlan') }, this.controller.viewPlan);
        this.router.post("/getBSMethod", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getBSMethod', 'scope:CFS_BSMethod-get') }, this.controller.get);
        this.router.post("/getBSMethodAllServies", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getBSMethodAllServies', 'scope:CFS_BSMethod-getAllServices') }, this.controller.getAllServies);
        this.router.post("/saveBSMethod", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSMethod', 'scope:CFS_BSMethod-save') }, this.controller.save);
        this.router.post("/delBSMethod", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSMethod', 'scope:CFS_BSMethod-delete') }, this.controller.delete);
    }
}
export default new MethodRoutes().router;