import moment from 'moment-timezone';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import https from 'https';
// import http from 'http';

export default class FunctionModel {
    constructor() { };
    static moment = moment;
    static KnexWhere(knex, filterObj, ext) {
        let filters = Object.keys(filterObj || {});

        for (let ii = 0; ii < filters.length; ii++) {
            let key = filters[ii];
            let field = filters[ii];
            if (ext) field = ext + '.' + key;
            let item = filterObj[key];
            //console.log('filters::',item);
            if (item) {
                let opr = item['operation'] || "=";
                if (opr == 'is')
                    knex.whereNull(field, (item.value != undefined ? item.value : item));
                else
                    if (opr == 'is not')
                        knex.whereNotNull(field, (item.value != undefined ? item.value : item));
                    else
                        if (opr == 'in')
                            knex.whereIn(field, (item.value != undefined ? item.value : item));
                        else
                            if (opr == 'not in')
                                knex.whereNotIn(field, (item.value != undefined ? item.value : item));
                            else
                                if (opr == 'like')
                                    knex.where(field, opr, '%' + (item.value != undefined ? item.value : item) + '%');
                                else
                                    if (opr == 'left like')
                                        knex.where(field, opr, '%' + (item.value != undefined ? item.value : item));
                                    else
                                        if (opr == 'right like')
                                            knex.where(field, opr, (item.value != undefined ? item.value : item) + '%');
                                        else
                                            knex.where(field, opr, (item.value != undefined ? item.value : item));

            }
        }
        return knex;
    }

    static dbDateTime(strDateTime, format = 'YYYY-MM-DD HH:mm:ss') {
        if (!strDateTime || !strDateTime.includes("/") && !strDateTime.includes("-")) {
            return '';
        }

        if (strDateTime.includes("-") && moment(strDateTime).isValid()) {
            return moment(strDateTime, format).format(format);
        }

        var dts = strDateTime.split(' ');
        var date = dts[0].split('/').reverse().join('-');  //date('Y-m-d', strtotime(implode('-', array_reverse(explode('/', $dts[0])))));
        var datetime = date + ' ' + (dts[1] || '00:00:00');
        return moment(datetime, format).format(format);
    }

    async sendMail(req, res) {
        //Thoilc(*Note)-Test mail
        //Link: https://ethereal.email/create
        const transporter = {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'lambert.koss@ethereal.email',
                pass: 'qyQv2F84SHKWXpqgx9'
            }
        };
        //--------------end config test mail--------------//
        //Thoilc(*Note)-Lấy theo cấu hình mail dbs
        let query = await gtosglobal('SYS_CONFIG').select('*')
            .limit(1)
            .catch((error) => console.log(error)) || [];
        let dtConfig = query[0].ConfigJSON;
        let port = JSON.parse(dtConfig).secure === true ? '465' : '587';
        const config = {
            host: JSON.parse(dtConfig).host,
            // port: JSON.parse(dtConfig).port,
            port: port,
            secure: JSON.parse(dtConfig).secure, // use TLS = true || upgrade later with STARTTLS = false
            ignoreTLS: false,
            auth: JSON.parse(dtConfig).auth,
        };
        port == '587' ? config["tls"] = {
            // do not fail on invalid certs
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        } : {
            // must provide server name, otherwise TLS certificate check will fail
            servername: "example.com"
        };
        //--------------end config mail--------------//
        let transport = nodemailer.createTransport(config);
        //Thoilc(*Note)-Mailgen template
        let mailGeneral = new Mailgen({
            theme: "default",
            product: {
                name: "Company LCTNOV-SOFT",
                link: "https://softmail.com/"
            }
        });
        //Thoilc(*Note)-Nội dung mail
        let response = {
            body: {
                intro: `Thông tin hoá đơn đã được chúng tôi phát hành thành công, chúng tôi xin gửi đến bạn nội dung để tham khảo.`,
            }
        };
        let mail = mailGeneral.generate(response);
        //Thoilc(*Note)-Title mail
        let message = {
            from: req.Email,
            to: req.mailTo,
            subject: '[LCTNOV] Thông báo hoá đơn điện tử',
            text: 'For clients with plaintext support only',
            html: mail,
        };

        return new Promise(async (resolve, reject) => {
            transport.sendMail(message)
                .then((data) => {
                    resolve({ data: data, iStatus: true, Message: "Susscess send mail to!" });
                    // console.log("Server is ready to take our messages");
                })
                .catch((error) => {
                    reject({ error: error, iStatus: false, Message: "Error send mail to!" });
                    // console.log(error);
                });
        });
    }

    static randomChar(length) {
        var result = "";
        var characters = "0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static generateIDBulk(id) {
        return String(moment(id).unix()) + this.randomChar(2);
    }

    static roundMoney(money) {
        return (Math.round(money * 10) / 10).toFixed(0);
    }

    static checkContSize(sizeType) {
        switch (sizeType.charAt(0)) {
            case "2": return "20";
            case "4": return "40";
            case "L":
            case "M":
            case "9": return "45";
            default: return "";
        };
    }

    static async ccurl(data, options) {
        return new Promise(async (resolve, reject) => {
            options['timeout'] = options['timeout'] || 10000;
            // const request = options['isHttps'] ? https : http;
            const request = https;
            // delete options['isHttps'];

            const req = request.request(options, (res) => {
                res.setEncoding('utf8');
                var endWithoutData = true;
                var response = "";
                res.on('data', chunk => {
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
            req.on('error', (err) => {
                reject(`Yêu cầu gửi bị vấn đề: ${err.message}`);
            });
            if (data)
                req.write(data);
            req.end();
        });
    }
}