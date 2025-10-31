import 'dotenv/config';
import EquipmentModel from '../models/bs-equipments_model.js';

export default class EquipmentController {
    async view(req, res) {
        let equipmentModel = new EquipmentModel();
        try {
            let data = await equipmentModel.loadEquipment(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewItem(req, res) {
        let equipmentModel = new EquipmentModel();
        try {
            let data = await equipmentModel.loadEquipmentItem(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let equipmentModel = new EquipmentModel();
        try {
            let data = await equipmentModel.saveEquipment(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let equipmentModel = new EquipmentModel();
        try {
            let data = await equipmentModel.delEquipment(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}