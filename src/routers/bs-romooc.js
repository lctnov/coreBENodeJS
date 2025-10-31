import { Router } from "express";
import Romooc from "../controllers/bs-romooc.js";
import pubFunction from '../libs/functions.js';
class RomoocRoutes {
    router = Router();
    controller = new Romooc();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSRomooc", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSRomooc', 'scope:CFS_BSRomooc-view') }, this.controller.view);
        this.router.post("/viewBSRomoocCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSRomoocCode', 'scope:CFS_BSRomooc-viewCode') }, this.controller.viewCode);
        this.router.post("/saveBSRomooc", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSRomooc', 'scope:CFS_BSRomooc-save') }, this.controller.save);
        this.router.post("/delBSRomooc", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSRomooc', 'scope:CFS_BSRomooc-delete') }, this.controller.delete);
    }
}
export default new RomoocRoutes().router;