import { Router } from "express";
import BSItemType from "../controllers/bs-item-type.js";
import pubFunction from '../libs/functions.js';
class ItemTypeRoutes {
    router = Router();
    controller = new BSItemType();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSItemType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSItemType', 'scope:CFS_BSItemType-view') }, this.controller.view);
        this.router.post("/viewBSItemTypeCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSItemTypeCode', 'scope:CFS_BSItemType-viewCode') }, this.controller.viewCode);
        this.router.post("/saveBSItemType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSItemType', 'scope:CFS_BSItemType-save') }, this.controller.save);
        this.router.post("/delBSItemType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSItemType', 'scope:CFS_BSItemType-delete') }, this.controller.delete);
    }
}
export default new ItemTypeRoutes().router;