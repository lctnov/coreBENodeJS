import 'dotenv/config';
import CustomerTypeModel from '../models/bs-customer-type_model.js';

export default class CustomerTypeController {
    async view(req, res) {
        let customerTypeModel = new CustomerTypeModel();
        try {
            let data = await customerTypeModel.loadCustomerType(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let customerTypeModel = new CustomerTypeModel();
        try {
            let data = await customerTypeModel.saveCustomerType(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let customerTypeModel = new CustomerTypeModel();
        try {
            let data = await customerTypeModel.delCustomerType(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}