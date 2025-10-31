import databaseInstance from '../config/database.js';
import moment from 'moment';

export default class capacityModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadCapacity(req) {
        var response = {
            istatus: false,
            iMessage: "",
        };
        var queryA = await this.cfsglobal
            .from("bs_block")
            .select("warehouse_code", "block")
            .max('slot_count as slot_count')
            .max('tier_count as tier_count')
            .groupBy('block', 'warehouse_code')
            .catch(err => console.log(err)) || [];
        var queryB = await this.cfsglobal
            .from("bs_block")
            .select("warehouse_code", "block")
            .count('status as available_cell')
            .where('status', 1)
            .groupBy('block', 'warehouse_code')
            .catch(err => console.log(err)) || [];

        var mergedData = {};

        queryA.forEach(item => {
            const key = `${item.warehouse_code}-${item.block}`;
            mergedData[key] = { ...(mergedData[key] || { available_cell: null }), ...item };
        });

        queryB.forEach(item => {
            const key = `${item.warehouse_code}-${item.block}`;
            mergedData[key] = { ...(mergedData[key] || { available_cell: null }), ...item };
        });
        const result = Object.values(mergedData);
        if (result && result.length) {
            let warehouse_codetemp = result.map(item => item.warehouse_code);
            warehouse_codetemp = [...new Set(warehouse_codetemp)];
            let dataReturn = [];
            for (let i = 0; i < warehouse_codetemp.length; i++) {
                let temp = result.filter(p => p.warehouse_code === warehouse_codetemp[i]).map(item => {
                    return {
                        warehouse_code: item.warehouse_code,
                        block: item.block,
                        capacity: Number(item.slot_count) * Number(item.tier_count),
                        unavailable_cell: item.available_cell ? item.available_cell : 0,
                        available_cell: item.available_cell ? (Number(item.slot_count) * Number(item.tier_count)) - item.available_cell : (Number(item.slot_count) * Number(item.tier_count)) - 0
                    }
                });

                let tempObj = {
                    warehouse_code: warehouse_codetemp[i],
                    capacity: 0,
                    available_cell: 0,
                    unavailable_cell: 0
                };
                temp.map(item => {
                    tempObj['capacity'] += Number(item.capacity);
                    tempObj['available_cell'] += Number(item.available_cell);
                    tempObj['unavailable_cell'] += Number(item.unavailable_cell);
                });
                dataReturn.push(tempObj);
            }
            response['istatus'] = true;
            response['iPayload'] = dataReturn;
            response["iMessage"] = "Nạp dữ liệu thành công!";
        } else {
            response["istatus"] = false;
            response["iMessage"] = "Không có dữ liệu!";
        }
        return response;
    }

    async loadStatictics(req) {
        var response = {
            istatus: false,
            iPayload: [],
            iMessage: "",
        };
        try {
            let _from, _to;
            if (req.body.month) {
                _from = moment(req.body.month, 'YYYY-MM').startOf('month');
                _to = moment(req.body.month, 'YYYY-MM').endOf('month');
            }
            if (Object.keys(String(req.body.quarter)).length) {
                _from = moment(req.body.quarter?.year, 'YYYY').quarter(Number(req.body.quarter?.quarter)).startOf('quarter');
                _to = moment(req.body.quarter?.year, 'YYYY').quarter(Number(req.body.quarter?.quarter)).endOf('quarter');
            }
            if (req.body.year) {
                _from = moment(req.body.year, 'YYYY').startOf('year');
                _to = moment(req.body.year, 'YYYY').endOf('year');
            }
            let from_date = moment(_from).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            let to_date = moment(_to).endOf('day').format('YYYY-MM-DD HH:mm:ss');
            let query = this.cfsglobal.raw(`select t0.cntrno as cntrno, t1.cntrsztp as cntrsztp, (case when t0.class_code=1 then t0.house_bill else case when t0.class_code=2 then t0.booking_fwd end end) as hb_bk, t0.item_type_code 
            as item_type_code, t1.customer_name as customer_name, t0.cargo_piece as cargo_piece, t0.cargo_weight as cargo_weight, t0.cbm as cbm, t0.warehouse_code as warehouse_code, (case when 
            t0.class_code=1 then t0.tkhn_no else case when t0.class_code=2 then t0.tkhx_no end end) as tlhq, t0.tkhn_no as tkhn_no, t0.order_no as order_no, (DATE_PART('day', CURRENT_DATE - t0.time_in) + 1) AS stock_time, * from dt_package_stock t0 inner join dt_package_mnf_ld t1 on t0.voyagekey=t1.voyagekey and (t0.class_code= 1 and t0.class_code=t1.class_code and t0.house_bill=t1.house_bill) or (t0.class_code=2 and t0.class_code=t1.class_code and t0.booking_fwd=t1.booking_fwd) where t0.time_in BETWEEN '${from_date}' AND '${to_date}' AND t0.status IN ('S', 'D')`);
            console.log(query.toString());
            query = await query.catch(err => console.log(err)) || [];
            if (query && query.length) {
                response['istatus'] = true;
                response['iPayload'] = query;
                response["iMessage"] = "Nạp dữ liệu thành công!";
            } else {
                response["istatus"] = false;
                response["iMessage"] = "Không có dữ liệu!";
            }
            return response;
        } catch (err) {
            console.log("err", err);
        }
    }
}