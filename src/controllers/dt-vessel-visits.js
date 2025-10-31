import 'dotenv/config';
import VesselVisitModel from '../models/dt-vessel-visits_model.js';

export default class VesselVisitController {
    async view(req, res) {
        let vesselVisitModel = new VesselVisitModel();
        try {
            let data = await vesselVisitModel.loadVesselVisit(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewCode(req, res) {
        let vesselVisitModel = new VesselVisitModel();
        try {
            let data = await vesselVisitModel.loadVesselVisitCode(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let vesselVisitModel = new VesselVisitModel();
        try {
            let data = await vesselVisitModel.saveVesselVisit(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let vesselVisitModel = new VesselVisitModel();
        try {
            let data = await vesselVisitModel.delVesselVisit(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async getVTOSVessel(req, res) {
        let vesselVisitModel = new VesselVisitModel();
        try {
            let data = await vesselVisitModel.getVTOSVesselVisit(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}