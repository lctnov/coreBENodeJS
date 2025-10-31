import databaseInstance from '../config/database.js';
import moment from 'moment';
import FunctionModel from './FunctionModel.js';
export default class TrfStdModel {
	constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
	async loadTrfStd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("trf_std")
			.select("id", "trf_code", "trf_desc", "method_code", "item_type_code", "currency_code", "amt_min20", "amt_min40", "amt_min45", "amt_rt", "amt_non", "vat", "include_vat", "from_date", "to_date", "trf_name", "trf_temp", "class_code")
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			response["iStatus"] = true;
			response["iPayload"] = query;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async loadTrfStdCode(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		var trfStd = await this.cfsglobal
			.from("trf_std")
			.select("trf_name", "trf_temp", "from_date", "to_date")
			.groupBy("trf_name", "trf_temp", "from_date", "to_date")
			.catch(err => console.log(err)) || [];
		var trfCode = await this.cfsglobal
			.from("trf_codes")
			.select("id", "trf_code", "trf_desc")
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];
		var bsMethod = await this.cfsglobal
			.from("bs_method")
			.select("id", "method_code")
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];
		var bsItemType = await this.cfsglobal
			.from("bs_item_type")
			.select("id", "item_type_code")
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];
		var bsCurrency = await this.cfsglobal
			.from("currency")
			.select("id", "currency_code")
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];

		response["iStatus"] = true;
		response["iPayload"] = { trfStd: trfStd, trfCode: trfCode, bsMethod: bsMethod, bsItemType: bsItemType, bsCurrent: bsCurrency };
		response["iMessage"] = "Nạp dữ liệu thành công!";
		return response;
	}

	async loadTrfStdTemplate(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};

		var query = await this.cfsglobal
			.from("trf_std")
			.select("id", "trf_code", "trf_desc", "method_code", "item_type_code", "currency_code", "amt_min20", "amt_min40", "amt_min45", "amt_rt", "amt_non", "vat", "include_vat", "from_date", "to_date", "trf_name", "trf_temp", "class_code")
			.whereLike("trf_temp", `%${req.body.trf_temp}%`)
			.orderBy("create_date", "desc")
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			response["iStatus"] = true;
			response["iPayload"] = query;
			response["iMessage"] = "Nạp dữ liệu thành công!";
		} else {
			response["iStatus"] = false;
			response["iMessage"] = "Không có dữ liệu!";
		}
		return response;
	}

	async saveTrfStd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		return await Promise.all(req.body.map(async (item) => {
			if (!item.trf_name) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp tên biểu cước!";
				return response;
			};
			if (!item.from_date) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp từ ngày!";
				return response;
			};
			if (!item.to_date) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp đến ngày!";
				return response;
			};
			if (!item.trf_code) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp mã biểu cước!";
				return response;
			};
			if (!item.trf_desc) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp diễn giải biểu cước!";
				return response;
			};
			if (!item.class_code) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp hướng!";
				return response;
			};
			if (!item.method_code) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp mã phương án";
				return response;
			};
			if (!item.item_type_code) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp mã loại hàng hoá!";
				return response;
			};
			if (!item.currency_code) {
				response['iStatus'] = false;
				response["iMessage"] = "Vui lòng cung cấp mã loại tiền!";
				return response;
			};
			let obj = {
				trf_code: item.trf_code || null,
				trf_desc: item.trf_desc || null,
				class_code: item.class_code || null,
				method_code: item.method_code || null,
				item_type_code: item.item_type_code || null,
				currency_code: item.currency_code || null,
				amt_min20: item.amt_min20 || null,
				amt_min40: item.amt_min40 || null,
				amt_min45: item.amt_min45 || null,
				amt_rt: item.amt_rt || null,
				vat: item.vat || null,
				amt_non: item.amt_non || null,
				include_vat: item.include_vat || null,
				from_date: item.from_date || null,
				to_date: item.to_date || null,
				trf_name: item.trf_name || null,
				trf_temp: (item.from_date && item.to_date && item.trf_name) ? (item.from_date + '-' + item.to_date + '-' + item.trf_name) : null,
			};
			// ------- check exist block --------
			let checkCode = await this.cfsglobal
				.from("trf_std")
				.select("rowguid")
				.where("trf_temp", item.trf_temp)
				.catch(err => console.log(err)) || [];

			if (checkCode && checkCode.length) {
				try {
					await this.cfsglobal
						.from("trf_std")
						.select("rowguid", "id")
						.where({ "trf_code": obj.trf_code, "class_code": obj.class_code, "method_code": obj.method_code, "item_type_code": obj.item_type_code })
						.then(async data => {
							if (data && data.length) {
								return Promise.all(data.map(async dtItem => {
									obj.update_by = item.update_by;
									obj.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
									try {
										await this.cfsglobal.from("trf_std").where('id', dtItem.id)
											.update(obj)
											.then(() => {
												response['iStatus'] = true;
												response['iPayload'].push(dtItem);
												response['iMessage'] = "Lưu dữ liệu thành công!";
											});
									} catch (err) {
										response['iStatus'] = false;
										response['iPayload'] = err
										response['iMessage'] = "Không thể lưu mới dữ liệu!";
									}
								}))
									.then(returnValue => {
										return response;
									});
							} else {
								obj = { ...obj, "create_by": item.create_by };
								return await this.cfsglobal.from("trf_std")
									.insert(obj)
									.returning('*')
									.then(dtInsert => {
										response['iStatus'] = true;
										response['iPayload'] = dtInsert;
										response['iMessage'] = "Lưu dữ liệu thành công!";
									});
							}
						});
				} catch (err) {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Không thể lưu mới dữ liệu!";
				}
			} else {
				obj = { ...obj, "create_by": item.create_by };
				return await this.cfsglobal.from("trf_std")
					.insert(obj)
					.returning('*')
					.then(data => {
						response['iStatus'] = true;
						response['iPayload'] = data;
						response['iMessage'] = "Lưu dữ liệu thành công!";
					});
			}
			// -----------------------------------------------
		})).then(returnValue => {
			return response;
		});
	}

	async delTrfStd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
		};
		return Promise.all(req.body.map(async item => {
			if (!item.id) {
				response['iStatus'] = false;
				response['iMessage'] = "Vui lòng cung cấp id!";
				return response;
			}
			try {
				await this.cfsglobal.from("trf_std")
					.where('id', item.id)
					.del();
				response['iStatus'] = true;
				response['iMessage'] = "Xóa dữ liệu thành công!";
			} catch {
				response['iStatus'] = false;
				response['iMessage'] = "Xóa dữ liệu không thành công!";
			}
		})).then((value) => {
			return response;
		});
	}

	async getToBillTrfStd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let contReq = req.body.dataSendCont;
		let servicesReq = req.body.dataSendService;
		if (!contReq) {
			response['iStatus'] = false;
			response['iMessage'] = "Vui lòng cung cấp thông tin container!"
			return response;
		}
		let cbmTotals = {};
		for (let i = 0; i < contReq.length; i++) {
			let item = contReq[i];
			if (cbmTotals[item.item_type_code]) {
				cbmTotals[item.item_type_code] += item.cbm;
			} else {
				cbmTotals[item.item_type_code] = item.cbm;
			}
		}
		let groupList = Object.keys(cbmTotals).map((key) => {
			return {
				'item_type_code': key,
				'm3': cbmTotals[key] / 1,
				'method_code': contReq[0].method_code,
				'class_code': contReq[0].class_code,
				'cntrsztp': contReq[0].cntrsztp
			};
		});
		let arr = [];
		for (let i = 0; i < groupList.length; i++) {
			let whereObj = {};
			whereObj['method_code'] = groupList[i].method_code;
			whereObj['class_code'] = groupList[i].class_code;
			whereObj['item_type_code'] = groupList[i].item_type_code;
			let tariffInfo = {};
			//kiểm tra xem có biểu cước ở bảng cấu hình giảm giá không
			tariffInfo = await this.cfsglobal
				.from("config_discount")
				.select("*")
				.where(whereObj)
				.then(data => {
					let current = moment().toDate().getTime();
					data = data.filter(p => {
						let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
						let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
						return current >= from && current <= to;
					});
					if (data && data.length === 1) {
						return data[0];
					}
					return [];
				})
				.catch(err => console.log(err)) || [];
			if (!Object.values(tariffInfo).length) {
				tariffInfo = await this.cfsglobal
					.from("trf_std")
					.select("*")
					.where(whereObj)
					.then(data => {
						let current = moment().toDate().getTime();
						data = data.filter(p => {
							let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
							let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
							return current >= from && current <= to;
						});
						if (data && data.length) {
							response["flag"] = false;
							return data[0];
						}
						response["flag"] = true;
						response['iStatus'] = false;
						response['iMessage'] = "Không tìm thấy biểu cước phù hợp!";
						return response;
					})
					.catch(err => console.log(err)) || [];
			}
			if (response["flag"]) {
				return response;
			}
			//ICD3 :  Tìm giá trị tối thiểu
			let minValueInfo = await this.cfsglobal
				.from("config_min_value")
				.select("*")
				.where("unit_invoice", "cbm")
				.then(data => {
					return data.filter(p => p.cntrsztp === FunctionModel.checkContSize(groupList[i].cntrsztp));
				})
				.catch(err => console.log(err)) || [];
			if (minValueInfo && !(minValueInfo.length === 1)) {
				response['iStatus'] = false;
				response['iMessage'] = 'Không tìm thấy giá trị tối thiểu của container!';
				return response;
			}
			// Tính toán đơn giá
			// fe gửi số lượng(đây là m3 cũng là tấn doanh thu), gửi cntrstp(kích cở ISO từ bảng DT_CNTR_MNF) để lấy loại cont mà so sánh m3
			// giá tấn doanh thu(amt_rt này là giá bao gồm thuế), vat từ bảng biểu cước
			let quanlity = Number(groupList[i].m3) > minValueInfo[0]['min_value'] ? Number(groupList[i].m3) : minValueInfo[0]['min_value'];
			let vatPrice = tariffInfo.amt_rt * (tariffInfo.vat / 100) * quanlity;
			let unitPrice = tariffInfo.amt_rt * (1 - (tariffInfo.vat / 100));
			let cost = tariffInfo.amt_rt * (1 - (tariffInfo.vat / 100)) * quanlity;
			let totalPrice = vatPrice + cost;
			let tariffObj = {
				'unit_rate': FunctionModel.roundMoney(unitPrice), 'vat_price': FunctionModel.roundMoney(vatPrice), 'amount': FunctionModel.roundMoney(cost),
				'tamount': FunctionModel.roundMoney(totalPrice), 'cntrsztp': groupList[i].cntrsztp, 'qty': (Math.round(quanlity * 100) / 100).toFixed(2)
			}
			let TariffInfo = Object.assign(tariffObj, tariffInfo);
			arr.push(TariffInfo);
		}
		// tính tiền dịch vụ đính kèm
		for (let i = 0; i < servicesReq.length; i++) {
			let tariffInfo = await this.cfsglobal
				.from("trf_std")
				.where("method_code", servicesReq[i].method_code)
				.then(data => {
					if (data && data.length === 1) {
						return data[0];
					}
					response["flag"] = true;
					response['iStatus'] = false;
					response['iMessage'] = "Không tìm thấy biểu cước phù hợp!!";
					return response;
				})
				.catch(err => console.log(err)) || [];
			if (response["flag"]) {
				return response;
			}
			let quanlity = 1;
			let vatPrice = tariffInfo.amt_rt * (tariffInfo.vat / 100) * quanlity;
			let unitPrice = tariffInfo.amt_rt * (1 - (tariffInfo.vat / 100));
			let cost = tariffInfo.amt_rt * (1 - (tariffInfo.vat / 100)) * quanlity;
			let totalPrice = vatPrice + cost;
			let tariffObj = {
				'unit_rate': FunctionModel.roundMoney(unitPrice), 'vat_price': FunctionModel.roundMoney(vatPrice), 'amount': FunctionModel.roundMoney(cost),
				'tamount': FunctionModel.roundMoney(totalPrice), 'qty': (Math.round(quanlity * 100) / 100).toFixed(2)
			}
			let TariffInfo = Object.assign(tariffObj, tariffInfo);
			arr.push(TariffInfo);
		}
		response['iStatus'] = true;
		response['iPayload'] = arr
		response['iMessage'] = "Truy vấn dữ liệu thành công!";
		return response;
	}

	async getCusInfoTrfStd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		let query = await this.cfsglobal
			.from("bs_customer")
			.select("id", "customer_type_code", "customer_code", "customer_name", "acc_type", "address", "tax_code", "email", "is_active")
			.where("customer_code", req.body.customer_code)
			.catch(err => console.log(err)) || [];

		if (query && query.length) {
			response['iStatus'] = true;
			response['iPayload'] = query[0];
			response['iMessage'] = "Nạp dữ liệu thành công!";
		} else {
			response['iStatus'] = false;
			response['iMessage'] = "Không tìm thấy thông tin khách hàng!";
		}
		return response;
	}

	async getToBillExOrderInTrfStd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (req.body && !req.body.length) {
			response["iStatus"] = false;
			response["iMessage"] = "Vui lòng cung cấp thông tin container và chủ hàng!";
		}
		let arr = [];
		return Promise.all(req.body.map(async item => {
			response['iStatus'] = true;
			if (req.body && !req.body.length) {
				this.response['iStatus'] = false;
				this.response['iMessage'] = "Vui lòng cung cấp House Bill!";
				return this.response;
			}
			let numberOfFreeDays = await this.cfsglobal
				.from("config_free_days")
				.select("free_days")
				.where({ class_code: 1, customer_code: item.customer_code, item_type_code: item.item_type_code })
				.then(item => {
					if (item && item.length) {
						return data[0].FREE_DAYS;
					}
					return 0;
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Truy vấn không thành công ngày lưu kho!";
					return response;
				});
			let tempEXP_DATE = moment(item.EXP_DATE, "YYYY-MM-DDTHH:mm:ss.SSSZ");
			let tempTINE_IN = moment(item.TIME_IN, "YYYY-MM-DDTHH:mm:ss.SSSZ").startOf('day');
			let numberOfStorageDays = tempEXP_DATE.diff(tempTINE_IN, 'days');
			if (numberOfStorageDays && !numberOfStorageDays) {
				response['iStatus'] = false;
				response['iMessage'] = 'Lỗi hạn lệnh nhỏ hơn thời gian nhập kho!';
				return response;
			} else {
				numberOfStorageDays += 1;
			}
			let numberOfChargeDays = numberOfStorageDays - Number(numberOfFreeDays);
			if (numberOfChargeDays && !numberOfChargeDays) {
				response['Status'] = false;
				response['Message'] = `Không phát sinh phí lưu kho!`;
				return response;
			}
			// Tính tiền chênh lệch nếu là lô là hàng nguy hiểm và item_type_code_cntr là thường - begin
			if ((item.item_type_code_cntr !== 'DG' || item.item_type_code_cntr !== 'OOG') && (item.item_type_code === 'DG' || item.item_type_code === 'OOP')) {
				let tariffInfoNormal = {};
				let tariffInfoDanger = {};
				await this.cfsglobal
					.from("config_discount")
					.select("id", "name", "trf_code", "trf_desc", "class_code", "method_code", "item_type_code", "currency_code", "amt_rt", "vat", "include_vat", "from_date", "to_date", "acc_type", "customer_code")
					.where({ method_code: "NKN", class_code: 1 })
					.whereIn("item_type_code", [item.item_type_code_cntr, item.item_type_code])
					.then(item => {
						let current = moment().toDate().getTime();
						item = item.filter(p => {
							let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
							let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
							return current >= from && current <= to;
						});
						let filterTarrifNormal = data.filter(dataF => dataF.item_type_code === item.item_type_code_cntr);
						let filterTarrifDanger = data.filter(dataF => dataF.item_type_code === item.item_type_code);
						if (filterTarrifNormal && filterTarrifNormal.length === 1) {
							tariffInfoNormal = filterTarrifNormal[0];
						} else if (filterTarrifNormal.length > 1) {
							response['iStatus'] = false;
							response['iMessage'] = `Không tìm thấy biểu cước hàng ${item.item_type_code_cntr} trong cấu hình giảm giá không phù hợp!`;
							return response;
						}
						if (filterTarrifDanger && filterTarrifDanger.length === 1) {
							tariffInfoDanger = filterTarrifDanger[0];
						} else if (filterTarrifDanger.length > 1) {
							response['iStatus'] = false;
							response['iMessage'] = `Không tìm thấy biểu cước hàng ${item.item_type_code} trong cấu hình giảm giá không phù hợp!`;
							return response;
						}
					})
					.catch(err => {
						response['iStatus'] = false;
						response['iPayload'] = err;
						response['iMessage'] = "Không tìm thấy biểu cước phù hợp!";
						return response;
					});
				if (!response['iStatus']) {
					return response;
				}
				if (!Object.values(tariffInfoNormal).length || !Object.values(tariffInfoDanger).length) {
					await this.cfsglobal
						.from("trf_std")
						.select("id", "trf_code", "trf_desc", "method_code", "item_type_code", "currency_code", "amt_min20", "amt_min40", "amt_min45", "amt_rt", "amt_non", "vat", "include_vat", "from_date", "to_date", "trf_name", "trf_temp", "class_code")
						.where({ method_code: "NKN", class_code: 1 })
						.whereIn("item_type_code", [item.item_type_code_cntr, item.item_type_code])
						.then(data => {
							let current = moment().toDate().getTime();
							data = data.filter(p => {
								let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
								let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
								return current >= from && current <= to;
							});
							if (!Object.values(tariffInfoNormal).length) {
								let filterTarrifNormal = data.filter(p => p.item_type_code === item.item_type_code_cntr);
								if (filterTarrifNormal.length === 1) {
									tariffInfoNormal = filterTarrifNormal[0];
								} else {
									response['iStatus'] = false;
									response['iMessage'] = `Không tìm thấy biểu cước hàng ${item.item_type_code_cntr} trong biểu cước chuẩn!`;
									return response;
								}
							}
							if (!Object.values(tariffInfoDanger).length) {
								let filterTarrifDanger = data.filter(p => p.item_type_code === item.item_type_code)
								if (filterTarrifDanger && filterTarrifDanger.length) {
									tariffInfoDanger = filterTarrifDanger[0];
								} else {
									response['iStatus'] = false;
									response['iMessage'] = `Không tìm thấy biểu cước hàng ${item.item_type_code} trong biểu cước chuẩn!`;
									return response;
								}
							}
						})
						.catch(err => {
							response['iStatus'] = false;
							response['iPayload'] = err;
							response['iMessage'] = "Không tìm thấy biểu cước phù hợp!";
							return response;
						});
					if (!response['iStatus']) {
						return response;
					}
				}
				let tariffInfodiff = {
					trf_desc: `Phí chênh lệch hàng nguy hiểm`,
					item_type_code: tariffInfoDanger.item_type_code,
					currency_code: tariffInfoDanger.currency_code,
					amt_rt: tariffInfoDanger.amt_rt,
					vat: tariffInfoDanger.vat,
					INCLUDE_vat: tariffInfoDanger.INCLUDE_vat,
					ACC_TYPE: tariffInfoDanger.ACC_TYPE
				};
				let quanlity = Number(item.cbm / 1);
				let vatPrice = tariffInfodiff.amt_rt * (tariffInfodiff.vat / 100) * quanlity;
				let unitPrice = tariffInfodiff.amt_rt * (1 - (tariffInfodiff.vat / 100));
				let cost = tariffInfodiff.amt_rt * (1 - (tariffInfodiff.vat / 100)) * quanlity;
				let totalPrice = vatPrice + cost;
				let tariffObj = {
					'unit_rate': FunctionModel.roundMoney(unitPrice), 'vat_price': FunctionModel.roundMoney(vatPrice), 'amount': FunctionModel.roundMoney(cost),
					'tamount': FunctionModel.roundMoney(totalPrice), 'cntrsztp': item.cntrsztp, 'qty': (Math.round(quanlity * 100) / 100).toFixed(2)
				}
				let TariffInfo = Object.assign(tariffObj, tariffInfodiff);
				arr.push(TariffInfo);
			}
			//Tính tiền chênh lệch nếu là lô là hàng nguy hiểm và item_type_code_cntr là thường - end
			// Kiểm tra có biểu cước ở bảng cấu hình lũy tiến không.
			let tariffInfo = await this.cfsglobal
				.from("config_day_level")
				.select("id", "name", "trf_code", "trf_desc", "day_level", "class_code", "customer_code", "method_code", "item_type_code", "currency_code", "amt_rt", "vat", "include_vat", "from_date", "to_date", "acc_type")
				.where({ trf_code: "LK", class_code: 1, method_code: "XKN", item_type_code: item.item_type_code })
				.then(data => {
					let current = moment().toDate().getTime();
					data = data.filter(p => {
						let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
						let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
						return current >= from && current <= to;
					});
					if (data && data.length < 1) {
						response['iStatus'] = false;
						response['iMessage'] = "Không tìm thấy biểu cước phù hợp!";
						return response;
					} else {
						response['iStatus'] = true;
						return data;
					}
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Phát sinh lỗi, liên hệ bộ phận kỹ thuật để được hỗ trợ!";
					return response;
				});
			if (!response['iStatus']) {
				return response;
			}
			tariffInfo = tariffInfo.filter(p => p.day_level < numberOfChargeDays);
			let tempTotal = 0;
			for (let i = 0; i < tariffInfo.length; i++) {
				let numberOfDayLevel = numberOfChargeDays - tariffInfo[i].day_level - tempTotal;
				tempTotal += numberOfDayLevel;
				// Tính tiền = số ngày lưu kho tính tiền * tấn doanh thu(m3) * Giá tấn doanh thu (*amt_rt)
				let m3 = item.cbm / 1;
				let vatPrice = numberOfDayLevel * tariffInfo[i].amt_rt * (tariffInfo[i].vat / 100) * m3;
				let cost = numberOfDayLevel * tariffInfo[i].amt_rt * (1 - tariffInfo[i].vat / 100) * m3;
				let unitPrice = tariffInfo[i].amt_rt * (1 - tariffInfo[i].vat / 100);
				let totalPrice = vatPrice + cost;
				let tariffObj = {
					'unit_rate': FunctionModel.roundMoney(unitPrice), 'vat_price': FunctionModel.roundMoney(vatPrice), 'amount': FunctionModel.roundMoney(cost),
					'tamount': FunctionModel.roundMoney(totalPrice), 'qty': (Math.round(numberOfDayLevel * m3 * 100) / 100).toFixed(2), 'numberOfFreeDays': numberOfFreeDays
				};
				let TariffInfo = Object.assign(tariffObj, tariffInfo[i]);
				arr.push(TariffInfo);
			}
		}))
			.then(() => {
				if (arr && !arr.length) {
					return response;
				} else {
					response['iStatus'] = true;
					response['iPayload'] = arr
					response['iMessage'] = "Truy vấn dữ liệu thành công!";
					return response;
				}
			});
	}

	async getToBillExOrderOutTrfStd(req) {
		var response = {
			iStatus: false,
			iMessage: "",
			iPayload: []
		};
		if (req.body && !req.body.length) {
			response["iStatus"] = false;
			response["iMessage"] = "Vui lòng cung cấp thông tin container và chủ hàng!";
			return response;
		}
		let arr = [];
		for (let i = 0; i < req.body.length; i++) {
			let whereObj = { class_code: 2 };
			req.body[i].booking_fwd ? whereObj['booking_fwd'] = req.body[i].booking_fwd : '';
			req.body[i].item_type_code ? whereObj['item_type_code'] = req.body[i].item_type_code : '';
			let dtPkgStock = await this.cfsglobal
				.from("DT_PACKAGE_STOCK")
				.select("*")
				.where(whereObj)
				.then(data => {
					if (data && data.length === 1) {
						response['iStatus'] = true;
						response['iPayload'] = data[0];
						response['iMessage'] = 'Truy vấn dữ liệu thành công!';
					} else if (data.length > 1) {
						response['iStatus'] = false;
						response['iPayload'] = data;
						response['iMessage'] = 'Số Booking Cont của kiện bị trùng!';
					} else {
						response['iStatus'] = false;
						response['iPayload'] = data;
						response['iMessage'] = 'Không tìm thấy số Booking của Cont!';
					}
					return response;
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Không tìm thấy kiện phù hợp của Cont!";
					return response;
				});
			if (!dtPkgStock['iStatus']) {
				return response;
			}
			let dtTIME_IN = moment(dtPkgStock.iPayload['TIME_IN'], "YYYY-MM-DDTHH:mm:ss.SSSZ");
			let numberOfStorageDays = moment().diff(dtTIME_IN, 'days');
			if (!numberOfStorageDays) {
				response['iStatus'] = false;
				response['iMessage'] = 'Lỗi thời gian nhập kho lớn hơn hiện tại!';
				return response;
			} else {
				numberOfStorageDays += 1;
			}
			//Kiểm tra cấu hình lưu kho xem có được giảm giá không
			let freeDayObj = { class_code: 2 };
			req.body[i].customer_code ? freeDayObj['customer_code'] = req.body[i].customer_code : '';
			req.body[i].item_type_code ? freeDayObj['item_type_code'] = req.body[i].item_type_code : '';
			let numberOfFreeDays = await this.cfsglobal
				.from("CONFIG_FREE_DAYS")
				.select("FREE_DAYS")
				.where(freeDayObj)
				.then(data => {
					if (data && data.length === 1) {
						return data[0].FREE_DAYS;
					} else if (data.length > 1) {
						response['iStatus'] = false;
						response['iMessage'] = `Cấu hình lưu kho của khách hàng ${req.body[i].customer_code} bị trùng!`;
						return response;
					} else {
						return 0;
					}
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Không tìm thấy ngày lưu kho!";
					return response;
				});
			if (!response['iStatus']) {
				return response;
			}
			let numberOfChargeDays = numberOfStorageDays - numberOfFreeDays;
			if (!numberOfChargeDays) break;
			//Kiểm tra có biểu cước ở bảng cấu hình lũy tuyến.
			let dtTrfInfo = await this.cfsglobal
				.from("config_day_level")
				.select("*")
				.where({ trf_code: 'LK', class_code: 2, method_code: 'XKX', item_type_code: req.body[i].item_type_code })
				.then(data => {
					let current = moment().toDate().getTime();
					data = data.filter(p => {
						let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
						let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
						return current >= from && current <= to;
					});
					if (data && data.length < 1) {
						response['iStatus'] = false;
						response['iMessage'] = 'Không tìm thấy biểu cước phù hợp!';
					} else {
						response['iStatus'] = true;
						response['iPayload'] = data;
					}
					return response;
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Không tìm thấy ngày lưu kho!";
					return response;
				});
			if (!response['iStatus']) {
				return response;
			}
			dtTrfInfo = dtTrfInfo.filter(p => p.day_level < numberOfChargeDays);
			let sumTotal = 0;
			for (let j = 0; j < dtTrfInfo.length; j++) {
				let numberOfDayLevel = numberOfChargeDays - dtTrfInfo[j].day_level - sumTotal;
				sumTotal += numberOfDayLevel;
				//Tính tiền = số ngày lưu kho tính tiền * tấn doanh thu m3 * Giá tấn doanh thu (*amt_rt)
				let m3 = req.body[i].cbm / 1;
				let vatPrice = numberOfDayLevel * dtTrfInfo[j].amt_rt * (dtTrfInfo[j].vat / 100) * m3;
				let cost = numberOfDayLevel * dtTrfInfo[j].amt_rt * (1 - dtTrfInfo[j].vat / 100) * m3;
				let unitPrice = dtTrfInfo[j].amt_rt * (1 - dtTrfInfo[j].vat / 100);
				let totalPrice = vatPrice + cost;
				let tempObj = {
					'unit_rate': FunctionModel.roundMoney(unitPrice), 'vat_price': FunctionModel.roundMoney(vatPrice), 'amount': FunctionModel.roundMoney(cost),
					'tamount': FunctionModel.roundMoney(totalPrice), 'qty': (Math.round(numberOfDayLevel * m3 * 100) / 100).toFixed(2), 'numberOfFreeDays': numberOfFreeDays
				};
				dtTrfInfo = Object.assign(tempObj, dtTrfInfo[j]);
				arr.push(dtTrfInfo);
			}
		}
		let cbmTotals = {};
		for (let i = 0; i < req.body.length; i++) {
			if (cbmTotals[req.body[i].item_type_code_cntr]) {
				cbmTotals[req.body[i].item_type_code_cntr] += req.body[i].cbm;
			} else {
				cbmTotals[req.body[i].item_type_code_cntr] = req.body[i].cbm;
			}
		}
		let grpList = Object.keys(cbmTotals).map(key => {
			return {
				item_type_code_cntr: key,
				m3: cbmTotals[key] / 1,
				cntrsztp: req.body[0].cntrsztp
			};
		});
		for (let i = 0; i < grpList.length; i++) {
			let whereObj = {
				method_code: 'XKX',
				trf_code: 'XK',
				class_code: 2,
				item_type_code: grpList[i].item_type_code_cntr
			};
			let dtTrfInfo = await this.cfsglobal
				.from("config_discount")
				.select("*")
				.where(whereObj)
				.then(data => {
					let current = moment().toDate().getTime();
					data = data.filter(p => {
						let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
						let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
						return current >= from && current <= to;
					});
					if (data && data.length === 1) {
						return data[0];
					}
					return [];
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Không tìm thấy biểu cước phù hợp!";
					return response;
				});
			if (!Object.values(dtTrfInfo).length) {
				dtTrfInfo = await this.cfsglobal
					.from("trf_std")
					.select("*")
					.where(whereObj)
					.then(data => {
						let current = moment().toDate().getTime();
						data = data.filter(p => {
							let from = moment(p.from_date, 'DD/MM/YYYY').toDate().getTime();
							let to = moment(p.to_date, 'DD/MM/YYYY').endOf('day').toDate().getTime();
							return current >= from && current <= to;
						});
						if (data && data.length === 1) {
							response["flag"] = false;
							return data[0];
						}
						response["flag"] = true;
						response['iStatus'] = false;
						response['iMessage'] = "Không tìm thấy biểu cước phù hợp!"
						return response;
					})
					.catch(err => {
						response['iStatus'] = false;
						response['iPayload'] = err;
						response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
						return response;
					});
			}
			if (response['flag']) {
				return response;
			}
			//ICD3: Tìm giá trị tối thiểu
			let minValueInfo = await this.cfsglobal
				.from("config_min_value")
				.select("*")
				.where("unit_invoice", "cbm")
				.then(data => {
					return data.filter(p => p.cntrsztp === FunctionModel.checkContSize(grpList[i].cntrsztp));
				})
				.catch(err => {
					response['iStatus'] = false;
					response['iPayload'] = err;
					response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
					return response;
				});
			if (minValueInfo && !(minValueInfo.length === 1)) {
				response['iStatus'] = false;
				response['iMessage'] = "Không tìm thấy giá trị tối thiểu của Cont!";
				return response;
			}
			//Tính toán đơn giá
			//FE gửi số lượng là m3 cũng là tất doanh thu, gửi CNTRSTP(kích cỡ ISO -> DT_CNTR_MNF)
			//Giá bán tấn doanh thu (AMT_TR này là giá bao gồm thuế), vat từ bảng biểu cước
			let quanlity = Number(grpList[i].m3) > minValueInfo[0]['min_value'] ? Number(grpList[i].m3) : minValueInfo[0]['min_value'];
			let vat_price = dtTrfInfo.amt_rt * (dtTrfInfo.vat / 100) * quanlity;
			let unit_rate = dtTrfInfo.amt_rt * (1 - (dtTrfInfo.vat / 100));
			let amount = dtTrfInfo.amt_rt * (1 - (dtTrfInfo / 100)) * quanlity;
			let tamount = vat_price + amount;
			let tempObj = { 'unit_rate': FunctionModel.roundMoney(unit_rate), 'vat_price': FunctionModel.roundMoney(vat_price), 'amount': FunctionModel.roundMoney(amount), 'tamount': FunctionModel.roundMoney(tamount), 'cntrsztp': grpList[i].cntrsztp, 'qty': (Math.round(quanlity * 100) / 100).toFixed(2) };
			dtTrfInfo = Object.assign(tempObj, dtTrfInfo);
			arr.push(dtTrfInfo);
		}
		response['iStatus'] = true;
		response['iPayload'] = arr;
		response['iMessage'] = 'Truy vấn dữ liệu thành công!';
		return response;
	}
}