import databaseInstance from '../config/database.js';

export default class MenuModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); }
    async loadMenus(req) {
        var response = {
            iStatus: false,
            iMessage: "",
        };
        var query = await this.cfsglobal
            .from("sa_menu")
            .select("id", "menu_icon", "menu_code", "menu_name", "view_page", "view_class", "parent_code", "group_menu_code", "group_menu_name", "is_visible", "order_by")
            // .where({ 'user_id': String(req.body['user_id']) })
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
}