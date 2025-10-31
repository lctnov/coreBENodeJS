import { Router } from "express";
import EquipmentType from "../controllers/bs-equipments-types.js";
import pubFunction from '../libs/functions.js';
class EquipmentTypeRoutes {
    router = Router();
    controller = new EquipmentType();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewBSEquiType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewBSEquiType', 'scope:CFS_BSEquiType-view') }, this.controller.view);
        this.router.post("/saveBSEquiType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveBSEquiType', 'scope:CFS_BSEquiType-save') }, this.controller.save);
        this.router.post("/delBSEquiType", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delBSEquiType', 'scope:CFS_BSEquiType-delete') }, this.controller.delete);
    }
}
export default new EquipmentTypeRoutes().router;