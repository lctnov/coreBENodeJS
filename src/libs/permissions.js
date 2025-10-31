'use strict';
import UrlPattern from 'url-pattern';

export default class Permissions {

    constructor(permissions) {
        this.permissions = [];
        permissions.forEach(permission => {
            let url = new UrlPattern(permission[0]);
            let method = permission[1].toUpperCase();
            let resource = permission[2];
            let scope = permission[3];
            this.permissions.push({
                url: url,
                method: method,
                resource: resource,
                scope: scope
            });
        });
    }

    notProtect(...publicUrls) {
        publicUrls.forEach(url => this.publicUrls.push(new UrlPattern(url)));
        return this;
    }

    findPermission(request) {
        return this.permissions.find(
            p => request.method.toUpperCase() === p.method && p.url.match(request.originalUrl)
        );
    }

    isNotProtectedUrl(request, resource, scopes) {
        let _url = request.url;
        let _flagUrl = this.permissions.some(item => item.url.regex.test(_url));
        let _flagResource = this.permissions.filter(item => resource.includes(item.resource.split(':')[1]));
        if (_flagUrl && _flagResource && _flagResource.length) return true;
        return false;
    }
}

