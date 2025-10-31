import 'dotenv/config';
import TruckModel from '../models/bs-trucks_model.js';

export default class TruckController {
    async view(req, res) {
        let truckModel = new TruckModel();
        try {
            let data = await truckModel.loadTruck(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewCode(req, res) {
        let truckModel = new TruckModel();
        try {
            let data = await truckModel.loadTruckCode(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let truckModel = new TruckModel();
        try {
            let data = await truckModel.saveTruck(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let truckModel = new TruckModel();
        try {
            let data = await truckModel.delTruck(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}