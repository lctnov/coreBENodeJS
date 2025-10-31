import http from "http";
import https from "https";
import { v4 as uuidv4 } from 'uuid';

export default class CommonModel {
	constructor() { };
	static async ccurl(data, options) {
		return new Promise(async (resolve, reject) => {
			options['timeout'] = options['timeout'] || 10000;
			options['method'] = options['method'] || 'POST';
			const request = options['isHttps'] ? https : http;
			delete options['isHttps'];
			const req = request.request(options, (res) => {
				res.setEncoding('utf8');
				let endWithoutData = true;
				let response = "";
				res.on('data', (chunk) => {
					endWithoutData = false;
					if (!chunk) {
						reject("Lỗi không thể yêu cầu trả dữ liệu!");
					}
					else {
						response += chunk;
					}
				});
				res.on('timeout', () => {
					reject("Thời gian yêu cầu trả dữ liệu quá tải!");
					res.end();
				});
				res.on('end', () => {
					if (endWithoutData) {
						reject("Không có dữ liệu trả về!"); return;
					}
					resolve(response);
				});
			});
			req.on('error', (e) => {
				reject(`Yêu cầu gửi bị vấn đề: ${e.message}`);
			});
			if (data) {
				req.write(data);
			}
			req.end();
		});
	}

	static async newGuid() {
		return String(uuidv4()).toUpperCase();
	}

	static async is_valid_xml(xmlstr) {
		return String(xmlstr).match(/\<(\w)+\>/g) && xmlstr.match(/\<\/(\w)+\>/g);
	}

	static async strReplaceAssoc(replace, subject) {
		Object.keys(replace).forEach((k) => {
			let v = replace[k];
			subject = subject.replaceAll(k, v);
		});
		return subject;
	}

	static async arrayChunk(arr, size = 2000) {
		arr = arr ? (Array.isArray(arr) ? arr : ['']) : [''];
		return Math.ceil(size / (Object.keys(arr[0]).length || 1));
	}

	static async htmlspecialchars(string) {
		return string.toString()
			.trim()
			.replace(/\r/g, "")
			.replace(/\n/g, "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	static async DOCSO() {
		const t = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
		const r = (r, n) => {
			let o = "", a = Math.floor(r / 10), e = r % 10;
			if (a > 1) {
				o = " " + t[a] + " mươi";
				if (e === 1) o += " mốt";
			} else if (a === 1) {
				o = " mười";
				if (e === 1) o += " một";
			} else if (n && e > 0) {
				o = " lẻ";
			}
			if (e === 5 && a >= 1) o += " lăm";
			if (e === 4 && a >= 1) o += " tư";
			if ((e > 1 || (e === 1 && a === 0))) o += " " + t[e];
			return o;
		}
		const n = (n, o) => {
			let a = "", e = Math.floor(n / 100);
			n %= 100;
			if (o || e > 0) {
				a = " " + t[e] + " trăm";
				a += r(n, true);
			} else {
				a = r(n, false);
			}
			return a;
		};
		const o = (t, r) => {
			let o = "", a = Math.floor(t / 1e6);
			t %= 1e6;
			if (a > 0) {
				o = n(a, r) + " triệu";
				r = true;
			}
			let e = Math.floor(t / 1e3);
			t %= 1e3;
			if (e > 0) {
				o += n(e, r) + " ngàn";
				r = true;
			}
			if (t > 0) {
				o += n(t, r);
			}
			return o;
		};
		return {
			doc: (r) => {
				if (r === 0) return t[0];
				let n = "", a = "";
				do {
					const ty = r % 1e9;
					r = Math.floor(r / 1e9);
					n = r > 0 ? o(ty, true) + a + n : o(ty, false) + a + n;
					a = " tỷ";
				} while (r > 0);
				return n.trim();
			}
		}
	}

	static async convert_number_to_words_old(so) {
		return (await this.DOCSO()).doc(so);
	}

	static async convert_number_to_words(money = 0, currency = '') {
		let newMoney = money;
		let prefixReduce_vn = "";
		let prefixReduce_en = "";
		if (money < 0) {
			newMoney = Math.abs(money);
			prefixReduce_vn = "giảm ";
			prefixReduce_en = " off";
		}
		let textnumber = prefixReduce_vn + this.convert_number_to_words_vi(newMoney, currency);
		if (currency == 'USD') {
			textnumber += " (" + this.convert_number_to_words_en(newMoney, currency) + prefixReduce_en + ")";
		}
		return textnumber;
	}

	static async convert_number_to_words_vi(money = 0, currency = '') {
		const decimal = " phẩy ";
		const Text = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
		const TextLuythua = ["", "nghìn", "triệu", "tỷ", "ngàn tỷ", "triệu tỷ", "tỷ tỷ"];
		if (money < 0) {
			return "Tiền phải là số nguyên dương lớn hơn số 0";
		}
		let textnumber = "";
		let fraction = null;
		if (money.toString().includes('.')) {
			[money, fraction] = money.toString().split('.');
		}
		const length = money.toString().length;
		const unread = Array(length).fill(0);
		for (let i = 0; i < length; i++) {
			const so = money.toString().charAt(length - i - 1);
			if (so == 0 && i % 3 == 0 && unread[i] == 0) {
				let j = 0;
				for (j = i + 1; j < length; j++) {
					const so1 = money.toString().charAt(length - j - 1);
					if (so1 != 0) {
						break;
					}
				}
				if (parseInt((j - i) / 3) > 0) {
					for (let k = i; k < parseInt((j - i) / 3) * 3 + i; k++) {
						unread[k] = 1;
					}
				}
			}
		}
		for (let i = 0; i < length; i++) {
			const so = money.toString().charAt(length - i - 1);
			if (unread[i] == 1) {
				continue;
			}
			if (i % 3 == 0 && i > 0) {
				textnumber = TextLuythua[i / 3] + " " + textnumber;
			}
			if (i % 3 == 2) {
				textnumber = 'trăm ' + textnumber;
			}
			if (i % 3 == 1) {
				textnumber = 'mươi ' + textnumber;
			}
			textnumber = Text[so] + " " + textnumber;
		}
		textnumber = textnumber.replace("không mươi", "lẻ");
		textnumber = textnumber.replace("lẻ không", "");
		textnumber = textnumber.replace("mươi không", "mươi");
		textnumber = textnumber.replace("một mươi", "mười");
		textnumber = textnumber.replace("mươi năm", "mươi lăm");
		textnumber = textnumber.replace("mươi một", "mươi mốt");
		textnumber = textnumber.replace("mười năm", "mười lăm");
		if (fraction !== null && !isNaN(fraction) && parseFloat(fraction) > 0) {
			switch (currency) {
				case "USD":
					fraction = (fraction + "000000").substring(0, 2);
					textnumber += ' Đô-La Mỹ và ' + this.convert_number_to_words_vi(fraction) + ' cent.';
					break;
				case "VND":
					textnumber += ' đồng và ' + this.convert_number_to_words_vi(fraction) + ' hào.';
					break;
				default:
					textnumber += decimal;
					const words = Array.from(fraction.toString()).map(number => Text[number]);
					textnumber += words.join(' ');
					break;
			}
		} else {
			switch (currency) {
				case "USD":
					textnumber += ' Đô-La Mỹ';
					break;
				case "VND":
					textnumber += ' đồng';
					break;
			}
		}
		return textnumber;
	}

	static async convert_number_to_words_en(money = 0, currency = '') {
		const decimal = " point ";
		const Text = {
			0: "zero",
			1: "one",
			2: "two",
			3: "three",
			4: "four",
			5: "five",
			6: "six",
			7: "seven",
			8: "eight",
			9: "nine",
			10: 'ten',
			11: 'eleven',
			12: 'twelve',
			13: 'thirteen',
			14: 'fourteen',
			15: 'fifteen',
			16: 'sixteen',
			17: 'seventeen',
			18: 'eighteen',
			19: 'nineteen',
			20: 'twenty',
			30: 'thirty',
			40: 'forty',
			50: 'fifty',
			60: 'sixty',
			70: 'seventy',
			80: 'eighty',
			90: 'ninety'
		};
		const TextLuythua = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];
		if (money < 0) {
			return "Money must be greater than 0";
		}
		let textnumber = "";
		let fraction = null;
		if (money.toString().includes('.')) {
			[money, fraction] = money.toString().split('.');
		}
		const length = money.toString().length;
		const unread = Array(length).fill(0);
		for (let i = 0; i < length; i++) {
			const so = money.toString().charAt(length - i - 1);
			if (so == 0 && i % 3 == 0 && unread[i] == 0) {
				let j = 0;
				for (j = i + 1; j < length; j++) {
					const so1 = money.toString().charAt(length - j - 1);
					if (so1 != 0) {
						break;
					}
				}
				if (parseInt((j - i) / 3) > 0) {
					for (let k = i; k < parseInt((j - i) / 3) * 3 + i; k++) {
						unread[k] = 1;
					}
				}
			}
		}
		for (let i = 0; i < length; i++) {
			const so = money.toString().charAt(length - i - 1);
			if (unread[i] == 1) {
				continue;
			}
			if (i % 3 == 0 && i > 0) {
				textnumber = TextLuythua[i / 3] + " " + textnumber;
			}
			if (i % 3 == 2) {
				textnumber = 'hundred ' + textnumber;
			}
			if (i == 1 && so == 1) {
				const sox = money.toString().slice(-2);
				textnumber = Text[sox];
				continue;
			}
			if (i % 3 == 1) {
				textnumber = (so > 0 ? Text[so * 10] : "") + "-" + textnumber;
				continue;
			}
			textnumber = Text[so] + " " + textnumber;
		}
		textnumber = textnumber.replace("zero-", "");
		textnumber = textnumber.replace("and zero", "");
		textnumber = textnumber.replace("-zero", "");
		if (fraction !== null && !isNaN(fraction) && parseFloat(fraction) > 0) {
			switch (currency) {
				case "USD":
					fraction = (fraction + "000000").substring(0, 2);
					textnumber += ' U.S. Dollars and ' + this.convert_number_to_words_en(fraction) + ' Cents.';
					break;
				case "VND":
					textnumber += ' dong and ' + this.convert_number_to_words_en(fraction) + ' hao.';
					break;
				default:
					textnumber += decimal;
					const words = Array.from(fraction.toString()).map(number => Text[number]);
					textnumber += words.join(' ');
					break;
			}
		} else {
			switch (currency) {
				case "USD":
					textnumber += ' U.S. Dollars.';
					break;
				case "VND":
					textnumber += ' dong.';
					break;
			}
		}
		return textnumber;
	}

	static async getContSize(szType) {
		if (!szType) {
			return "";
		}
		switch (szType.substring(0, 1)) {
			case "2":
				return '20';
			case "4":
				return '40';
			case "L":
			case "M":
			case "9":
				return '45';
			default: return "";
		}
	}

	//post to vnpt invoice service
	static async curlToInvoiceService(funcName, srvName, xmlBody, config) {
		return new Promise(async (resolve, reject) => {
			let xmlBase = config.xmlbase;
			let xmlSend = xmlBase.replace('XML_BODY', xmlBody);
			const options = {
				hostname: config.url,
				path: '/' + srvName + '.asmx',
				method: 'POST',
				headers: {
					'Content-Type': 'application/soap+xml;charset=UTF-8',
					'SOAPAction': `"http://tempuri.org/${funcName}"`,
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
					'Content-Length': Buffer.byteLength(xmlSend)
				}
			};
			try {
				const xmlResponse = await this.ccurl(xmlSend, options);
				resolve(xmlResponse);
			} catch (err) {
				reject(err instanceof Error ? err.message : err);
			}
		});
	}

	// Get result from vnpt response
	static async getResultData(funcName, xmlResponse) {
		if (!xmlResponse) {
			return "";
		}
		let funcResult = funcName + "Result";
		let regx = new RegExp(`<${funcResult}>(.*)<\/${funcResult}>`, "s");
		let result = xmlResponse.match(regx);
		return result && result.length > 1 ? result[1] : "";
	}

	// Get error by code
	static async getERR_ImportAndPublish(errNumber) {
		let result = '';
		switch (errNumber) {
			case "1":
				result = "Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng";
				break;
			case "3":
				result = "Dữ liệu xml đầu vào không đúng quy định";
				break;
			case "7":
				result = "User name không phù hợp, không tìm thấy company tương ứng cho user.";
				break;
			case "20":
				result = "Pattern và serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và serial truyền vào";
				break;
			case "5":
				result = "Không phát hành được hóa đơn.";
				break;
			case "10":
				result = "Lô có số hóa đơn vượt quá max cho phép";
				break;
			default:
				result = "Lỗi phát hành hoá đơn, mã lỗi: " + errNumber;
				break;
		}
		return `[Hệ thống VNPT] ${result}`;
	}

	static async getConfig(partnerCode, terminalCode, testMode = 1) {
		return {
			"url": "invoice.com.vn",
			"isHTTPS": true,
			"VNPT_SRV_ID": "aaa",
			"VNPT_SRV_PWD": "aaa",
			"VNPT_PUBLISH_INV_ID": "aaa",
			"VNPT_PUBLISH_INV_PWD": "aaa",
			"INV_PATTERN": "1/001",
			"INV_SERIAL": "C23TSP",
			"PortalURL": "invoice.com.vn/",
			"PUBLISH_SERICE_ADDR": "PublishService",
			"PUBLISH_XML": {
				"PRODUCT_HEADER": "<Inv><key>MAIN_PINCODE</key><Invoice><CusCode>CUS_CODE</CusCode><CusName>CUS_NAME</CusName><CusAddress>CUS_ADDR</CusAddress><CusPhone/><CusTaxCode>CUS_TAXCODE</CusTaxCode><PaymentMethod>PAYMENT_METHOD</PaymentMethod><CurrencyUnit>CURRENCY_UNIT</CurrencyUnit><ExchangeRate>EXCHANGE_RATE</ExchangeRate><KindOfService/><Products>PRODUCT_CONTENT</Products><Total>SUM_AMOUNT</Total><VATRate>VAT_RATE</VATRate><VATAmount>VAT_AMOUNT</VATAmount><Amount>TOTAL_AMOUNT</Amount><AmountInWords>IN_WORDS</AmountInWords><Extra>VIEW_PINCODE</Extra><Extra1>INV_TYPE</Extra1><Extra2>VIEW_EXCHANGE_RATE</Extra2><Extra6>CUS_TAXCODE</Extra6></Invoice></Inv>",
				"PRODUCT_CONTENT": "<Product><ProdName>TRF_DESC</ProdName><ProdUnit>INV_UNIT</ProdUnit><ProdQuantity>QTY</ProdQuantity><ProdPrice>UNIT_RATE</ProdPrice><Total>AMT</Total><IsSum>0</IsSum></Product>"
			},
			"fnDownloadPDF": {
				"0": "downloadInvPDFNoPay",
				"1": "downloadInvPDFFkeyNoPay"
			},
			"fnDownloadXML": {
				"0": "downloadInvNoPay",
				"1": "downloadInvFkeyNoPay"
			},
			"xmlbase": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\"><soap12:Body>XML_BODY</soap12:Body></soap12:Envelope>",
			"html_template_filename": "eInvoice-template.html"
		};
	}

	static async getERR_CancelInv(errnumber) {
		let result = '';
		switch (errnumber) {
			case "1":
				result = "Tài khoản đăng nhập sai";
				break;
			case "2":
				result = "Không tồn tại hóa đơn cần hủy";
				break;
			case "8":
				result = "Hóa đơn đã được thay thế rồi, hủy rồi";
				break;
			case "9":
				result = "Trạng thái hóa đơn ko được hủy";
				break;
			default:
				result = `[${errnumber}] Unknown error`;
				break;
		}
		return `[Hệ thống hóa đơn điện tử] ${result}`;
	}

	static async getInvoiceXML(fkey = '', pattern = '', serial = '', number = '') {
		return new Promise(async (resolve, reject) => {
			const config = await this.getConfig('VNPT', "ITC");
			let withFkey = fkey != "" ? 1 : 0;
			let funcName = config.fnDownloadXML[withFkey];
			let tagFindingInfo = fkey != "" ? "<fkey>" + fkey + "</fkey>" : `<invToken>${pattern};${serial};${number}</invToken>`;
			let xmlContent = `<${funcName} xmlns="http://tempuri.org/">
				  ${tagFindingInfo}
				  <userName>${config.VNPT_SRV_ID}</userName>
				  <userPass>${config.VNPT_SRV_PWD}</userPass>
				  </${funcName}>`;
			this.curlToInvoiceService(funcName, "PortalService", xmlContent, config)
				.then(xmlResponse => {
					let responseContent = this.getResultData(funcName, xmlResponse);
					let errContent = '';
					switch (responseContent) {
						case 'ERR:1':
							errContent = "Tài khoản đăng nhập sai!";
							break;
						case 'ERR:4':
							errContent = "Không tìm thấy Pattern";
							break;
						case 'ERR:6':
							errContent = "Không tìm thấy hóa đơn";
							break;
						case 'ERR:7':
							errContent = "User name không phù hợp, không tìm thấy company tương ứng cho user.";
							break;
						case 'ERR:11':
							errContent = "Hóa đơn chưa thanh toán nên không xem được";
							break;
						case 'ERR:12':
							errContent = `Do lỗi đường truyền hóa đơn chưa được cấp mã cơ quan thuế (CQT), quý khách vui lòng truy cập sau để nhận hóa đơn hoặc truy cập link ${config.PortalURL} để xem trước hóa đơn chưa có mã`;
							break;
						case 'ERR:':
							errContent = "Lỗi khác!";
							break;
						default:
							if (responseContent.includes('ERR:')) {
								errContent = "Lỗi khác!";
							}
							break;
					}
					if (errContent != '') {
						reject({ success: false, message: `[Hệ thống VNPT] ${errContent}` })
					}
					resolve({ success: true, message: responseContent })
				})
				.catch(err => {
					reject({ success: false, message: err })
				});
		});
	}

	static async decodeEntities(encodedString) {
		var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
		var translate = {
			"nbsp": " ",
			"amp": "&",
			"quot": "\"",
			"lt": "<",
			"gt": ">"
		};
		return encodedString.replace(translate_re, function (match, entity) {
			return translate[entity];
		}).replace(/&#(\d+);/gi, function (match, numStr) {
			var num = parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
	}
}