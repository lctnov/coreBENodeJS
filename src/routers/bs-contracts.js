import { Router } from "express";
import Contract from "../controllers/bs-contracts.js";
import pubFunction from '../libs/functions.js';
class ContractRoutes {
    router = Router();
    controller = new Contract();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSContract", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSContract', 'scope:CFS_BSContract-view') }, this.controller.view);
        this.router.post("/saveBSContract", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSContract', 'scope:CFS_BSContract-save') }, this.controller.save);
        this.router.post("/delBSContract", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSContract', 'scope:CFS_BSContract-delete') }, this.controller.delete);
    }
}
export default new ContractRoutes().router;