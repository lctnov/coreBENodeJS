import 'dotenv/config';
import RomoocModel from '../models/bs-romooc_model.js';

export default class RomoocController {
    async view(req, res) {
        let romoocModel = new RomoocModel();
        try {
            let data = await romoocModel.loadRommoc(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewCode(req, res) {
        let romoocModel = new RomoocModel();
        try {
            let data = await romoocModel.loadRommocCode(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let romoocModel = new RomoocModel();
        try {
            let data = await romoocModel.saveRommoc(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let romoocModel = new RomoocModel();
        try {
            let data = await romoocModel.delRommoc(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}