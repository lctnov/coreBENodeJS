import { Router } from "express";
import VesselVisit from "../controllers/dt-vessel-visits.js";
import pubFunction from '../libs/functions.js';
class VesselVisitRoutes {
    router = Router();
    controller = new VesselVisit();
    funcs = new pubFunction();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/viewDTVessel", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTVessel', 'scope:CFS_DTVessel-view') }, this.controller.view);
        this.router.post("/viewDTVesselCode", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewDTVesselCode', 'scope:CFS_DTVessel-viewCode') }, this.controller.viewCode);
        this.router.post("/saveDTVessel", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveDTVessel', 'scope:CFS_DTVessel-save') }, this.controller.save);
        this.router.post("/delDTVessel", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_delDTVessel', 'scope:CFS_DTVessel-delete') }, this.controller.delete);
        this.router.post("/getDTVesselVTOS", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getDTVesselVTOS', 'scope:CFS_DTVessel-getVTOS') }, this.controller.getVTOSVessel);
    }
}
export default new VesselVisitRoutes().router;