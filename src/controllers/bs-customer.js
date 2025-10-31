import 'dotenv/config';
import CustomerModel from '../models/bs-customer_model.js';

export default class CustomerController {
    async view(req, res) {
        let customerModel = new CustomerModel();
        try {
            let data = await customerModel.loadCustomer(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async viewCode(req, res) {
        let customerModel = new CustomerModel();
        try {
            let data = await customerModel.loadCustomerCode(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async save(req, res) {
        let customerModel = new CustomerModel();
        try {
            let data = await customerModel.saveCustomer(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }

    async delete(req, res) {
        let customerModel = new CustomerModel();
        try {
            let data = await customerModel.delCustomer(req);
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            })
        }
    }
}