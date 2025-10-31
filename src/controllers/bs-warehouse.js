import 'dotenv/config';
import WarehouseModel from '../models/bs-warehouse_model.js';

export default class WarehouseController {
    async view(req, res) {
        let wareHouseModel = new WarehouseModel();
        try {
            let data = await wareHouseModel.loadWarehouse(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let wareHouseModel = new WarehouseModel();
        try {
            let data = await wareHouseModel.saveWarehouse(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let wareHouseModel = new WarehouseModel();
        try {
            let data = await wareHouseModel.delWarehouse(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}