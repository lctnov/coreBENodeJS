import { Router } from "express";
import CapacityController from "../controllers/capacity.js";
import pubFunction from '../libs/functions.js';
class CapacityRoutes {
    router = Router();
    controller = new CapacityController();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/getCapacity", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getCapacity', 'scope:CFS_getCapacity-view') }, this.controller.getCapacity);
        this.router.post("/getStatictics", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getStatictics', 'scope:CFS_getStatictics-view') }, this.controller.getStatictics);
    }
}
export default new CapacityRoutes().router;