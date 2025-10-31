import KeyCloakService from '../libs/keyCloakService.js';
import { jwtDecode } from "jwt-decode";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default class UserController {
    async login(req, res) {
        let keyCloak = new KeyCloakService();
        keyCloak.loginUser(req.body.username, req.body.password, req.body.remember, req, res).then(async grant => {
            var response = {
                iStatus: false,
                iMessage: "",
            };
            var info = jwtDecode(JSON.parse(grant.__raw)["access_token"]);
            var exp = info["exp"];
            response['user_info'] = {
                USER_ID: info["preferred_username"],
                USER_NAME: info['name'],
                roles: info['realm_access'].roles,
                email: info['email']
            };
            var access_token = jwt.sign({ user: info["preferred_username"], roles: [...response['user_info'].roles], scope: info.scope }, process.env.SECRET, { expiresIn: exp });
            res.cookie('ssid', access_token, {
                credentials: true,
                withCredentials: true,
                sameSite: true,
                httpOnly: true,
                secure: true,
                maxAge: new Date().setMonth(new Date().getMonth() + 1)
            });
            if (response['rememberme']) {
                res.cookie('rememberme', response['rememberme'], { maxAge: new Date().setMonth(new Date().getMonth() + 1) });
            } else {
                res.clearCookie('rememberme');
            }

            response['access_token'] = access_token;
            response['iStatus'] = true;
            response['iMessage'] = "Đăng nhập thành công!";
            res.status(200).json(response);
        }).catch(error => {
            // TODO put login failed code here (we can return 401 code)
            res.end('Login error: ' + error);
        });
    }

    async logout(req, res) {
        res.clearCookie('lctnov-token');
        res.json({ message: "Đăng xuất thành công!" });

        //     global.del_userdata();
        // delete req.user_info;
        // res.clearCookie('ssid');
        // res.clearCookie('rememberme');
        // res.redirect('/')
    }
}

