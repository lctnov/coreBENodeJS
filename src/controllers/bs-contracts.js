import 'dotenv/config';
import ContractModel from '../models/bs-contracts_model.js';

export default class ContractController {
    async view(req, res) {
        let contractModel = new ContractModel();
        try {
            let data = await contractModel.loadContract(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let contractModel = new ContractModel();
        try {
            let data = await contractModel.saveContract(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let contractModel = new ContractModel();
        try {
            let data = await contractModel.delContract(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}