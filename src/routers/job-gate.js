import { Router } from "express";
import JobGate from "../controllers/job-gate.js";
import pubFunction from '../libs/functions.js';
class JobGateRoutes {
	router = Router();
	controller = new JobGate();
	funcs = new pubFunction();
	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		this.router.post("/viewJobGateTruck", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_viewJobGateTruck', 'scope:CFS_JobGate-viewTruck') }, this.controller.viewTruck);
		this.router.post("/confirmJobGateOrder", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmJobGateOrder', 'scope:CFS_JobGate-confirmOrder') }, this.controller.confirmOrder);
		this.router.post("/confirmJobGateIN", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmJobGateIN', 'scope:CFS_JobGate-confirmIN') }, this.controller.confirmOrderTruckIN);
		this.router.post("/confirmJobGateOUT", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_confirmJobGateOUT', 'scope:CFS_JobGate-confirmOUT') }, this.controller.confirmOrderTruckOUT);
		this.router.post("/getJobGateTruck", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getJobGateTruck', 'scope:CFS_JobGate-getTruck') }, this.controller.getTruck);
		this.router.post("/getJobGateWarehouse", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_getJobGateWarehouse', 'scope:CFS_JobGate-getWarehouse') }, this.controller.getTruckViaWarehouse);
		this.router.post("/saveJobGateIN", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveJobGateIN', 'scope:CFS_JobGate-saveIN') }, this.controller.saveDataIN);
		this.router.post("/saveJobGateOUT", (req, res, next) => { this.funcs.auth(req, res, next, 'res:CFS_saveJobGateOUT', 'scope:CFS_JobGate-saveOUT') }, this.controller.saveDataOUT);
	}
}
export default new JobGateRoutes().router;