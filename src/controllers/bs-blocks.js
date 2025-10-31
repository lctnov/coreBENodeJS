import 'dotenv/config';
import BlockModel from '../models/bs-blocks_model.js';

export default class BlockController {
    async view(req, res) {
        let blockModel = new BlockModel();
        try {
            let data = await blockModel.loadBlock(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewBlock(req, res) {
        let blockModel = new BlockModel();
        try {
            let data = await blockModel.loadFilterBlock(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewCell(req, res) {
        let blockModel = new BlockModel();
        try {
            let data = await blockModel.loadCell(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let blockModel = new BlockModel();
        try {
            let data = await blockModel.saveBlock(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async saveStatus(req, res) {
        let blockModel = new BlockModel();
        try {
            let data = await blockModel.saveBlockStatus(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let blockModel = new BlockModel();
        try {
            let data = await blockModel.delBlock(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}