import 'dotenv/config';
import ItemTypeModel from '../models/bs-item-type_model.js';

export default class ItemTypeController {
    async view(req, res) {
        let itemTypeModel = new ItemTypeModel();
        try {
            let data = await itemTypeModel.loadItemType(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewCode(req, res) {
        let itemTypeModel = new ItemTypeModel();
        try {
            let data = await itemTypeModel.loadItemTypeCode(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let itemTypeModel = new ItemTypeModel();
        try {
            let data = await itemTypeModel.saveItemType(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let itemTypeModel = new ItemTypeModel();
        try {
            let data = await itemTypeModel.delItemType(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}