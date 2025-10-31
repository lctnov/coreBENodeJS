import 'dotenv/config';
import CapacityModel from '../models/capacity_model.js';

export default class CapacityController {
    async getCapacity(req, res) {
        let capacityModel = new CapacityModel();
        try {
            let data = await capacityModel.loadCapacity(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async getStatictics(req, res) {
        let capacityModel = new CapacityModel();
        try {
            let data = await capacityModel.loadStatictics(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}