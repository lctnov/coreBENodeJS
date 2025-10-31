import { Router } from "express";
import Gate from "../controllers/bs-gates.js";
import pubFunction from '../libs/functions.js';
class GateRoutes {
    router = Router();
    controller = new Gate();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSGate", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSGate', 'scope:CFS_BSGate-view') }, this.controller.view);
        this.router.post("/saveBSGate", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSGate', 'scope:CFS_BSGate-save') }, this.controller.save);
        this.router.post("/delBSGate", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSGate', 'scope:CFS_BSGate-delete') }, this.controller.delete);
    }
}
export default new GateRoutes().router;