import { Router } from "express";
import MenuController from "../controllers/sa-menus.js";

class MenuRoutes {
    router = Router();
    controller = new MenuController();
    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/view", this.controller.view);
    }
}
export default new MenuRoutes().router;