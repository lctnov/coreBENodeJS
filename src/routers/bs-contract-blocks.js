import { Router } from "express";
import ContractBlock from "../controllers/bs-contract-blocks.js";
import pubFunction from '../libs/functions.js';
class ContractBlockRoutes {
    router = Router();
    controller = new ContractBlock();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSContract", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSContractBlock', 'scope:CFS_BSContractBlock-view') }, this.controller.view);
        this.router.post("/saveBSContract", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSContractBlock', 'scope:CFS_BSContractBlock-save') }, this.controller.save);
        this.router.post("/delBSContract", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSContractBlock', 'scope:CFS_BSContractBlock-delete') }, this.controller.delete);
    }
}
export default new ContractBlockRoutes().router;