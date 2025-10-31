import databaseInstance from '../config/database.js';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import Commons from '../utils/common.js';

export default class InvoiceManagementVNPT {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadInvoiceVAT(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let mst = (req.mst) ? req.mst : '';
			if (Commons.htmlspecialchars(mst.trim()).length > 14 || Commons.htmlspecialchars(mst.trim()).length < 10) {
				response['iStatus'] = false;
				response['iMessage'] = 'Mã số thuế không đúng!';
				return response;
			}
			let pattern = (req.pattern) ? req.pattern : '';
			if (Commons.htmlspecialchars(pattern.trim()).length > 14) {
				response['iStatus'] = false;
				response['iMessage'] = 'Mẫu hoá đơn không đúng!';
				return response;
			}
			let serial = req.serial || '';
			if (Commons.htmlspecialchars(serial.trim()).length > 8) {
				response['iStatus'] = false;
				response['iMessage'] = 'Ký hiệu không đúng!';
				return response;
			}
			let number = (req.number) ? parseFloat(req.number) || 0 : 0;
			if (number.toString().length > 7) {
				response['iStatus'] = false;
				response['iMessage'] = 'Số hoá đơn không đúng!';
				return response;
			}
			let fkey = req.sfkey || '';
			if (Commons.htmlspecialchars(fkey.trim()).length > 15) {
				response['iStatus'] = false;
				response['iMessage'] = 'Mã tra cứu không đúng!';
				return response;
			}
			if (!fkey) {
				let dtCus = this.cfsglobal
					.from('BS_CUSTOMER')
					.select('ROWGUID')
					.where('TAX_CODE', mst)
					.limit(1)
					.catch(err => console.log(err)) || [];
				if (dtCus && !dtCus.length) {
					response['iStatus'] = false;
					response['iMessage'] = 'Mã số thuế không đúng!';
					return response;
				}
			}
			return Commons.getInvoiceXML(fkey, pattern, serial, number)
				.then(async (xml) => {
					let xmlRes = await Commons.decodeEntities(xml.message);
					ParseString(xmlRes, { explicitArray: false }, function (err, result) {
						if (err) {
							return {
								iStatus: false, iMessage: 'An error occurred! Please try again!'
							};
						}
						if (result['Invoice']['Content']['CusTaxCode'] != mst) {
							return {
								iStatus: false, iMessage: '[Mã số thuế] không đúng!'
							};
						}
						return {
							iStatus: true, iMessage: 'Truy vấn dữ liệu thành công!', iPayload: result.Invoice.Content
						};
					});
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iMessage'] = err;
					return response;
				})
		}
		catch (e) {
			response['iStatus'] = false;
			response['iMessage'] = e.message;
			return response;
		}
	}

	async loadInvoiceVATDft(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let pinCodes = req.fkeys;
		if (!Array.isArray(pinCodes)) {
			pinCodes = [pinCodes || ''];
		}
		try {
			let dataInv = await this.cfsglobal
				.from('INV_DFT AS invDraft')
				.select('invDraft.ID', 'invDraft.DRAFT_INV_NO', 'invDraft.INV_NO', 'invDraft.DRAFT_INV_DATE', 'invDraft.REF_NO', 'invDraft.PAYER_TYPE', 'invDraft.PAYER', 'invDraft.AMOUNT', 'invDraft.VAT', 'invDraft.DIS_AMT', 'invDraft.REMARK', 'invDraft.PAYMENT_STATUS', 'invDraft.CURRENCYID', 'invDraft.RATE', 'invDraft.INV_TYPE', 'invDraft.TPLT_NM', 'invDraft.IS_MANUAL_INV', 'invDraft.TAMOUNT', 'customerInfo.CUSTOMER_CODE', 'customerInfo.CUSTOMER_NAME', 'customerInfo.ADDRESS')
				.whereIn('invDraft.INV_NO', pinCodes.map(String))
				.catch(err => console.log(err)) || [];
			if (dataInv && !dataInv.length) {
				response['iStatus'] = false;
				response['iMessage'] = "Không tìm thấy thông tin theo mã số hóa đơn nháp!";
				return response;
			}
			const config = await Commons.getConfig('VNPT', "ITC");
			let draftParent = dataInv
				.map(p => p.INV_NO)
				.filter((item, idx, data) => data.indexOf(item) === idx)
				.map(draftNo => dataInv.find(p => p.INV_NO === draftNo));
			let args = {
				datas: dataInv && dataInv.length ? dataInv : [],
				cusCode: dataInv[0]?.PAYER || '',
				cusTaxCode: dataInv[0]?.CUSTOMER_CODE || '',
				cusAddr: dataInv[0]?.ADDRESS || '',
				cusName: dataInv[0]?.CUSTOMER_NAME || '',
				sum_amount: draftParent.reduce((a, p) => a + (parseFloat(p['SumAmount']) || 0), 0),
				vat_amount: draftParent.reduce((a, p) => a + (parseFloat(p['VatAmount']) || 0), 0),
				total_amount: draftParent.reduce((a, p) => a + (parseFloat(p['TotalAmount']) || 0), 0),
				inv_type: dataInv[0]?.INV_TYPE || 'VND',
				exchange_rate: parseFloat(dataInv[0]?.RATE || 0),
				currencyInDetails: dataInv[0]?.CURRENCYID || 'VND',
				config: config
			};
			return await this.generateDraftInvoice(args);
		} catch (error) {
			response['iStatus'] = false;
			response['iMessage'] = error.message;
			return response;
		}
	}

	async cancelInvoiceVAT(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let fkey = req.body.fkey || '';
			const config = await Commons.getConfig('VNPT', "ITC");
			let xmlcontent = `<cancelInv xmlns="http://test.org/">
										<Account>aaa</Account>
										<ACpass>aaa</ACpass>
										<fkey>${fkey}</fkey>
										<userName>aaa</userName>
										<userPass>aaa</userPass>
									</cancelInv>`;
			return await Commons.curlToInvoiceService("cancelInv", "BusinessService", xmlcontent, config)
				.then(xmlResponse => {
					let responseContent = Commons.getResultData("cancelInv", xmlResponse);
					let responses = responseContent.split(":");
					if (responses && responses.length) {
						if (responses[0] == "ERR") {
							response['iStatus'] = false;
							response['iMessage'] = Commons.getERR_CancelInv(responses[1]);
							return response;
						}
						response['iStatus'] = true;
						response['iMessage'] = `Xóa hóa đơn thành công!`;
						return response;
					}
					response['iStatus'] = false;
					response['iMessage'] = responseContent;
					return response;
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iMessage'] = err;
					return response;
				});
		} catch (e) {
			response['iStatus'] = false;
			response['iMessage'] = e.message;
			return response;
		}
	}

	async invoiceXML(req, res) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let pattern = req.body.pattern || '';
			let serial = req.body.serial || '';
			let number = parseInt(req.body.number || 0);
			let fkey = req.body.fkey || '';
			Commons.getInvoiceXML(fkey, pattern, serial, number)
				.then(async (xml) => {
					res.writeHead(200, { 'Content-Type': 'application/force-download', 'Content-disposition': 'attachment; filename=' + fkey + '.xml' });
					res.status(200).end(await Commons.decodeEntities(xml.message || ''));
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iMessage'] = err;
					return response;
				});
		} catch (e) {
			response['iStatus'] = false;
			response['iMessage'] = e.message;
			return response;
		}
	}

	async invoicePDF(req, res) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			let fkey = req.query.id;
			let terminal_code = 'ITC';
			let TerminalCode = terminal_code ? terminal_code : fkey.substring(0, 3).trim();
			// Get config for VNPT
			const config = await Commons.getConfig('VNPT', TerminalCode);
			let withFkey = fkey !== "" ? 1 : 0;
			let funcName;
			if (withFkey === 1) {
				funcName = config.fnDownloadPDF[1];
			} else {
				funcName = config.fnDownloadPDF[0];
			}
			let tagFindingInfo = `<fkey>${fkey}</fkey>`;
			let xmlcontent = `<${funcName} xmlns="http://tempuri.org/">
							  ${tagFindingInfo}
							  <userName>${config.VNPT_SRV_ID}</userName>
							  <userPass>${config.VNPT_SRV_PWD}</userPass>
						  </${funcName}>`;
			return Commons.curlToInvoiceService(funcName, "PortalService", xmlcontent, config)
				.then(async xmlResponse => {
					let responseContent = Commons.getResultData(funcName, xmlResponse);
					let errContent = '';
					switch (responseContent) {
						case 'ERR:1': errContent = "Tài khoản đăng nhập sai!";
							break;
						case 'ERR:6': errContent = "Không tìm thấy hóa đơn";
							break;
						case 'ERR:7': errContent = "User name không phù hợp, không tìm thấy company tương ứng cho user.";
							break;
						case 'ERR:12': errContent = `Do lỗi đường truyền hóa đơn chưa được cấp mã cơ quan thuế (CQT), quý khách vui lòng truy cập sau để nhận hóa đơn hoặc truy cập link ${config.PortalURL} để xem trước hóa đơn chưa có mã`;
							break;
						case 'ERR:': errContent = "Lỗi khác!";
							break;
						default:
							if (responseContent.includes('ERR:')) {
								errContent = "Lỗi khác!";
							}
							break;
					}
					if (errContent !== '') {
						let result = { success: false, iMessage: `[Hệ thống VNPT] ${errContent}` };
						return result.message;
					}
					let name = `${fkey}.pdf`;
					let content = typeof Buffer.from === "function" ? Buffer.from(responseContent, 'base64') : new Buffer(responseContent, 'base64');
					res.set('Content-Type', 'application/pdf');
					res.set('Content-Length', content.length);
					res.set('Content-disposition', 'inline; filename="' + name + '"');
					res.send(content);
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iMessage'] = err;
					return response;
				});
		} catch (e) {
			response['iStatus'] = false;
			response['iMessage'] = e.message;
			return response;
		}
	}

	async releaseInvoiceVAT(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		try {
			if (req.body.orderReq && !req.body.orderReq.length) {
				response['iStatus'] = false;
				response['iMessage'] = `Vui lòng cung cấp thông tin lưu lệnh!`;
				return response;
			}
			let orderReq = req.body.orderReq;
			let invVatReq = req.body.invVatReq;
			let drafReturn;
			//Xử lí lưu lệnh
			let orderReturn = await Promise.all(
				orderReq.map(async (item, index) => {
					let countPIN = `000${String(index + 1)}`.substr(-3);
					if (!item.VOYAGEKEY) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp tàu chuyến!';
						return response;
					}
					if (!item.CLASS_CODE) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp hướng!';
						return response;
					}
					if (!item.CUSTOMER_CODE) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã khách hàng!';
						return response;
					}
					if (item.METHOD_CODE !== 'NKX' && !item.ACC_CD) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã hình thức thanh toán!';
						return response;
					}
					if (!item.ACC_TYPE && item.METHOD_CODE !== 'NKX') {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp loại thanh toán!';
						return response;
					}
					if (!item.ACC_CD && item.METHOD_CODE !== 'NKX') {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã hình thức thanh toán!';
						return response;
					}
					if (!item.ITEM_TYPE_CODE) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã loại hàng hóa!';
						return response;
					}
					if (!item.METHOD_CODE) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp mã phương án!';
						return response;
					}
					if (!item.OWNER) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp thông tin chủ hàng!';
						return response;
					}
					if (!item.OWNER_REPRESENT) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp thông tin tên người đại diện!';
						return response;
					}
					if (!item.OWNER_PHONE) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp thông tin SĐT!';
						return response;
					}
					if (!item.CREATE_BY) {
						response['iStatus'] = false;
						response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
						return response;
					}
					//sinh ra PIN
					let pinCode = `${moment().format('YYMMDD')}`;
					let dtPinCode = await this.cfsglobal
						.from('DT_ORDER')
						.select('PIN_CODE')
						.whereLike('PIN_CODE', `${pinCode}%`)
						.orderBy('PIN_CODE', 'desc')
						.catch(err => console.log(err)) || [];
					if (dtPinCode && dtPinCode.length) {
						let temp = dtPinCode[0].PIN_CODE?.slice(6, 9);
						let pincodeTemp = `000${Number(temp) + 1}`.substr(-3);
						pinCode = `${pinCode}${pincodeTemp}-${countPIN}`;
					} else {
						pinCode = `${pinCode}001-${countPIN}`;
					}
					//Sinh ORDER_NO here
					let order_no_created = `${item.METHOD_CODE}${item.CLASS_CODE}${moment().format('YYMMDD')}`;
					let dtOrderNo = await this.cfsglobal
						.from('DT_ORDER')
						.select('ORDER_NO')
						.whereLike('ORDER_NO', `${order_no_created}%`)
						.orderBy('ORDER_NO', 'desc')
						.catch(err => console.log(err)) || [];
					if (dtOrderNo && dtOrderNo.length) {
						let tempOrderNo = dtOrderNo[0].ORDER_NO?.substr(-3);
						let threeLastOrderNo = `000${Number(tempOrderNo) + 1}`.substr(-3);
						order_no_created = `${order_no_created}${threeLastOrderNo}`;
					} else {
						order_no_created = `${order_no_created}001`;
					}
					let obj = {
						VOYAGEKEY: item.VOYAGEKEY || null,
						CLASS_CODE: item.CLASS_CODE || null,
						ORDER_NO: order_no_created || null,
						PIN_CODE: pinCode || null,
						CUSTOMER_CODE: item.CUSTOMER_CODE || null,
						ACC_TYPE: item.ACC_TYPE || null,
						ACC_CD: item.ACC_CD || null,
						DELIVERY_ORDER: item.DELIVERY_ORDER || null,
						BILLOFLADING: item.BILLOFLADING || null,
						BOOKING_NO: item.BOOKING_NO || null,
						CNTRNO: item.CNTRNO || null,
						CNTRSZTP: item.CNTRSZTP || null,
						ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
						ITEM_TYPE_CODE_CNTR: item.ITEM_TYPE_CODE,
						METHOD_CODE: item.METHOD_CODE || null,
						ISSUE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
						EXP_DATE: moment(item.EXP_DATE).format('YYYY-MM-DD HH:mm:ss'),
						HOUSE_BILL: item.HOUSE_BILL || null,
						BOOKING_FWD: item.BOOKING_FWD || null,
						CARGO_PIECE: item.CARGO_PIECE || null,
						UNIT_CODE: item.UNIT_CODE || null,
						CARGO_WEIGHT: item.CARGO_WEIGHT || null,
						CBM: item.CBM || null,
						RT: item.RT || null,
						LOT_NO: item.LOT_NO || null,
						NOTE: item.NOTE || null,
						DRAFT_NO: item.DRAFT_NO || null,
						INV_NO: item.INV_NO || null,
						GATE_CHK: item.GATE_CHK,
						QUANTITY_CHK: item.QUANTITY_CHK,
						PAYMENT_CHK: item.PAYMENT_CHK,
						OWNER: item.OWNER || null,
						OWNER_REPRESENT: item.OWNER_REPRESENT || null,
						OWNER_PHONE: item.OWNER_PHONE || null,
						COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION || null,
						CREATE_BY: item.CREATE_BY,
					};
					try {
						let wherePackage = {
							VOYAGEKEY: item.VOYAGEKEY,
							CLASS_CODE: item.CLASS_CODE,
							[item.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: item.CLASS_CODE === 1 ? item.HOUSE_BILL : item.BOOKING_FWD,
						};
						let checkPackageMnf = await this.cfsglobal
							.from('DT_PACKAGE_MNF_LD')
							.select('SHIPMARKS', 'DECLARE_NO')
							.where(wherePackage)
							.catch(err => console.log(err)) || [];
						await this.cfsglobal
							.from('DT_ORDER')
							.returning('*')
							.insert(obj)
							.then(data => {
								response['iStatus'] = true;
								response['iPayload'].push(Object.assign({
									SHIPMARKS: checkPackageMnf[0]?.SHIPMARKS || '',
									DECLARE_NO: checkPackageMnf[0]?.DECLARE_NO || '',
								}, ...data));
								response['iMessage'] = 'Lưu dữ liệu thành công!';
								return response;
							});
					} catch (err) {
						response['iStatus'] = false;
						response['iPayload'] = err;
						response['iMessage'] = 'Không thể lưu mới dữ liệu!';
					}
				})
			).then(async (value) => {
				if (response['iStatus'] && orderReq[0]?.METHOD_CODE !== 'NKX') {
					//Thoilc(*Bổ sung)-INV_DFT
					let checkCode = await this.cfsglobal
						.from('INV_DFT')
						.select('ID', 'DRAFT_INV_NO', 'INV_NO', 'DRAFT_INV_DATE', 'REF_NO', 'PAYER_TYPE', 'PAYER', 'AMOUNT', 'VAT', 'DIS_AMT', 'REMARK', 'PAYMENT_STATUS', 'CURRENCYID', 'RATE', 'INV_TYPE', 'TPLT_NM', 'IS_MANUAL_INV', 'TAMOUNT')
						.orderBy('DRAFT_INV_NO', 'desc')
						.catch(err => console.log(err)) || [];
					let AMOUNT = invVatReq.sum_amount;
					let VAT_RATE = invVatReq.vat_amount;
					let TAMOUNT = invVatReq.total_amount;
					let idx_DRAFT_INV_NO = parseInt(checkCode[0]?.DRAFT_INV_NO.substr(8));
					let CURRENCY_CODE = orderReq[0]?.INV_DRAFT?.datainvDraft.CURRENCY_CODE;
					let CUSTOMER_CODE = orderReq[0]?.INV_DRAFT?.datainvDraft.CUSTOMER_CODE;
					let ACC_TYPE = orderReq[0]?.INV_DRAFT?.datainvDraft.ACC_TYPE;
					let invDftData = {
						DRAFT_INV_NO: idx_DRAFT_INV_NO ? "DR" + "/" + moment(new Date()).format("YYYY") + "/" + (parseInt('0000000', 10) + idx_DRAFT_INV_NO + 1).toString().padStart('0000000'.length, '0') : "DR" + "/" + moment(new Date()).format("YYYY") + "/" + `000000${String(1)}`,
						DRAFT_INV_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
						REF_NO: response['iPayload'][0]?.ORDER_NO || null,
						PAYER_TYPE: ACC_TYPE || null,
						PAYER: CUSTOMER_CODE || null,
						AMOUNT: AMOUNT,
						VAT: VAT_RATE,
						PAYMENT_STATUS: "U",
						CURRENCYID: CURRENCY_CODE || null,
						TPLT_NM: "CFS",
						TAMOUNT: TAMOUNT,
						CREATE_BY: orderReq[0]?.CREATE_BY,
					};
					drafReturn = await this.cfsglobal
						.from('INV_DFT')
						.returning('*')
						.insert(invDftData);
					let dataDetail = orderReq[0]?.INV_DRAFT.DETAIL_DRAFT.map((itemDetail, idx) => {
						let objINV_DETAIL = {
							DRAFT_INV_NO: invDftData.DRAFT_INV_NO || null,
							SEQ: idx + 1,
							TRF_CODE: itemDetail.TRF_CODE || null,
							INV_UNIT: itemDetail.UNIT_CODE || null,
							IX_CD: itemDetail.CLASS_CODE || null,
							CARGO_TYPE: itemDetail.ITEM_TYPE_CODE || null,
							AMOUNT: (itemDetail.AMOUNT).toLocaleString().replace(/\D/g, ''),
							VAT: Number(itemDetail.VAT),
							VAT_RATE: parseFloat(itemDetail.VAT_RATE),
							TAMOUNT: (itemDetail.TAMOUNT).toLocaleString().replace(/\D/g, ''),
							SZ: itemDetail.CNTRSZTP || null,
							QTY: Number(itemDetail.QTY),
							UNIT_RATE: parseFloat(itemDetail.UNIT_RATE) || null,
							TRF_DESC: itemDetail.TRF_DESC || null,
							JOB_TYPE: itemDetail.METHOD_CODE || null,
							VAT_CHK: itemDetail.VAT_CHK,
							CREATE_BY: orderReq[0]?.CREATE_BY,
						};
						return objINV_DETAIL;
					});
					await this.cfsglobal
						.from('INV_DFT_DTL')
						.returning('*')
						.insert(dataDetail);
				}
				return response;
			});
			if (!response['iStatus']) {
				return response;
			}
			// Phát hành hóa đơn VNPT
			const config = await Commons.getConfig('VNPT', 'ITC');
			let args = {
				datas: invVatReq && invVatReq.datas.length ? invVatReq.datas : [],
				cusCode: orderReq[0]?.CUSTOMER_CODE || '',
				cusTaxCode: orderReq[0]?.TAX_CODE || '',
				cusAddr: orderReq[0]?.ADDRESS || '',
				cusName: orderReq[0]?.CUSTOMER_NAME || '',
				sum_amount: invVatReq.sum_amount ? parseFloat(invVatReq.sum_amount) || 0 : 0,
				vat_amount: invVatReq.vat_amount ? parseFloat(invVatReq.vat_amount) || 0 : 0,
				total_amount: invVatReq.total_amount ? parseFloat(invVatReq.total_amount) || 0 : 0,
				transaction: invVatReq.transaction || '',
				inv_type: invVatReq.inv_type || 'VND',
				//exchange_rate k có thì không gửi, exchange_rate là tỉ giá
				exchange_rate: invVatReq.exchange_rate ? parseFloat(invVatReq.exchange_rate) || 0 : 0,
				currencyInDetails: invVatReq.CURRENCYID || 'VND',
				config: config
			}
			args.datas.map((item) => {
				item['PinCode'] = orderReturn.iPayload[0]?.ORDER_NO
			});
			//Phat hanh hddt vnpt
			// let invVatReturn = await this.releaseVNPT(args)
			// 	.then(result => result)
			// 	.catch(errMsg => {
			// 		response['iStatus'] = false;
			// 		response['iPayload'] = errMsg;
			// 		response['iMessage'] = "Phát hành hóa đơn VNPT thất bại!";
			// 		return response;
			// 	});
			if (!response['iStatus']) {
				return response;
			}
			let obj = {};
			// obj['INV_NO'] = invVatReturn.serial + `00000000${invVatReturn.invno}`.substr(-8);
			obj['INV_NO'] = '';
			obj['INV_DATE'] = moment().format('YYYY-MM-DD HH:mm:ss');
			obj['VOYAGEKEY'] = orderReturn.iPayload[0]?.VOYAGEKEY || null;
			obj['REF_NO'] = orderReturn.iPayload[0]?.ORDER_NO || null; // fkey
			obj['PAYER_TYPE'] = orderReturn.iPayload[0]?.ACC_TYPE || null;
			obj['PAYER'] = orderReturn.iPayload[0]?.CUSTOMER_CODE || null;
			drafReturn?.AMOUNT ? obj['AMOUNT'] = drafReturn.AMOUNT : '';
			drafReturn?.VAT ? obj['VAT'] = drafReturn.VAT : '';
			drafReturn?.DIS_AMT ? obj['DIS_AMT'] = drafReturn.DIS_AMT : '';
			drafReturn?.REMARK ? obj['REMARK'] = orderReturn.iPayload[0]?.REMARK : '';
			drafReturn?.PAYMENT_STATUS ? obj['PAYMENT_STATUS'] = drafReturn.PAYMENT_STATUS : '';
			drafReturn?.CURRENCYID ? obj['CURRENCYID'] = drafReturn.CURRENCYID : '';
			drafReturn?.RATE ? obj['RATE'] = drafReturn.RATE : '';
			drafReturn?.INV_TYPE ? obj['INV_TYPE'] = drafReturn.INV_TYPE : '';
			drafReturn?.TPLT_NM ? obj['TPLT_NM'] = drafReturn.TPLT_NM : '';
			drafReturn?.TAMOUNT ? obj['TAMOUNT'] = drafReturn.TAMOUNT : '';
			obj['ACC_CD'] = orderReturn.iPayload[0]?.ACC_CD || null;
			//Phat hanh hddt vnpt
			// obj['INV_PREFIX'] = invVatReturn.serial || null;
			// obj['INV_NO_PRE'] = invVatReturn.invno || null;
			obj['INV_PREFIX'] = null;
			obj['INV_NO_PRE'] = null;
			obj['PIN_CODE'] = orderReturn.iPayload[0]?.PIN_CODE.split('-')[0] || null;
			obj['CREATE_BY'] = orderReturn.iPayload[0]?.CREATE_BY;
			obj['CREATE_DATE'] = moment().format('YYYY-MM-DD HH:mm:ss');
			try {
				let dtInvVAT = await this.cfsglobal
					.from('INV_VAT')
					.returning('*')
					.insert(obj);
				if (dtInvVAT && dtInvVAT.length) {
					await this.cfsglobal
						.from('INV_DFT')
						.where('ID', drafReturn[0].ID)
						.update({
							INV_NO: dtInvVAT[0].INV_NO,
							UPDATE_BY: obj.CREATE_BY,
						});
					response['iStatus'] = true;
					response['iPayload'] = {
						order_noInfo: orderReturn.iPayload,
						inv_vatInfo: dtInvVAT
					};
					response['iMessage'] = 'Phát hành hóa đơn thành công!';
				}
			} catch (err) {
				response['iStatus'] = false;
				response['iPayload'] = err;
				response['iMessage'] = "Không thể lưu mới dữ liệu!";
			}
		} catch (error) {
			response['iStatus'] = false;
			response['iPayload'] = error;
			response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
		}
		return response;

	}

	//release hddt
	async releaseVNPT(args) {
		let TerminalCode = "ITC";
		return new Promise(async (resolve, reject) => {
			let datas = args.datas;
			let cusTaxCode = args.cusTaxCode.toString();
			let appliedCusTaxCode = !isNaN(cusTaxCode) && cusTaxCode.length == 13 ? `${cusTaxCode.slice(0, 10)}-${cusTaxCode.slice(10)}` : cusTaxCode;
			let cusCode = args.cusCode || args.cusTaxCode;
			let cusAddr = await Commons.htmlspecialchars(args.cusAddr);
			let cusName = await Commons.htmlspecialchars(args.cusName);
			let sum_amount = args.sum_amount;
			let vat_amount = args.vat_amount;
			let total_amount = args.total_amount;
			// let transaction = args.transaction;
			let inv_type = args.inv_type;
			let exchange_rate = args.exchange_rate;
			let currencyInDetails = args.currencyInDetails;
			const config = args.config;
			let invinfo = '';
			let view_exchange_rate = '';
			if (inv_type == currencyInDetails) {
				exchange_rate = 1;
			}
			if (exchange_rate != 0) {
				sum_amount = sum_amount * exchange_rate;
				total_amount = total_amount * exchange_rate;
				vat_amount = vat_amount * exchange_rate;
				view_exchange_rate = exchange_rate;
			}
			let dvt = inv_type == "VND" ? " đồng" : " đô la Mỹ";
			let amount_in_words = await Commons.convert_number_to_words(total_amount);
			amount_in_words += dvt;
			amount_in_words = await Commons.htmlspecialchars(amount_in_words.toUpperCase());
			let pincode = datas[0].PinCode;
			let vatRate = parseFloat(datas[0]?.VatRate || "10");
			let xmlHeaderInv = config.PUBLISH_XML.PRODUCT_HEADER;
			let product_content = config.PUBLISH_XML.PRODUCT_CONTENT;
			let invHeaderData = {
				MAIN_PINCODE: pincode || '',
				CUS_CODE: cusCode || '',
				CUS_NAME: cusName || '',
				CUS_ADDR: cusAddr || '',
				CUS_TAXCODE: appliedCusTaxCode || '',
				PAYMENT_METHOD: "TM/CK",
				CURRENCY_UNIT: currencyInDetails,
				EXCHANGE_RATE: exchange_rate,
				SUM_AMOUNT: sum_amount || 0,
				VAT_RATE: vatRate || 0,
				VAT_AMOUNT: vat_amount || 0,
				TOTAL_AMOUNT: total_amount || 0,
				IN_WORDS: amount_in_words,
				VIEW_EXCHANGE_RATE: view_exchange_rate,
				INV_TYPE: inv_type,
				VIEW_PINCODE: pincode || ''
			};
			let invData = await Commons.strReplaceAssoc(invHeaderData, xmlHeaderInv);
			let strFinal = '';
			for (let i = 0; i < datas.length; i++) {
				let item = Object.assign({}, datas[i]);
				let dtTarifName;
				if (typeof item === 'object' && Object.keys(item).length) {
					dtTarifName = item['TariffName'];
					let sizeType = item["IsoSizetype"] ? await Commons.getContSize(item["IsoSizetype"]) : (item["Size"] ? item["Size"] : '');
					if (sizeType) {
						dtTarifName += " (" + sizeType + item['FE'] + ")";
						let ext = (item.RemarkContainer || '').split(',').map((itemh) => itemh.trim());
						if (ext.length <= 5) {
							ext = ext.join(', ');
							dtTarifName += (ext ? '|@|' + ext : '');
						}
					}
					item['TRF_DESC'] = await Commons.htmlspecialchars(await Commons.decodeEntities(dtTarifName));
					item['INV_UNIT'] = await Commons.htmlspecialchars(item.UnitName);
					item['UNIT_RATE'] = parseInt(item['UnitRate'].toString().replace(',', '')) || 0;
					item['AMT'] = parseInt(item['Amount'].toString().replace(',', '')) || 0;
					delete item['Amount'];
					item['QTY'] = await Commons.htmlspecialchars(item['Qty']);
					delete item['Qty'];
					delete item['Unit'];
					if ((item['AMT'] + '') === '0') continue;
					strFinal += await Commons.strReplaceAssoc(item, product_content);
				}
			}
			if (!strFinal) {
				reject('nothing to publish');
				return;
			}
			let xmlInvData = "<![CDATA[<Invoices>" + invData.replace('PRODUCT_CONTENT', strFinal) + "</Invoices>]]>";
			let xmlbody = `
            <ImportAndPublishInv xmlns="http://tempuri.org/">
            <Account>${config.VNPT_PUBLISH_INV_ID}</Account>
            <ACpass>${config.VNPT_PUBLISH_INV_PWD}</ACpass>
            <xmlInvData>${xmlInvData}</xmlInvData>
            <username>${config.VNPT_SRV_ID}</username>
            <password>${config.VNPT_SRV_PWD}</password>
            <pattern>${config.INV_PATTERN}</pattern>
            <serial>${config.INV_SERIAL}</serial>
            <convert>0</convert>
        </ImportAndPublishInv>`;
			xmlbody = xmlbody.replace(/(\>)(\s)+(\<)/, '><');
			await Commons.curlToInvoiceService("ImportAndPublishInv", config.PUBLISH_SERICE_ADDR || "PublishService", xmlbody, config)
				.then(async xmlResponse => {
					let responseContent = await Commons.getResultData("ImportAndPublishInv", xmlResponse);
					let responses = responseContent.split(':');
					if (responses && responses.length) {
						if (responses[0] == "ERR") {
							let errorMsg = await Commons.getERR_ImportAndPublish(responses[1]);
							reject(errorMsg);
							return;
						}
						if (responses[0] == "OK") {
							invinfo = (responses[1] + '').split(';');
							if (invinfo.length) {
								let back = {
									pattern: invinfo[0],
									serial: invinfo[1].split("-")[0],
									fkey: pincode,
									invno: invinfo[1].split("_")[1],
									OrderNo: datas[0]["OrderNo"],
									JobModeCode: datas[0]["JobModeCode"],
									main: datas[0].hasOwnProperty('main') ? datas[0]['main'] : true
								};
								resolve(back);
								// if (config.isGetMCCQThue) {
								// 	const InvoiceModal = require('../../Model/invoice/InvoiceModel');
								// 	InvoiceModal.createJobGetMCCQThue(pincode, TerminalCode);
								// }
								return;
							}
						}
					}
					else {
						reject(xmlResponse);
						return;
					}
				})
				.catch(err => {
					reject("curlToInvoiceService: " + (typeof err === 'string' ? err : (err || { iMessage: 'null' }).message));
					return;
				});
		});
	}

	async generateDraftInvoice(args) {
		return new Promise(async (resolve, reject) => {
			let datas = args.datas;
			let cusTaxCode = args.cusTaxCode.toString();
			let appliedCusTaxCode = !isNaN(cusTaxCode) && cusTaxCode.length == 13 ? `${cusTaxCode.slice(0, 10)}-${cusTaxCode.slice(10)}` : cusTaxCode;
			let cusAddr = args.cusAddr;
			let cusName = args.cusName;
			let sum_amount = args.sum_amount;
			let vat_amount = args.vat_amount;
			let total_amount = args.total_amount;
			let inv_type = args.inv_type;
			let exchange_rate = args.exchange_rate;
			let currencyInDetails = args.currencyInDetails;
			const config = args.config;
			if (inv_type == currencyInDetails) {
				exchange_rate = 1;
			}
			if (exchange_rate != 0) {
				sum_amount = sum_amount * exchange_rate;
				total_amount = total_amount * exchange_rate;
				vat_amount = vat_amount * exchange_rate;
			}
			let vatRate = parseFloat(datas[0]?.VatRate) || '';
			let dvt = inv_type == "VND" ? " đồng" : " đô la Mỹ";
			let amount_in_words = Commons.convert_number_to_words(total_amount) + dvt;
			amount_in_words = Commons.htmlspecialchars(amount_in_words.toUpperCase());
			let invoiceData = {
				LCTNOV_PATTERN: config.INV_PATTERN || '',
				LCTNOV_SERIAL: config.INV_SERIAL || '',
				LCTNOV_DAY_OF_INVOICE: moment().format('DD'),
				LCTNOV_MONTH_OF_INVOICE: moment().format('MM'),
				LCTNOV_YEAR_OF_INVOICE: moment().format('YYYY'),
				LCTNOV_CUSTOMER_NAME: cusName || '',
				LCTNOV_CUSTOMER_ADDRESS: cusAddr || '',
				LCTNOV_CUSTOMER_TAXCODE: appliedCusTaxCode || '',
				LCTNOV_PAYMENT_METHOD: 'TM/CK',
				LCTNOV_PROD_DETAIL: '',
				LCTNOV_TOTAL: sum_amount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
				LCTNOV_VAT_RATE: `${vatRate} %`,
				LCTNOV_VAT_AMOUNT: vat_amount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
				LCTNOV_SUM_AMOUNT: total_amount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
				LCTNOV_IN_WORDS: amount_in_words
			};
			let filedir = path.dirname('');
			fs.readFile(filedir, null, async (error, data) => {
				if (error) {
					reject('Không tìm thấy mẫu!');
					return;
				}
				else {
					let strDetails = '';
					let invoice_details = `<tr style="height: 30px;">
											  <td valign="top">
											  <center>1</center>
											  </td>
											  <td style="padding-left:10px;" valign="top">
												  <div class="ProdData" style="width:400px;">LCTNOV_PROD_NAME</div>
											  </td>
											  <td style="padding-left:10px;" valign="top">
											  <div class="ProdData" style="width:87px;">LCTNOV_PROD_UNIT</div>
											  </td>
											  <td style="text-align:right; padding-right:10px;" valign="top">LCTNOV_PROD_QTY</td>
											  <td style="text-align:right; padding-right: 10px;" valign="top">LCTNOV_PROD_PRICE</td>
											  <td style="text-align:right; padding-right: 10px;" valign="top">LCTNOV_PROD_AMOUNT</td>
										  </tr>`;
					let units = datas.map((p) => p.UnitCode).filter((item, idx, data) => data.indexOf(item) === idx);
					let unitDatas = await this.cfsglobal
						.from('BS_CUSTOMER')
						.select('CUSTOMER_CODE', 'CUSTOMER_NAME')
						.whereIn('CUSTOMER_CODE', units)
						.catch(err => console.log(err)) || [];
					if (unitDatas && unitDatas.length) {
						unitDatas = unitDatas.map(item => {
							return {
								UnitCode: item.CUSTOMER_CODE,
								UnitName: item.CUSTOMER_NAME
							};
						})
					}
					for (let i = 0; i < datas.length; i++) {
						let item = datas[i];
						if (typeof item === 'object' && Object.keys(item).length) {
							let n = {};
							let dtTarifName = item['TariffName'];
							let sizeType = item["IsoSizetype"] ? Commons.getContSize(item["IsoSizetype"]) : (item["Size"] ? item["Size"] : '');
							if (sizeType) {
								dtTarifName += " (" + sizeType + item['FE'] + ")";
							}
							n['LCTNOV_PROD_NAME'] = Commons.htmlspecialchars(await Commons.decodeEntities(dtTarifName));
							n['LCTNOV_PROD_UNIT'] = Commons.htmlspecialchars(unitDatas.filter((p) => p.UnitCode == item.UnitCode).map((p) => p.UnitName)[0] || item.UnitCode);
							n['LCTNOV_PROD_QTY'] = Commons.htmlspecialchars(item['Qty']);
							let price = parseInt(item['UnitRate'].toString().replace(',', '')) || 0;
							n['LCTNOV_PROD_PRICE'] = price.toLocaleString(undefined, { minimumFractionDigits: 0 });
							let amt = parseInt(item['Amount'].toString().replace(',', '')) || 0;
							n['LCTNOV_PROD_AMOUNT'] = amt.toLocaleString(undefined, { minimumFractionDigits: 0 });
							strDetails += Commons.strReplaceAssoc(n, invoice_details);
						}
					}
					if (!strDetails) {
						reject('Không tìm thấy mẫu!');
						return;
					}
					invoiceData.LCTNOV_PROD_DETAIL = strDetails;
					let finalStrInvoiceHtml = strReplaceAssoc(invoiceData, data.toString());
					resolve(finalStrInvoiceHtml);
					return;
				}
			});
		});
	}
}