import 'dotenv/config';
import ContractBlockModel from '../models/bs-contracts-blocks_model.js';

export default class ContractBlockController {
    async view(req, res) {
        let contractBlockModel = new ContractBlockModel();
        try {
            let data = await contractBlockModel.loadContractBlock(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let contractBlockModel = new ContractBlockModel();
        try {
            let data = await contractBlockModel.saveContractBlock(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let contractBlockModel = new ContractBlockModel();
        try {
            let data = await contractBlockModel.delContractBlock(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}