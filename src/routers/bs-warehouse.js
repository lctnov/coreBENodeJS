import { Router } from "express";
import BSWarehouse from "../controllers/bs-warehouse.js";
import pubFunction from '../libs/functions.js';
class WarehouseRoutes {
    router = Router();
    controller = new BSWarehouse();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSWarehouse", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSWarehouse', 'scope:CFS_BSWarehouse-view') }, this.controller.view);
        this.router.post("/saveBSWarehouse", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSWarehouse', 'scope:CFS_BSWarehouse-save') }, this.controller.save);
        this.router.post("/delBSWarehouse", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSWarehouse', 'scope:CFS_BSWarehouse-delete') }, this.controller.delete);
    }
}
export default new WarehouseRoutes().router;