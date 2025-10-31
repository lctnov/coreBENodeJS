import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import 'dotenv/config';
const jwtVerify = promisify(jwt.verify).bind(jwt);
// import Permissions from './permissions.js';
export default class pubFunction {
    async auth(req, res, next, resource, scope) {
        var cookie = req.cookies;
        if (cookie.ssid) {
            req.headers.authorization = `Bearer ${cookie.ssid}`;
        }
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            if (req.xhr) {
                return res.status(401).json({ iStatus: 401, iSuccess: false, iMessage: "Token xác thực không thành công!" });
            }
            return res.render('login');
        }
        var token = authHeader.split(' ')[1];
        try {
            var user = await jwtVerify(token, process.env.SECRET);
            if (!user) {
                return res.status(401).json({ iStatus: 401, iSuccess: false, iMessage: "Không tìm thấy người dùng!" });
            }
            let _checkResource = user.roles.includes(resource.split(':')[1]);
            let _checkScope = user.scope.includes(scope.split(':')[1]);
            if (_checkResource && _checkScope) {
                next();
            } else {
                return res.status(200).json({ iStatus: 401, iSuccess: false, iMessage: `Bạn chưa được phân quyền sử dụng chức năng này!` });
            }
        } catch (error) {
            return res.end('Lỗi truy cập người dùng!' + error);
        }
    }
}
