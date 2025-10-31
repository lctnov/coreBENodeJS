import { Router } from "express";
import Customer from "../controllers/bs-customer.js";
import pubFunction from '../libs/functions.js';
class CustomerRoutes {
    router = Router();
    controller = new Customer();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSCustomer", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSCustomer', 'scope:CFS_BSCustomer-view') }, this.controller.view);
        this.router.post("/viewBSCustomerCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSCustomerCode', 'scope:CFS_BSCustomer-viewCode') }, this.controller.viewCode);
        this.router.post("/saveBSCustomer", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSCustomer', 'scope:CFS_BSCustomer-save') }, this.controller.save);
        this.router.post("/delBSCustomer", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSCustomer', 'scope:CFS_BSCustomer-delete') }, this.controller.delete);
    }
}
export default new CustomerRoutes().router;