import { Router } from "express";
import Unit from "../controllers/bs-units.js";
import pubFunction from '../libs/functions.js';
class UnitRoutes {
    router = Router();
    controller = new Unit();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSUnit", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSUnit', 'scope:CFS_BSUnit-view') }, this.controller.view);
        this.router.post("/viewBSUnitCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSUnitCode', 'scope:CFS_BSUnit-viewCode') }, this.controller.viewCode);
        this.router.post("/saveBSUnit", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSUnit', 'scope:CFS_BSUnit-save') }, this.controller.save);
        this.router.post("/delBSUnit", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSUnit', 'scope:CFS_BSUnit-delete') }, this.controller.delete);
    }
}
export default new UnitRoutes().router;