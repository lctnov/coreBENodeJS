import 'dotenv/config';
import GateModel from '../models/bs-gates_model.js';

export default class GateController {
    async view(req, res) {
        let gateModel = new GateModel();
        try {
            let data = await gateModel.loadGate(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let gateModel = new GateModel();
        try {
            let data = await gateModel.saveGate(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let gateModel = new GateModel();
        try {
            let data = await gateModel.delGate(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}