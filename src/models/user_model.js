import databaseInstance from '../config/database.js';
import md5 from 'md5';
import FunctionModel from '../models/FunctionModel.js';

export default class UserModel {
    constructor() { this.cfsglobal = databaseInstance.getCfsglobal(); };

    async encrypt(string = '') {
        return md5(md5(process.env.SECRET_KEY) + md5(string));
    }

    async access(user, method) {
        if (!method && !user) {
            return false;
        }
        var fmenu = await this.cfsglobal
            .from('sa_menu')
            .select('*')
            .where({ 'user_id': user, 'view_page': method })
            .limit(1)
            .catch(err => console.log(err)) || [];
        if (!fmenu.length) {
            return false;
        }
        return true;
    }
}