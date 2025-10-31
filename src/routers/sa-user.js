import { Router } from "express";
import UserController from "../controllers/sa-user.js";
import pubFunction from '../libs/functions.js';

class UserRoutes {
  router = Router();
  controller = new UserController();
  funcs = new pubFunction();
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/login", this.controller.login);
    this.router.get("/logout", this.controller.logout);
  }
}

export default new UserRoutes().router;