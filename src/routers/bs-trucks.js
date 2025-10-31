import { Router } from "express";
import Truck from "../controllers/bs-trucks.js";
import pubFunction from '../libs/functions.js';
class TruckRoutes {
    router = Router();
    controller = new Truck();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSTruck", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSTruck', 'scope:CFS_BSTruck-view') }, this.controller.view);
        this.router.post("/viewBSTruckCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSTruckCode', 'scope:CFS_BSTruck-viewCode') }, this.controller.viewCode);
        this.router.post("/saveBSTruck", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSTruck', 'scope:CFS_BSTruck-save') }, this.controller.save);
        this.router.post("/delBSTruck", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSTruck', 'scope:CFS_BSTruck-delete') }, this.controller.delete);
    }
}
export default new TruckRoutes().router;