import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class blockModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadblock(req) {
        var response = {
            istatus: false,
            iMessage: "",
            iPayload: []
        };
        var query = await this.cfsglobal
            .from("bs_block")
            .select("id", "warehouse_code", "block", "tier_count", "slot_count", "status")
            .orderBy('block', 'tier_count', 'slot_count')
            .catch(err => console.log(err)) || [];
        if (query && query.length) {
            response["istatus"] = true;
            response["iPayload"] = query;
            response["iMessage"] = "Nạp dữ liệu thành công!";
        } else {
            response["istatus"] = false;
            response["iMessage"] = "Không có dữ liệu!";
        }
        return response;
    }

    async loadFilterblock(req) {
        var response = {
            istatus: false,
            iMessage: "",
            iPayload: []
        };
        var query = await this.cfsglobal
            .from("bs_block")
            .select("block")
            .catch(err => console.log(err)) || [];
        if (query && query.length) {
            response["istatus"] = true;
            response["iPayload"] = [...new Set(query)];
            response["iMessage"] = "Nạp dữ liệu thành công!";
        } else {
            response["istatus"] = false;
            response["iMessage"] = "Không có dữ liệu!";
        }
        return response;
    }

    async loadCell(req) {
        var response = {
            istatus: false,
            iMessage: "",
            iPayload: []
        };
        try {
            if (!req.body.warehouse_code) {
                response['istatus'] = false;
                response['iMessage'] = 'Vui lòng cung cấp mã kho!';
                return response;
            }
            if (req.body.block && !req.body.block.length) {
                response['istatus'] = false;
                response['iMessage'] = 'Vui lòng cung cấp mã dãy!';
                return response;
            }
            await this.cfsglobal.transaction(async (trx) => {
                const dtPallet = await this.retrievePallet(req.body, trx);
                const dtPkgManifest = await this.retievePakage(trx);
                const dtJobStock = await this.processData(dtPallet, dtPkgManifest);
                response['istatus'] = true;
                response['iPayload'] = dtJobStock;
                response['iMessage'] = 'Nạp dữ liệu thành công!';
            });
        } catch (err) {
            response['istatus'] = false;
            response['iPayload'] = err;
            response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
        }
        return response;
    }

    async retrievePallet(dataPallet, trx) {
        return await this.cfsglobal
            .from("bs_block")
            .select("warehouse_code", "block", "slot_count", "tier_count", "status")
            .where("warehouse_code", dataPallet.warehouse_code)
            .whereIn("block", dataPallet.block)
            .orderBy(["block", "tier_count", "slot_count"]).transacting(trx);
    }

    async retievePakage(trx) {
        return await this.cfsglobal
            .from("dt_pallet_stock AS dtPalletStock")
            .select("dtPalletStock.id", "dtPalletStock.house_bill", "dtPalletStock.booking_fwd", "dtPalletStock.pallet_no", "dtPalletStock.warehouse_code", "dtPalletStock.idref_stock", "dtPakageStock.cargo_piece", "dtPakageStock.class_code", "jobStock.job_type", "dtPalletStock.block", "dtPalletStock.slot", "dtPalletStock.tier", "dtPalletStock.status", "dtPalletStock.unit_code")
            .leftJoin("dt_package_stock AS dtPakageStock", "dtPakageStock.id", "dtPalletStock.idref_stock")
            .leftJoin("job_stock AS jobStock", "jobStock.pallet_no", "dtPalletStock.pallet_no").transacting(trx);
    }

    async processData(dtPallet, dtPkgManifest) {
        const dtJobStock = [];
        dtPallet.forEach((itemCell, idx) => {
            if (dtPkgManifest && dtPkgManifest.length) {
                dtPkgManifest.forEach(itemCelNot => {
                    const dtObjJobStock = {};
                    if (
                        itemCell.warehouse_code === itemCelNot.warehouse_code &&
                        itemCell.block === itemCelNot.block &&
                        itemCell.slot_count === itemCelNot.slot &&
                        itemCell.tier_count === itemCelNot.tier &&
                        itemCelNot.status === 'S'
                    ) {
                        dtObjJobStock['id'] = itemCelNot.id;
                        dtObjJobStock['house_bill'] = itemCelNot.house_bill;
                        dtObjJobStock['booking_fwd'] = itemCelNot.booking_fwd;
                        dtObjJobStock['pallet_no'] = itemCelNot.pallet_no;
                        dtObjJobStock['cargo_piece'] = itemCelNot.cargo_piece;
                        dtObjJobStock['job_type'] = itemCelNot.job_type;
                    } else {
                        dtObjJobStock['id'] = '';
                        dtObjJobStock['house_bill'] = '';
                        dtObjJobStock['booking_fwd'] = '';
                        dtObjJobStock['pallet_no'] = '';
                        dtObjJobStock['cargo_piece'] = '';
                        dtObjJobStock['job_type'] = '';
                    }
                    dtObjJobStock['index'] = idx + 1;
                    dtObjJobStock['warehouse_code'] = itemCell.warehouse_code;
                    dtObjJobStock['block'] = itemCell.block;
                    dtObjJobStock['tier'] = itemCell.tier_count;
                    dtObjJobStock['slot'] = itemCell.slot_count;
                    dtObjJobStock['status'] = itemCell.status;
                    dtObjJobStock['idref_stock'] = itemCelNot.idref_stock;
                    dtObjJobStock['unit_code'] = itemCelNot.unit_code;
                    dtJobStock.push(dtObjJobStock);
                });
            } else {
                const dtNotObjJobStock = {};
                dtNotObjJobStock['warehouse_code'] = itemCell.warehouse_code;
                dtNotObjJobStock['block'] = itemCell.block;
                dtNotObjJobStock['tier'] = itemCell.tier_count;
                dtNotObjJobStock['slot'] = itemCell.slot_count;
                dtNotObjJobStock['status'] = itemCell.status;
                dtJobStock.push(dtNotObjJobStock);
            }
        });
        let dtFilter = dtJobStock.filter(item => item.house_bill || item.booking_fwd ? true : false);
        let dtNotFilter = dtJobStock.filter(item => !item.house_bill || !item.booking_fwd ? true : false);
        let dtNew = dtFilter.concat(dtNotFilter).filter((item, idx, data) => {
            return data.findIndex(p => (p.warehouse_code === item.warehouse_code && p.block === item.block && p.tier === item.tier && p.slot === item.slot)) === idx;
        });
        let dtStock = dtNew.map(data => {
            let dtNewJobStock = {};
            Object.keys(data).map(key => {
                dtNewJobStock['wareHouse_' + key] = data[key];
            });
            return dtNewJobStock;
        });
        // Lấy giá trị để so sanh và sx, hiện tại index là stt = 1, 2, 3...
        // ascending = [{stt: 1},{stt: 2}].sort((a,b) => 1 - 2)
        // descending = [{stt: 1},{stt: 2}].sort((a,b) => 2 - 1)
        return dtStock.sort((a, b) => Number(a.wareHouse_index) - Number(b.wareHouse_index));
    }

    async saveblock(req) {
        var response = {
            istatus: false,
            iMessage: "",
            iPayload: []
        };
        return await Promise.all(req.body.map(async (item) => {
            let status = item.status ? item.status : undefined;
            let warehouse_code = item.warehouse_code ?? null;
            let block = item.block ?? null;
            let tier_count = item.tier_count ?? null;
            let slot_count = item.slot_count ?? null;
            switch (status) {
                case 'insert':
                    if (!warehouse_code || !block || !tier_count || !slot_count) {
                        response['istatus'] = false;
                        response["iMessage"] = "Vui lòng nhập đầy đủ thông tin dãy!";
                        return response;
                    };
                    // ------- check exist block --------
                    let checkCode = await this.cfsglobal
                        .from("bs_block")
                        .select("rowguid")
                        .where({ "warehouse_code": warehouse_code, "block": block })
                        .catch(err => console.log(err)) || [];

                    if (checkCode && checkCode.length) {
                        response['istatus'] = false;
                        response['iMessage'] = "Thông tin dãy đã tồn tại!";
                        return response;
                    }
                    // -----------------------------------------------
                    let blockData = [];
                    for (let itier = 1; itier <= tier_count; itier++) {
                        for (let islot = 1; islot <= slot_count; islot++) {
                            blockData.push({
                                warehouse_code: warehouse_code,
                                block: block,
                                tier_count: itier,
                                slot_count: islot,
                                status: 0,
                                create_by: item.CREATE_BY ?? null,
                            });
                        }
                    }
                    try {
                        // Split blockData into batches of 100 rows
                        const batches = [];
                        for (let i = 0; i < blockData.length; i += 100) {
                            batches.push(blockData.slice(i, i + 100));
                        }
                        const insertedData = [];
                        for (const batch of batches) {
                            const result = await this.cfsglobal.from("bs_block")
                                .insert(batch)
                                .returning('*');
                            insertedData.push(...result);
                        }
                        response['istatus'] = true;
                        response['iPayload'] = insertedData;
                        response['iMessage'] = "Lưu dữ liệu thành công!";
                        return response;
                    } catch (err) {
                        response['istatus'] = false;
                        response['iPayload'] = err;
                        response['iMessage'] = "Không thể lưu mới dữ liệu!";
                    }
                    break;
                case 'update':
                    if (!item.update_by) {
                        response['istatus'] = false;
                        response['iMessage'] = 'Vui lòng cung cấp lại tên người tạo!'
                        return response;
                    }
                    try {
                        await this.cfsglobal.from("bs_block")
                            .where({ 'warehouse_code': warehouse_code, "block": block })
                            .del()
                            .then(() => response['istatus'] = true);
                        if (response['istatus']) {
                            // -----------------------------------------------
                            let blockData = [];
                            for (let itier = 1; itier <= tier_count; itier++) {
                                for (let islot = 1; islot <= slot_count; islot++) {
                                    blockData.push({
                                        warehouse_code: warehouse_code,
                                        block: block,
                                        tier_count: itier,
                                        slot_count: islot,
                                        status: 0,
                                        create_by: item.update_by ?? null,
                                        update_by: item.update_by ?? null,
                                        update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                    });
                                }
                            }
                            return await this.cfsglobal.from("bs_block")
                                .insert(blockData)
                                .returning('*')
                                .then(data => {
                                    response['istatus'] = true;
                                    response['iPayload'] = data;
                                    response['iMessage'] = "Lưu dữ liệu thành công!";
                                });
                        }
                    } catch {
                        response['istatus'] = false;
                        response['iMessage'] = "Không thể lưu mới dữ liệu!";
                    }
                    break;
                default:
                    return { istatus: false, iPayload: item.status, iMessage: 'Không tìm thấy trạng thái' };
            }
        })).then(returnValue => {
            return response;
        });
    }

    async saveblockstatus(req) {
        var response = {
            istatus: false,
            iMessage: "",
            iPayload: []
        };
        if (!req.body.warehouse_code) {
            response['istatus'] = false;
            response['iMessage'] = "Vui lòng cung cấp mã kho!";
            return response;
        }
        if (!req.body.block) {
            response['istatus'] = false;
            response['iMessage'] = "Vui lòng cung cấp khu vực!";
            return response;
        }
        if (!req.body.tier_count) {
            response['istatus'] = false;
            response['iMessage'] = "Vui lòng cung cấp tầng!";
            return response;
        }
        if (!req.body.slot_count) {
            response['istatus'] = false;
            response['iMessage'] = "Vui lòng cung cấp chổ!";
            return response;
        }
        let whereObj = {
            warehouse_code: req.body.warehouse_code || null,
            block: req.body.block || null,
            tier_count: req.body.tier_count || null,
            slot_count: req.body.slot_count || null,
        };
        try {
            await this.cfsglobal
                .from('bs_block')
                .where(whereObj)
                .update({
                    status: req.body.status === 0 ? 2 : 0,
                    update_by: req.body.update_by,
                    update_date: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            response['istatus'] = true;
            response['iPayload'] = { ...whereObj, status: req.body.status === 0 ? 2 : 0 };
            response['iMessage'] = 'Lưu dữ liệu thành công!';
        } catch (err) {
            response['istatus'] = false;
            response['iPayload'] = err;
            response['iMessage'] = "Lỗi truy vấn dữ liệu, vui lòng liên hệ kỹ thuật!";
        }
        return response;
    }

    async delblock(req) {
        var response = {
            istatus: false,
            iMessage: "",
        };
        return Promise.all(req.body.map(async item => {
            if (!item.warehouse_code) {
                response['istatus'] = false;
                response['iMessage'] = "Vui lòng cung cấp mã kho!";
                return response;
            }
            if (!item.block) {
                response['istatus'] = false;
                response['iMessage'] = "Vui lòng cung cấp khu vực!";
                return response;
            }
            try {
                delete item.stt;
                delete item.id;
                delete item.isChecked;
                delete item.status;

                await this.cfsglobal.from("bs_block")
                    .where({ 'warehouse_code': item.warehouse_code, 'block': item.block })
                    .del();
                response['istatus'] = true;
                response['iMessage'] = "Xóa dữ liệu thành công!";
            } catch {
                response['istatus'] = false;
                response['iMessage'] = "Xóa dữ liệu không thành công!";
            }
        })).then((value) => {
            return response;
        });
    }
}