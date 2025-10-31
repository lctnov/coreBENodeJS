import 'dotenv/config';
import MethodModel from '../models/bs-method_model.js';

export default class MethodController {
    async view(req, res) {
        let methodModel = new MethodModel();
        try {
            let data = await methodModel.loadMethod(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewStatus(req, res) {
        let methodModel = new MethodModel();
        try {
            let data = await methodModel.loadMethodStatus(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewPlan(req, res) {
        let methodModel = new MethodModel();
        try {
            let data = await methodModel.loadMethodPlan(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async get(req, res) {
        let methodModel = new MethodModel();
        try {
            let data = await methodModel.loadMethodGet(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async getAllServies(req, res) {
        let methodModel = new MethodModel();
        try {
            let data = await methodModel.loadMethodGetSrv(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let methodModel = new MethodModel();
        try {
            let data = await methodModel.saveMethod(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let methodModel = new MethodModel();
        try {
            let data = await methodModel.delMethod(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}