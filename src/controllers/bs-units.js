import 'dotenv/config';
import UnitModel from '../models/bs-units_model.js';

export default class UnitController {
    async view(req, res) {
        let unitModel = new UnitModel();
        try {
            let data = await unitModel.loadUnit(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewCode(req, res) {
        let unitModel = new UnitModel();
        try {
            let data = await unitModel.loadUnitCode(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let unitModel = new UnitModel();
        try {
            let data = await unitModel.saveUnit(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let unitModel = new UnitModel();
        try {
            let data = await unitModel.delUnit(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}