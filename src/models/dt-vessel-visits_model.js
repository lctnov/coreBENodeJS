import databaseInstance from '../config/database.js';
import moment from 'moment';
import FunctionModel from '../models/FunctionModel.js';

export default class VesselVisitModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadVesselVisit(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };

        var query = await this.cfsglobal
            .from("dt_vessel_visit")
            .select("id", "voyagekey", "vessel_name", "inbound_voyage", "outbound_voyage", "eta", "etd", "tos_shipkey")
            .orderBy('eta', 'desc')
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

    async loadVesselVisitCode(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        let _from = req.body._from ? moment(req.body._from).startOf('day').format('YYYY-MM-DD HH:mm:ss') : '';
        let _to = req.body._to ? moment(req.body._to).endOf('day').format('YYYY-MM-DD HH:mm:ss') : '';

        var query = await this.cfsglobal
            .from("dt_vessel_visit")
            .select("id", "voyagekey", "vessel_name", "inbound_voyage", "outbound_voyage", "eta", "etd", "callsign", "imo", "tos_shipkey")
            .whereBetween("eta", [_from, _to])
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

    async saveVesselVisit(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        let arrDuplicate = [], arrDuplicateVessel = [];
        return Promise.all(req.body.map(async (item) => {
            switch (item.status) {
                case 'insert':
                    if (!item.vessel_name) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên tàu!';
                        return response;
                    }
                    if (!item.inbound_voyage) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại chuyến nhập!';
                        return response;
                    }
                    if (!item.outbound_voyage) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại chuyến xuất!';
                        return response;
                    }
                    if (!item.eta) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại ngày tàu đến!';
                        return response;
                    }
                    if (!item.etd) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại ngày tàu đi!';
                        return response;
                    }
                    if (!item.create_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!';
                        return response;
                    }
                    let whereObj = {
                        vessel_name: item.vessel_name,
                        inbound_voyage: item.inbound_voyage,
                        outbound_voyage: item.outbound_voyage,
                        callsign: item.callsign,
                        imo: item.imo
                    };
                    item.tos_shipkey ? whereObj['tos_shipkey'] = item.tos_shipkey : '';
                    // ------- check exist dt-vessel-vissit code --------
                    let checkCode = await this.cfsglobal
                        .from("dt_vessel_visit")
                        .select("rowguid")
                        .where(whereObj)
                        .catch(err => console.log(err)) || [];

                    if (checkCode && !checkCode.length) {
                        let dtVessel = {
                            voyagekey: `${item.vessel_name.slice(0, 4)}${item.inbound_voyage}${moment(item.eta, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() ?
                                moment(item.eta, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYYMMDD") :
                                moment(item.eta, "DD/MM/YYYY HH:mm:ss").format("YYYYMMDD")}`,
                            vessel_name: item.vessel_name,
                            inbound_voyage: item.inbound_voyage,
                            outbound_voyage: item.outbound_voyage,
                            eta: moment(item.eta, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() ?
                                moment(item.eta, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
                                moment(item.eta, 'DD/MM/YYYY HH:mm:ss').format("YYYY-MM-DD HH:mm:ss"),
                            etd: moment(item.etd, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() ?
                                moment(item.etd, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
                                moment(item.etd, 'DD/MM/YYYY HH:mm:ss').format("YYYY-MM-DD HH:mm:ss"),
                            imo: item.imo ? item.imo : 'NA',
                            callsign: item.callsign ? item.callsign : 'NA',
                            tos_shipkey: item.tos_shipkey ? item.tos_shipkey : null,
                            create_by: item.create_by,
                        };
                        await this.cfsglobal.from("dt_vessel_visit")
                            .insert(dtVessel)
                            .returning('*')
                            .then(data => {
                                response['iStatus'] = true;
                                response['iPayload'] = data;
                                response['iMessage'] = "Lưu dữ liệu thành công!";
                            })
                            .catch(err => console.log(err)) || [];
                    } else {
                        arrDuplicate.push(checkCode[0]);
                        arrDuplicateVessel = await arrDuplicate.map(item => item.vessel_name);
                    }
                    // -----------------------------------------------
                    break;
                case 'update':
                    if (!item.id) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại số id!';
                        return response;
                    }
                    if (!item.update_by) {
                        response['iStatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người cập nhật!';
                        return response;
                    }
                    item.eta = moment(item.eta, 'DD/MM/YYYY').format("YYYY-MM-DD HH:mm:ss");
                    item.etd = moment(item.etd, 'DD/MM/YYYY').format("YYYY-MM-DD HH:mm:ss");
                    item.update_date = moment().format("YYYY-MM-DD HH:mm:ss");
                    try {
                        delete item.stt;
                        delete item.id;
                        delete item.isChecked;
                        delete item.status;

                        return await this.cfsglobal.from("dt_vessel_visit").where('id', item.id)
                            .update({
                                voyagekey: item.voyagekey || null,
                                vessel_name: item.vessel_name || null,
                                inbound_voyage: item.inbound_voyage || null,
                                outbound_voyage: item.outbound_voyage || null,
                                eta: item.eta || null,
                                etd: item.etd || null,
                                callsign: item.callsign || null,
                                imo: item.imo || null,
                                tos_shipkey: item.tos_shipkey || null,
                                update_by: item.update_by,
                                update_date: item.update_date
                            })
                            .then(() => {
                                response['iStatus'] = true;
                                response['iPayload'].push(item);
                                response['iMessage'] = "Lưu dữ liệu thành công!";
                            })
                            .catch(err => console.log(err)) || [];
                    } catch (err) {
                        response['iStatus'] = false;
                        response['iPayload'] = err
                        response['iMessage'] = "Không thể lưu mới dữ liệu!";
                    }
                    break;
                default:
                    return { iStatus: false, iPayload: item.status, iMessage: 'Không tìm thấy trạng thái!' };
            }
        })).then(() => {
            if (arrDuplicate && arrDuplicate.length) {
                response["iStatus"] = false;
                response["iPayload"] = arrDuplicateVessel;
                response["iMessage"] = `Số tàu chuyến: ${arrDuplicateVessel} đã tạo!`;
                return response;
            } else {
                return response;
            }
        });
    }

    async delVesselVisit(req) {
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
                await this.cfsglobal.from("dt_vessel_visit")
                    .where("id", item.id)
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

    async getVTOSVesselVisit(req) {
        var response = {
            iStatus: false,
            iMessage: "",
            iPayload: []
        };
        const fromDateFormatted = moment(req.body.fromDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const toDateFormatted = moment(req.body.toDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        try {
            if (!req.body.fromDate && !req.body.toDate) {
                response['iStatus'] = false;
                response['iMessage'] = "Vui lòng gửi từ ngày đến ngày!";
                return response;
            }

            const dataSend = JSON.stringify({
                fromDate: fromDateFormatted,
                toDate: toDateFormatted,
            });
            const opts = {
                hostname: process.env.API_TOS_URL,
                path: '/index.php/api_server/CFStoVTOS_getVessel',
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: dataSend,
            };
            const responseData = await FunctionModel.ccurl(dataSend, opts);
            const data = JSON.parse(responseData);
            let objTOS = {
                tos_rowguid: null,
                function_patch: 'Vessel',
                function_name: 'Insert',
                post_data: '',
                get_data: JSON.stringify(req.body),
                mes_status: response['Status'],
                create_by: req.body.create_by,
                create_date: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            if (data.Payload && data.Payload.length) {
                let dtVTOS = data.Payload.map(item => {
                    return {
                        voyagekey: item.ShipKey,
                        vessel_name: item.ShipName,
                        inbound_voyage: item.ImVoy,
                        outbound_voyage: item.ExVoy,
                        eta: item.ETA,
                        etd: item.ETD,
                        callsign: item.Callsign,
                        imo: item.IMO,
                        tos_shipkey: item.ShipKey
                    };
                });
                objTOS.post_data = JSON.stringify({
                    iStatus: true,
                    iPayload: dtVTOS,
                    iMessage: "Truy vấn dữ liệu thành công!"
                });
                objTOS.mes_status = true;
                response["iStatus"] = true;
                response["ResSever"] = data;
                response["ReqBE"] = JSON.stringify({
                    fromDate: fromDateFormatted,
                    toDate: toDateFormatted,
                });
                response["test"] = `${process.env.API_TOS_URL}/index.php/api_server/CFStoVTOS_getVessel`;
                response["iPayload"] = dtVTOS;
                response["iMessage"] = "Nạp dữ liệu thành công!";
                //Ghi nhận lịch sử của TOS
                await this.cfsglobal.from("api_tos").insert(objTOS);
                return response;
            } else {
                objTOS.post_data = JSON.stringify({
                    iStatus: false,
                    iPayload: [],
                    iMessage: "Không tìm thấy dữ liệu!"
                });
                objTOS.mes_status = false;
                response["iStatus"] = false;
                response["ResSever"] = data;
                response["ReqBE"] = JSON.stringify({
                    fromDate: fromDateFormatted,
                    toDate: toDateFormatted,
                });
                response["test"] = `${process.env.API_TOS_URL}/index.php/api_server/CFStoVTOS_getVessel`;
                response["iMessage"] = "Không tìm thấy dữ liệu!";
                response["iPayload"] = [];
                //Ghi nhận lịch sử của TOS
                await this.cfsglobal.from("api_tos").insert(objTOS);
                return response;
            }
        } catch (err) {
            console.log("ERROR", err);
            response["iStatus"] = false;
            response["ReqBE"] = JSON.stringify({
                fromDate: fromDateFormatted,
                toDate: toDateFormatted,
            });
            response["iPayload"] = [];
            response["test"] = `${process.env.API_TOS_URL}/index.php/api_server/CFStoVTOS_getVessel`;
            response["iMessage"] = "Phát sinh lỗi, vui lòng liên hệ bộ phận kỹ thuật!";
            return response;
        }
    }
}