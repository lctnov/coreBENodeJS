import { Router } from "express";
import Block from "../controllers/bs-blocks.js";
import pubFunction from '../libs/functions.js';
class BlockRoutes {
    router = Router();
    controller = new Block();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSBlock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSBlock', 'scope:CFS_BSBlock-view') }, this.controller.view);
        this.router.post("/getBSBlock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getBSBlock', 'scope:CFS_BSBlock-get') }, this.controller.viewBlock);
        this.router.post("/getBSBlockCell", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getBSBlockCell', 'scope:CFS_BSBlock-getCell') }, this.controller.viewCell);
        this.router.post("/saveBSBlock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSBlock', 'scope:CFS_BSBlock-save') }, this.controller.save);
        this.router.post("/saveBSBlockStatus", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSBlockStatus', 'scope:CFS_BSBlock-saveStatus') }, this.controller.saveStatus);
        this.router.post("/delBSBlock", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSBlock', 'scope:CFS_BSBlock-delete') }, this.controller.delete);
    }
}
export default new BlockRoutes().router;