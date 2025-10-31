import 'dotenv/config';
import MenuModel from '../models/menu_model.js';

export default class MenuController {
    async view(req, res) {
        let menuModel = new MenuModel();
        try {
            let data = await menuModel.loadMenus(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}