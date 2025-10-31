import { Router } from "express";
import CustomerType from "../controllers/bs-customer-type.js";
import pubFunction from '../libs/functions.js';
class CustomerTypeRoutes {
    router = Router();
    controller = new CustomerType();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSCusType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSCusType', 'scope:CFS_BSCusType-view') }, this.controller.view);
        this.router.post("/saveBSCusType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSCusType', 'scope:CFS_BSCusType-save') }, this.controller.save);
        this.router.post("/delBSCusType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSCusType', 'scope:CFS_BSCusType-delete') }, this.controller.delete);
    }
}
export default new CustomerTypeRoutes().router;