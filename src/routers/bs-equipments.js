import { Router } from "express";
import Equipment from "../controllers/bs-equipments.js";
import pubFunction from '../libs/functions.js';
class EquipmentRoutes {
    router = Router();
    controller = new Equipment();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSEquipment", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSEquipment', 'scope:CFS_BSEquipment-view') }, this.controller.view);
        this.router.post("/getBSEquipment", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getBSEquipment', 'scope:CFS_BSEquipment-get') }, this.controller.viewItem);
        this.router.post("/saveBSEquipment", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSEquipment', 'scope:CFS_BSEquipment-save') }, this.controller.save);
        this.router.post("/delBSEquipment", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSEquipment', 'scope:CFS_BSEquipment-delete') }, this.controller.delete);
    }
}
export default new EquipmentRoutes().router;