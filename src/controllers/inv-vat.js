import 'dotenv/config';
import InvoiceManagementVNPT from '../thirdparty/einvoice_vnpt.js';

export default class InvoiceVATController {
	async viewInv(req, res) {
		let invoiceManagementVNPT = new InvoiceManagementVNPT();
		try {
			let data = await invoiceManagementVNPT.loadInvoiceVAT(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async viewDftInv(req, res) {
		let invoiceManagementVNPT = new InvoiceManagementVNPT();
		try {
			let data = await invoiceManagementVNPT.loadInvoiceVATDft(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async cancelInv(req, res) {
		let invoiceManagementVNPT = new InvoiceManagementVNPT();
		try {
			let data = await invoiceManagementVNPT.cancelInvoiceVAT(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async invXML(req, res) {
		let invoiceManagementVNPT = new InvoiceManagementVNPT();
		try {
			let data = await invoiceManagementVNPT.invoiceXML(req, res);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async invPDF(req, res) {
		let invoiceManagementVNPT = new InvoiceManagementVNPT();
		try {
			let data = await invoiceManagementVNPT.invoicePDF(req, res);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}

	async releaseInvVAT(req, res) {
		let invoiceManagementVNPT = new InvoiceManagementVNPT();
		try {
			let data = await invoiceManagementVNPT.releaseInvoiceVAT(req);
			res.status(200).json({ data });
		} catch (err) {
			res.status(500).json({
				message: "Internal Server Error!"
			})
		}
	}
}