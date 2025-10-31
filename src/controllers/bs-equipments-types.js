import 'dotenv/config';
import EquipmentModel from '../models/bs-equipments-types_model.js';

export default class EquipmentTypeController {
    async view(req, res) {
        let equipmentModel = new EquipmentModel();
        try {
            let data = await equipmentModel.loadEquipmentType(req);
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
            let data = await equipmentModel.saveEquipmentType(req);
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
            let data = await equipmentModel.delEquipmentType(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}